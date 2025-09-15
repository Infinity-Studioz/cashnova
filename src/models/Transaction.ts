// src/models/Transaction.ts
import mongoose, { Schema } from "mongoose";
import {
  ITransaction,
  ITransactionModel,
  TransactionType,
  PaymentMethod,
  TransactionStatus,
  RecurringPattern,
} from "@/types";

// Nigerian-specific merchants for auto-categorization
const NIGERIAN_MERCHANTS = {
  BANKS: [
    "GTBank",
    "First Bank",
    "Zenith Bank",
    "Access Bank",
    "UBA",
    "Stanbic IBTC",
  ],
  TRANSPORT: ["Uber", "Bolt", "InDrive", "Lagos BRT", "Abuja Metro"],
  SHOPPING: ["Shoprite", "Game", "Spar", "Park n Shop", "Jumia", "Konga"],
  FOOD: ["KFC", "Dominos", "Mr Biggs", "Chicken Republic", "Sweet Sensation"],
  BILLS: ["NEPA/EKEDC", "DSTV", "GOtv", "Airtel", "MTN", "Glo", "9mobile"],
  FUEL: ["Total", "Mobil", "NNPC", "Oando", "Conoil"],
} as const;

const TransactionSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      maxlength: 500,
    },
    merchant: {
      type: String,
      maxlength: 100,
    },
    location: {
      type: String,
      maxlength: 100,
    },
    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "card",
        "bank_transfer",
        "mobile_money",
        "pos",
        "online",
        "other",
      ],
      default: "cash",
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: function (this: ITransaction) {
        return this.recurring;
      },
    },
    status: {
      type: String,
      enum: ["completed", "pending", "flagged"],
      default: "completed",
    },
    autoCategory: {
      type: String,
    },
    userCategory: {
      type: String,
    },
    tags: [
      {
        type: String,
        maxlength: 50,
      },
    ],
    receiptUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    indexes: [
      { userId: 1, date: -1 },
      { userId: 1, category: 1 },
      { userId: 1, type: 1 },
      { userId: 1, recurring: 1 },
    ],
  }
);

// Add these indexes for better API performance
TransactionSchema.index({ userId: 1, date: -1, type: 1 });
TransactionSchema.index({ userId: 1, category: 1, date: -1 });

// Virtual for getting the effective category (user override or auto)
TransactionSchema.virtual("effectiveCategory").get(function (
  this: ITransaction
) {
  return this.userCategory || this.category;
});

// Static method for smart categorization
TransactionSchema.statics.categorizeTransaction = function (
  merchant?: string,
  note?: string,
  amount?: number
): string {
  const merchantLower = merchant?.toLowerCase() || "";
  const noteLower = note?.toLowerCase() || "";
  const searchText = `${merchantLower} ${noteLower}`.toLowerCase();

  // Priority 1: Food & Dining (check first for grocery stores)
  if (
    NIGERIAN_MERCHANTS.FOOD.some((food) =>
      searchText.includes(food.toLowerCase())
    ) ||
    searchText.includes("restaurant") ||
    searchText.includes("food") ||
    searchText.includes("lunch") ||
    searchText.includes("dinner") ||
    searchText.includes("breakfast") ||
    searchText.includes("suya") ||
    searchText.includes("grocery") ||
    searchText.includes("groceries") ||
    // Shoprite is primarily a grocery store
    (merchantLower.includes("shoprite") &&
      (searchText.includes("grocery") ||
        searchText.includes("shopping") ||
        note === undefined))
  ) {
    return "Food & Dining";
  }

  // Priority 2: Transport
  if (
    NIGERIAN_MERCHANTS.TRANSPORT.some((transport) =>
      searchText.includes(transport.toLowerCase())
    ) ||
    searchText.includes("fuel") ||
    searchText.includes("petrol") ||
    searchText.includes("okada") ||
    searchText.includes("danfo") ||
    searchText.includes("keke") ||
    searchText.includes("taxi")
  ) {
    return "Transport";
  }

  // Priority 3: Bills/Utilities
  if (
    NIGERIAN_MERCHANTS.BILLS.some((bill) =>
      searchText.includes(bill.toLowerCase())
    ) ||
    searchText.includes("electricity") ||
    searchText.includes("water") ||
    searchText.includes("internet") ||
    searchText.includes("cable") ||
    searchText.includes("subscription") ||
    searchText.includes("bill")
  ) {
    return "Bills";
  }

  // Priority 4: Banks (transfers, charges)
  if (
    NIGERIAN_MERCHANTS.BANKS.some((bank) =>
      searchText.includes(bank.toLowerCase())
    )
  ) {
    return "Bills"; // Bank charges, transfers etc.
  }

  // Priority 5: Special Nigerian contexts (high priority)
  if (
    searchText.includes("school") ||
    searchText.includes("fees") ||
    searchText.includes("tuition") ||
    searchText.includes("exam")
  ) {
    return "School Fees";
  }

  if (
    searchText.includes("church") ||
    searchText.includes("mosque") ||
    searchText.includes("tithe") ||
    searchText.includes("offering") ||
    searchText.includes("zakat") ||
    searchText.includes("sadaqah")
  ) {
    return "Church/Mosque";
  }

  if (
    searchText.includes("family") ||
    searchText.includes("mum") ||
    searchText.includes("dad") ||
    searchText.includes("parent") ||
    searchText.includes("sibling") ||
    searchText.includes("brother") ||
    searchText.includes("sister")
  ) {
    return "Family Support";
  }

  // Priority 6: Medical
  if (
    searchText.includes("hospital") ||
    searchText.includes("clinic") ||
    searchText.includes("pharmacy") ||
    searchText.includes("doctor") ||
    searchText.includes("medical") ||
    searchText.includes("drug")
  ) {
    return "Health/Medical";
  }

  // Priority 7: Rent/Housing
  if (
    searchText.includes("rent") ||
    searchText.includes("house") ||
    searchText.includes("apartment") ||
    searchText.includes("accommodation")
  ) {
    return "Rent/Housing";
  }

  // Priority 8: General Shopping (after food categorization)
  if (
    NIGERIAN_MERCHANTS.SHOPPING.some((shop) =>
      searchText.includes(shop.toLowerCase())
    ) ||
    searchText.includes("market") ||
    searchText.includes("store")
  ) {
    return "Shopping";
  }

  // Priority 9: Income detection
  if (
    searchText.includes("salary") ||
    searchText.includes("wage") ||
    (searchText.includes("payment") && amount && amount > 50000)
  ) {
    return "Salary";
  }

  if (
    searchText.includes("freelance") ||
    searchText.includes("gig") ||
    searchText.includes("contract") ||
    searchText.includes("project")
  ) {
    return "Freelance Work";
  }

  // Default fallback
  return "Other Expenses";
};

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction, ITransactionModel>(
    "Transaction",
    TransactionSchema
  );
