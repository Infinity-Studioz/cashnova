// src/app/api/ai/chat/route.ts - OpenAI Integration for Nigerian Financial Coach
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import Conversation from "@/models/Conversation";
import Transaction from "@/models/Transaction";
import Budget from "@/models/Budget";
import Goal from "@/models/Goal";
import AIInsight from "@/models/AIInsight";
import { authOptions } from "@/utils/authOptions";

// Nigerian financial context prompt for OpenAI
const NIGERIAN_FINANCIAL_CONTEXT = `
You are CashNova AI, an expert Nigerian financial advisor with deep understanding of:

NIGERIAN ECONOMIC CONTEXT:
- Nigerian currency (Naira ₦), inflation rates, and economic volatility
- Local banking systems (GTBank, Zenith, Access, UBA, First Bank, etc.)
- Mobile money platforms (PalmPay, OPay, Kuda, etc.)
- Nigerian salary structures (monthly payments, 13th month bonuses, end-of-month cycles)
- Local expense patterns (transport, food prices, data/airtime costs, rent advances)

CULTURAL FINANCIAL PRACTICES:
- Family financial obligations and support systems
- Traditional savings methods (ajo, esusu, cooperative societies)
- Religious giving (tithe, zakat, offerings)
- Seasonal expenses (school fees in January/September, festive seasons)
- Nigerian investment options (fixed deposits, treasury bills, mutual funds, real estate)

LOCAL CHALLENGES:
- Forex restrictions and naira volatility
- Frequent cash shortages and digital payment adoption
- Infrastructure costs (generator fuel, water, internet)
- Transportation challenges and ride-hailing costs
- Economic uncertainty and inflation protection

COMMUNICATION STYLE:
- Use Nigerian context in all examples and advice
- Format currency as ₦X,XXX.XX (Nigerian format)
- Be encouraging while realistic about Nigerian economic realities
- Reference local services, banks, and financial products
- Use familiar Nigerian financial terms and concepts

Always provide practical, culturally-aware financial advice tailored to Nigerian conditions.
`;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { message, conversationId, context = "general_finance" } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get user's financial context for personalized advice
    const [userTransactions, userBudget, userGoals] = await Promise.all([
      Transaction.find({ userId: session.user.email })
        .sort({ date: -1 })
        .limit(10)
        .lean(),
      Budget.findOne({
        userId: session.user.email,
        month: new Date().toISOString().slice(0, 7),
      }).lean(),
      Goal.find({
        userId: session.user.email,
        isActive: true,
      })
        .limit(5)
        .lean(),
    ]);

    // Build personalized context
    const personalizedContext = buildPersonalizedContext(
      userTransactions,
      userBudget,
      userGoals
    );

    // Handle conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: session.user.email,
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      // Create new conversation
      conversation = await Conversation.create({
        userId: session.user.email,
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        context: context,
        messages: [],
        isActive: true,
        summary: {
          totalMessages: 0,
          lastActiveDate: new Date(),
          topics: [],
          keyInsights: [],
        },
      });
    }

    // Prepare OpenAI conversation history
    const conversationHistory = conversation.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add new user message to conversation
    conversation.messages.push({
      id: new mongoose.Types.ObjectId().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    });
    await conversation.save();

    try {
      // Call OpenAI API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `${NIGERIAN_FINANCIAL_CONTEXT}

USER FINANCIAL CONTEXT:
${personalizedContext}

CONVERSATION HISTORY:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")}

USER'S NEW MESSAGE: ${message}

Provide helpful, Nigerian-context financial advice. Be specific and actionable.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.content[0].text;

      // Add AI response to conversation
      conversation.messages.push({
        id: new mongoose.Types.ObjectId().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        metadata: {
          model: "claude-sonnet-4",
          nigerianContext: {
            isSchoolFeeSeason: [1, 9].includes(new Date().getMonth() + 1),
            isSalaryCycle: new Date().getDate() >= 25,
            isFestiveSeason: [12, 1].includes(new Date().getMonth() + 1),
          },
        },
      });
      await conversation.save();

      // Generate actionable insights
      const insights = await generateActionableInsights(
        session.user.email,
        message,
        aiResponse,
        personalizedContext
      );

      // Update conversation summary
      // conversation.generateSummary();
      await conversation.save();

      return NextResponse.json({
        success: true,
        response: aiResponse,
        conversationId: conversation._id,
        insights: insights,
        suggestions: generateFollowUpSuggestions(context, message),
        nigerianContext: {
          currency: "NGN",
          economicTips: getCurrentEconomicTips(),
        },
      });
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError);

      // Fallback to rule-based response
      const fallbackResponse = generateFallbackResponse(
        message,
        personalizedContext
      );

      await conversation.addMessage("assistant", fallbackResponse);

      return NextResponse.json({
        success: true,
        response: fallbackResponse,
        conversationId: conversation._id,
        fallback: true,
        insights: [],
        suggestions: generateFollowUpSuggestions(context, message),
      });
    }
  } catch (error: any) {
    console.error("Error in AI chat:", error);

    return NextResponse.json(
      {
        error: "Failed to process chat message. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Helper functions
function buildPersonalizedContext(
  transactions: any[],
  budget: any,
  goals: any[]
): string {
  let context = "USER'S FINANCIAL PROFILE:\n";

  if (transactions.length > 0) {
    const totalSpent = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    context += `- Recent spending: ₦${totalSpent.toLocaleString()}\n`;
    context += `- Recent income: ₦${totalIncome.toLocaleString()}\n`;

    // Top spending categories
    const categorySpending = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          const category = t.userCategory || t.category;
          acc[category] = (acc[category] || 0) + t.amount;
          return acc;
        },
        {} as Record<string, number>
      );

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]: [string, any]) => (b as number) - (a as number))
      .slice(0, 3);

    context += `- Top spending categories: ${topCategories
      .map(
        ([cat, amount]) => `${cat} (₦${(amount as number).toLocaleString()})`
      )
      .join(", ")}\n`;
  }

  if (budget) {
    context += `- Current month budget: ₦${budget.totalBudget.toLocaleString()}\n`;
    context += `- Budget spent: ₦${budget.spent.toLocaleString()}\n`;
  }

  if (goals.length > 0) {
    context += `- Active goals: ${goals
      .map(
        (g) =>
          `${g.title} (₦${g.currentAmount.toLocaleString()}/₦${g.targetAmount.toLocaleString()})`
      )
      .join(", ")}\n`;
  }

  return context;
}

