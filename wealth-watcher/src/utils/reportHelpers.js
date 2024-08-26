export const generateMonthlyExpensesReport = (expenses) => {
    // Get the current date
    const now = new Date();
    // Format the current month and year
    const currentMonthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    console.log('Current Month and Year:', currentMonthYear); // Debugging log

    // Calculate total expenses for the current month
    const monthlyExpenses = expenses.reduce((acc, expense) => {
        if (expense.date && !isNaN(expense.amount)) {
            const expenseDate = new Date(expense.date);
            const month = expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            
            console.log('Expense Date:', expenseDate);
            console.log('Expense Month and Year:', month);

            if (month === currentMonthYear) {
                const amount = parseFloat(expense.amount);
                acc += amount;
            }
        } else {
            console.warn('Skipping invalid expense:', expense);
        }
        return acc;
    }, 0);

    console.log('Total Monthly Expenses:', monthlyExpenses); // Debugging log

    return {
        month: currentMonthYear,
        total: monthlyExpenses.toFixed(2) // Ensure total is formatted to 2 decimal places
    };
};


export const generateGoalProgressReport = (goals) => {
    // Calculate progress for each goal
    return goals.map(goal => ({
        goal: goal.description,
        amount: goal.currentAmount,
        progress: (goal.currentAmount / goal.amount) * 100
    }));
};

export const generateBudgetAdherenceReport = (budgets, expenses) => {
    const expenseByCategory = expenses.reduce((acc, expense) => {
        const category = expense.category || 'Unknown';
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount) || 0;
        return acc;
    }, {});

    return budgets.map((budget) => {
        const category = budget.category || 'Unknown';
        const budgetedAmount = parseFloat(budget.budgetedAmount) || 0;
        const actualSpend = parseFloat(expenseByCategory[category]) || 0;
        const remainingAmount = budgetedAmount - actualSpend;

        console.log('Category:', category);
        console.log('Budgeted Amount:', budgetedAmount);
        console.log('Actual Spend:', actualSpend);
        console.log('Remaining Amount:', remainingAmount);

        return {
            category,
            budgetedAmount,
            actualSpend,
            remainingAmount
        };
    });
};

