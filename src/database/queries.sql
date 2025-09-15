-- First, drop existing tables due to foreign key dependencies
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS savings CASCADE;
DROP TABLE IF EXISTS incomes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table to mirror Supabase users
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,  -- Supabase auth.uid()
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will store bcrypt hashed password
    name VARCHAR(255),             -- Optional name field
    is_email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EXPENSES
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Other')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE expenses
    DROP CONSTRAINT IF EXISTS expenses_type_check;

ALTER TABLE expenses
    ADD CONSTRAINT expenses_type_check
        CHECK (type IN ('income', 'expense', 'saving'));

ALTER TABLE expenses
    DROP CONSTRAINT IF EXISTS expenses_category_check;

ALTER TABLE expenses
    ADD CONSTRAINT expenses_category_check
        CHECK (category IN ('Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Saving', 'Other'));

-- SAVINGS
CREATE TABLE savings (
    id SERIAL PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    goal DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'completed', 'atRisk')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    target_date TIMESTAMPTZ,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- SAVINGS HISTORY
CREATE TABLE savings_history (
    id SERIAL PRIMARY KEY,
    saving_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (saving_id) REFERENCES savings(id) ON DELETE CASCADE
);



-- INCOME
CREATE TYPE income_category AS ENUM (
    'Salary',
    'Bonus',
    'Investment',
    'Freelance',
    'Business',
    'Other'
);

CREATE TYPE income_source AS ENUM (
    'Employer',
    'Self-Employment',
    'Investments',
    'Client',
    'Family/Friend',
    'Other'
);

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

-- BUDGETS
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Food', 'Rent', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Education', 'Shopping', 'Other')),
    planned_amount DECIMAL(12, 2) NOT NULL CHECK (planned_amount >= 0),
    spent_amount DECIMAL(12, 2) DEFAULT 0.00 CHECK (spent_amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    is_rollover BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_category_period UNIQUE (user_id, category, period_type, start_date, end_date)
);

-- Indexes
CREATE INDEX idx_expenses_userid ON expenses(userId);
CREATE INDEX idx_savings_userid ON savings(userId);
CREATE INDEX idx_incomes_userid ON incomes(userId);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_period ON budgets(period_type, start_date, end_date);
CREATE INDEX idx_incomes_date ON incomes(date);
CREATE INDEX idx_savings_history_saving_id ON savings_history(saving_id);
CREATE INDEX idx_savings_history_date ON savings_history(date);

-- Update trigger for all tables
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for all tables
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

CREATE TRIGGER update_budget_modtime
    BEFORE UPDATE ON budgets
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_savings_history_modtime
    BEFORE UPDATE ON savings_history
    FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

select * from savings_history;
select * from users;
