-- Drop tables in reverse dependency order to handle foreign key constraints
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS savings_history CASCADE;
DROP TABLE IF EXISTS savings CASCADE;
DROP TABLE IF EXISTS incomes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CUSTOM TYPES

-- Income category enumeration
CREATE TYPE income_category AS ENUM (
    'Salary',
    'Bonus',
    'Investment',
    'Freelance',
    'Business',
    'Other'
);

-- Income source enumeration
CREATE TYPE income_source AS ENUM (
    'Employer',
    'Self-Employment',
    'Investments',
    'Client',
    'Family/Friend',
    'Other'
);

-- Users table - mirrors Supabase auth.users for local user management
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    fullname VARCHAR(255),
    avatar_url TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table - tracks all financial transactions
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT expenses_type_check CHECK (type IN ('income', 'expense', 'saving')),
    CONSTRAINT expenses_category_check CHECK (category IN ('Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Saving', 'Other'))
);

-- Savings table - tracks savings goals and progress
CREATE TABLE savings (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    goal DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL,
    description TEXT,
    target_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT savings_amount_check CHECK (amount >= 0),
    CONSTRAINT savings_status_check CHECK (status IN ('active', 'completed', 'atRisk'))
);

-- Savings history table - tracks deposits and withdrawals for savings accounts
CREATE TABLE savings_history (
    id SERIAL PRIMARY KEY,
    saving_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (saving_id) REFERENCES savings(id) ON DELETE CASCADE,
    CONSTRAINT savings_history_type_check CHECK (type IN ('deposit', 'withdrawal'))
);

-- Incomes table - tracks all income sources and transactions
CREATE TABLE incomes (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category income_category NOT NULL,
    source income_source NOT NULL,
    isRecurring BOOLEAN DEFAULT FALSE,
    recurringFrequency VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Budgets table - tracks budget allocations and spending
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    period_type VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    planned_amount DECIMAL(12, 2) NOT NULL,
    spent_amount DECIMAL(12, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    is_rollover BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT budgets_period_type_check CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
    CONSTRAINT budgets_category_check CHECK (category IN ('Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Other')),
    CONSTRAINT budgets_amount_check CHECK (planned_amount >= 0 AND spent_amount >= 0),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_category_period UNIQUE (user_id, category, period_type, start_date, end_date)
);


-- User-based indexes for efficient filtering
CREATE INDEX idx_expenses_userid ON expenses(userId);
CREATE INDEX idx_savings_userid ON savings(userId);
CREATE INDEX idx_incomes_userid ON incomes(userId);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);

-- Category and period indexes for budget queries
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_period ON budgets(period_type, start_date, end_date);

-- Date indexes for time-based queries
CREATE INDEX idx_incomes_date ON incomes(date);
CREATE INDEX idx_savings_history_date ON savings_history(date);

-- Foreign key indexes for join operations
CREATE INDEX idx_savings_history_saving_id ON savings_history(saving_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply automatic timestamp updates to all tables
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_expenses_modtime
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_savings_modtime
    BEFORE UPDATE ON savings
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_incomes_modtime
    BEFORE UPDATE ON incomes
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_budgets_modtime
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_savings_history_modtime
    BEFORE UPDATE ON savings_history
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Function to handle new user creation from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, password, name, fullname, avatar_url, is_email_verified)
    VALUES (
        new.id,
        new.email,
        new.encrypted_password,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        (new.email_confirmed_at IS NOT NULL)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user record on Supabase Auth signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
