-- Check users table
SELECT id, email FROM users WHERE email = 'chemerilcollins@gmail.com';

-- Check income data
SELECT userid, COUNT(*) as income_count, SUM(amount) as total 
FROM incomes 
WHERE userid = 'c823a76b-6364-4d88-bc38-acb770064281'
GROUP BY userid;

-- Check if there's income data for a different user ID
SELECT userid, COUNT(*) as income_count, SUM(amount) as total 
FROM incomes 
WHERE userid != 'c823a76b-6364-4d88-bc38-acb770064281'
GROUP BY userid;
