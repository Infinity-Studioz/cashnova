// src/app/api/budgets/categories/route.ts
// Category-specific operations (separate file)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { month, category, allocated, action } = body; // action: 'update', 'create', 'delete'

    if (action === 'create') {
      // Create new category budget
      if (!category || !allocated || allocated <= 0) {
        return NextResponse.json(
          { error: 'Category name and positive allocation amount required' },
          { status: 400 }
        );
      }

      // Check if category already exists
      const existingCategory = await CategoryBudget.findOne({
        userId: session.user.email,
        month,
        category
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: `Category "${category}" already exists for this month` },
          { status: 409 }
        );
      }

      const newCategory = new CategoryBudget({
        userId: session.user.email,
        month,
        category,
        allocated,
        spent: 0,
        AIRecommendation: `New category created - monitor spending patterns`
      });

      await newCategory.save();

      // Check budget balance
      const totalAllocated = await CategoryBudget.aggregate([
        {
          $match: { userId: session.user.email, month }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$allocated' }
          }
        }
      ]);

      const budget = await Budget.findOne({ userId: session.user.email, month });
      const budgetWarning = budget && totalAllocated[0]?.total > budget.totalBudget
        ? `Total category allocations (₦${totalAllocated[0].total.toLocaleString()}) exceed main budget (₦${budget.totalBudget.toLocaleString()})`
        : null;

      return NextResponse.json({
        success: true,
        category: {
          ...newCategory.toObject(),
          formattedAllocated: new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
          }).format(allocated).replace('NGN', '₦')
        },
        warning: budgetWarning
      }, { status: 201 });
    }

    else if (action === 'delete') {
      // Delete category budget
      if (!category) {
        return NextResponse.json(
          { error: 'Category name required' },
          { status: 400 }
        );
      }

      const categoryBudget = await CategoryBudget.findOneAndDelete({
        userId: session.user.email,
        month,
        category
      });

      if (!categoryBudget) {
        return NextResponse.json(
          { error: `Category "${category}" not found` },
          { status: 404 }
        );
      }

      // Warn if category had spending
      const warnings = [];
      if (categoryBudget.spent > 0) {
        warnings.push(`Category had ₦${categoryBudget.spent.toLocaleString()} in spending - transactions remain uncategorized`);
      }

      return NextResponse.json({
        success: true,
        message: `Category "${category}" deleted successfully`,
        freedUpAmount: categoryBudget.allocated,
        formattedFreedAmount: new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
        }).format(categoryBudget.allocated).replace('NGN', '₦'),
        warnings
      });
    }

    else {
      return NextResponse.json(
        { error: 'Invalid action. Use "create" or "delete"' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error managing category budget:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to manage category budget. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}