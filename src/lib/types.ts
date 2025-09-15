export type ExpenseCategory =
    | 'Food'
    | 'Rent'
    | 'Transport'
    | 'Entertainment'
    | 'Health'
    | 'Utilities'
    | 'Education'
    | 'Shopping'
    | 'Saving'
    | 'Other';

export type ExpenseType = 'income' | 'expense' | 'saving';

export type PaymentMethod = 'cash' | 'credit' | 'debit';

export interface InvoiceType {
    id: number;
    userId: string;
    name: string;
    date: string;
    amount: number;
    type: ExpenseType;
    paymentMethod: PaymentMethod;
    category: ExpenseCategory;
}

export type AuthError = {
    type: 'auth_error';
    message: string;
    code: 'invalid_credentials' | 'user_not_found' | 'invalid_password' | 'missing_fields';
};

export type ExpenseCardProps = {
    name: string;
    amount: number;
    percentageChange: number;
    type?: ExpenseType;
}

export type SavingsStatus = 'active' | 'completed' | 'atRisk';

export interface SavingsType {
    id: number;
    userId: number;
    name: string;
    date: string;
    amount: number;
    goal: number;
    status: SavingsStatus;
    description?: string;
}


export type IncomeCategory = 'Salary' | 'Bonus' | 'Investment' | 'Freelance' | 'Business' | 'Other';

export type IncomeSource = 'Employer' | 'Self-Employment' | 'Investments' | 'Client' | 'Family/Friend' | 'Other';

export interface IncomeType {
    id: number;
    userId: string;
    name: string;
    date: string;
    amount: number;
    category: IncomeCategory;
    source: IncomeSource;
    isRecurring: boolean;
    recurringFrequency?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Budget {
    id: number;
    userId: string;
    name: string;
    description: string;
    periodType: string;
    startDate: string;
    endDate: string;
    category: string;
    plannedAmount: number;
    spentAmount: number;
    rollOver: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type SavingStatus = "active" | "completed" | "atRisk";
export type RecommendationCategory = "expense" | "income" | "savings" | "budget" | "general";

export interface Saving {
    id: number;
    userId: string;
    name: string;
    amount: number;
    goal: number;
    status: SavingStatus;
    description: string;
    createdAt: string;
    targetDate: string;
}

export type SavingHistory = {
    id: number;
    saving_id: number;
    amount: number;
    date: Date;
    type: 'deposit' | 'withdrawal';
    created_at: Date;
    updated_at: Date;
}

export interface RecommendationType {
    title: string;
    description: string;
    category: RecommendationCategory;
    priority: string;
}


export interface UserProfile {
    bio: string
    website: string
    username: string
    avatar_url: string
  }

  export interface User {
    id: string
    email: string
    fullname: string
    created_at: string
    updated_at: string
    profile: UserProfile
  }
