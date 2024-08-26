import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from './Header';
import '../styles/Reports.css';
import { generatePDF } from '../utils/pdfUtils';
import { generateMonthlyExpensesReport, generateGoalProgressReport, generateBudgetAdherenceReport } from '../utils/reportHelpers';

const Reports = () => {
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        let data;
                        switch (reportType) {
                            case 'monthlyExpenses':
                                data = generateMonthlyExpensesReport(userData.expenses || []);
                                break;
                            case 'goalProgress':
                                data = generateGoalProgressReport(userData.goals || []);
                                break;
                            case 'budgetAdherence':
                                data = generateBudgetAdherenceReport(userData.budgets || [], userData.expenses || []);
                                break;
                            default:
                                data = [];
                        }
                        setReportData(data);
                    }
                }
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };

        if (reportType) {
            fetchReportData();
        }
    }, [reportType]);

    const handleDownloadPDF = () => {
        generatePDF(reportType, reportData);
    };

    return (
        <div>
            <Header />
            <h2>Reports</h2>
            <div className="report-options">
                <button onClick={() => setReportType('monthlyExpenses')}>Generate Monthly Expenses Report</button>
                <button onClick={() => setReportType('goalProgress')}>Generate Goal Progress Report</button>
                <button onClick={() => setReportType('budgetAdherence')}>Generate Budget Adherence Report</button>
            </div>
            <div className="report-results">
                {reportData.length > 0 && (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    {reportType === 'monthlyExpenses' && (
                                        <>
                                            <th>Month</th>
                                            <th>Total Expenses</th>
                                        </>
                                    )}
                                    {reportType === 'goalProgress' && (
                                        <>
                                            <th>Goal</th>
                                            <th>Amount</th>
                                            <th>Progress</th>
                                        </>
                                    )}
                                    {reportType === 'budgetAdherence' && (
                                        <>
                                            <th>Category</th>
                                            <th>Budgeted Amount</th>
                                            <th>Actual Spend</th>
                                            <th>Remaining Amount</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index}>
                                        {reportType === 'monthlyExpenses' && (
                                            <>
                                                <td>{item.month}</td>
                                                <td>${item.total ? Number(item.total).toFixed(2) : 'N/A'}</td>
                                            </>
                                        )}
                                        {reportType === 'goalProgress' && (
                                            <>
                                                <td>{item.goal}</td>
                                                <td>${item.amount ? Number(item.amount).toFixed(2) : 'N/A'}</td>
                                                <td>{item.progress ? item.progress.toFixed(2) : 'N/A'}%</td>
                                            </>
                                        )}
                                        {reportType === 'budgetAdherence' && (
                                            <>
                                                <td>{item.category}</td>
                                                <td>${item.budgetedAmount ? Number(item.budgetedAmount).toFixed(2) : 'N/A'}</td>
                                                <td>${item.actualSpend ? Number(item.actualSpend).toFixed(2) : 'N/A'}</td>
                                                <td>${item.budgetedAmount && item.actualSpend ? (item.budgetedAmount - item.actualSpend).toFixed(2) : 'N/A'}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleDownloadPDF}>Download PDF</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
