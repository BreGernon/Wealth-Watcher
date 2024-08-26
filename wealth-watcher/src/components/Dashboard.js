import React, { useEffect, useState } from 'react';
import { auth, db } from '../utils/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import Header from './Header';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [goals, setGoals] = useState([]);
    const [monthToDateExpenses, setMonthToDateExpenses] = useState(0);
    const [totalBudgets, setTotalBudgets] = useState(0);
    const [recentGoalPercentage, setRecentGoalPercentage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userId = user.uid;

                    // Fetch recent expenses
                    const expensesQuery = query(
                        collection(db, 'users', userId, 'expenses'),
                        orderBy('date', 'desc'),
                        limit(3)
                    );
                    const expensesSnapshot = await getDocs(expensesQuery);
                    const expensesData = expensesSnapshot.docs.map(doc => doc.data());
                    setExpenses(expensesData);

                    // Fetch budgets
                    const budgetsQuery = query(
                        collection(db, 'users', userId, 'budgets')
                    );
                    const budgetsSnapshot = await getDocs(budgetsQuery);
                    const budgetsData = budgetsSnapshot.docs.map(doc => doc.data());
                    setBudgets(budgetsData);
                    setTotalBudgets(budgetsData.reduce((total, budget) => total + budget.amount, 0));

                    // Fetch goals
                    const goalsQuery = query(
                        collection(db, 'users', userId, 'goals'),
                        orderBy('createdAt', 'desc'),
                        limit(1)
                    );
                    const goalsSnapshot = await getDocs(goalsQuery);
                    const goalsData = goalsSnapshot.docs.map(doc => doc.data());
                    if (goalsData.length > 0) {
                        const recentGoal = goalsData[0];
                        setRecentGoalPercentage(recentGoal.progress);
                    }

                    // Calculate month-to-date expenses
                    const monthToDateQuery = query(
                        collection(db, 'users', userId, 'expenses'),
                        where('date', '>=', new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                    );
                    const monthToDateSnapshot = await getDocs(monthToDateQuery);
                    const monthToDateData = monthToDateSnapshot.docs.map(doc => doc.data());
                    setMonthToDateExpenses(monthToDateData.reduce((total, expense) => total + expense.amount, 0));
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <Header />
            <div className="data-section">
                <div className="data-circles">
                    <div className="circle">
                        <h3>Month-to-Date Expenses</h3>
                        <p>${monthToDateExpenses.toFixed(2)}</p>
                    </div>
                    <div className="circle">
                        <h3>Total Budgets</h3>
                        <p>${totalBudgets.toFixed(2)}</p>
                    </div>
                    <div className="circle">
                        <h3>Recent Goal Percentage</h3>
                        <p>{recentGoalPercentage}%</p>
                    </div>
                </div>
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.category}</td>
                                <td>{expense.description}</td>
                                <td>${expense.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