async function generateActionableInsights(
  userId: string,
  userMessage: string,
  aiResponse: string,
  context: string
): Promise<any[]> {
  const insights = [];

  // Detect if user is asking about budgeting
  if (userMessage.toLowerCase().includes("budget")) {
    try {
      const budgetInsight = await AIInsight.create({
        userId: userId,
        type: "spending_pattern",
        category: "Budget",
        title: "Budget Optimization Opportunity",
        message: "Consider reviewing your budget allocation for better savings",
        confidence: 0.75,
        impact: "medium",
        actionable: true,
        nigerianContext: {
          relevantToEconomy: true,
          seasonalFactor: false,
        },
      });

      insights.push({
        type: "budgeting",
        title: budgetInsight.title,
        message: budgetInsight.message,
        action: "create_budget",
      });
    } catch (error) {
      console.error("Error generating budget insight:", error);
    }
  }

  // Detect savings opportunities
  if (
    userMessage.toLowerCase().includes("save") ||
    userMessage.toLowerCase().includes("goal")
  ) {
    insights.push({
      type: "savings",
      title: "Savings Opportunity",
      message:
        "Based on your spending patterns, consider setting up automatic savings",
      action: "create_goal",
    });
  }

  return insights;
}

function generateFollowUpSuggestions(
  context: string,
  message: string
): string[] {
  const suggestions = [];

  if (context === "budget_help") {
    suggestions.push("How can I optimize my monthly budget?");
    suggestions.push("What's the ideal budget allocation for Nigeria?");
    suggestions.push("Help me create a budget for next month");
  } else if (context === "savings_advice") {
    suggestions.push("What are the best savings options in Nigeria?");
    suggestions.push("How much should I save for emergencies?");
    suggestions.push("Help me set up automatic savings");
  } else {
    suggestions.push("How can I save more money this month?");
    suggestions.push("What's my spending pattern analysis?");
    suggestions.push("Help me create a financial goal");
  }

  return suggestions;
}

function getCurrentEconomicTips(): string[] {
  const currentMonth = new Date().getMonth() + 1;
  const tips = [];

  if ([1, 9].includes(currentMonth)) {
    tips.push("School fees season - budget for education expenses");
  }

  if ([12, 1].includes(currentMonth)) {
    tips.push("Festive season - avoid overspending on celebrations");
  }

  tips.push("Keep building your emergency fund for naira volatility");
  tips.push("Consider digital banks for better savings rates");

  return tips;
}

function generateFallbackResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("budget")) {
    return `I understand you're asking about budgeting. Based on Nigerian financial best practices, I recommend allocating 30% for housing, 25% for food, and 15% for transport. ${context.includes("budget") ? "I can see you have budget data - would you like me to analyze your current allocation?" : "Would you like help creating a budget?"}`;
  }

  if (lowerMessage.includes("save")) {
    return `For savings in Nigeria, I recommend starting with an emergency fund covering 3-6 months of expenses. Consider high-yield savings accounts with digital banks or treasury bills for better returns than traditional savings accounts.`;
  }

  if (lowerMessage.includes("goal")) {
    return `Setting financial goals is crucial in the Nigerian economy. Consider goals like emergency fund, school fees, rent advance, or vacation fund. Start with small, achievable targets and gradually increase them.`;
  }

  return `Thank you for your question about Nigerian finance. I'm here to help you manage your money better in the Nigerian context. You can ask me about budgeting, saving strategies, goal setting, or any financial challenges you're facing.`;
}

// GET endpoint for conversation history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (conversationId) {
      // Get specific conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        userId: session.user.email,
      });

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        conversation: conversation.toObject(),
      });
    } else {
      // Get user's recent conversations
      const conversations = await Conversation.find({
        userId: session.user.email,
        isActive: true,
      })
        .sort({ "summary.lastActiveDate": -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        conversations: conversations.map((c) => ({
          id: c._id,
          title: c.title,
          context: c.context,
          messageCount: c.messages.length,
          lastActive: c.summary.lastActiveDate,
          preview:
            c.messages.length > 0
              ? c.messages[c.messages.length - 1].content.slice(0, 100)
              : "",
        })),
      });
    }
  } catch (error: any) {
    console.error("Error fetching conversations:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch conversations. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
