import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (reportType, reportData) => {
    const doc = new jsPDF();
    let headers = [];
    let data = [];

    switch (reportType) {
        case 'monthlyExpenses':
            headers = ['Month', 'Total Expenses'];
            data = reportData.map(item => [item.month, `$${item.total ? Number(item.total).toFixed(2) : 'N/A'}`]);
            break;
        case 'goalProgress':
            headers = ['Goal', 'Amount', 'Progress'];
            data = reportData.map(item => [item.goal, `$${item.amount ? Number(item.amount).toFixed(2) : 'N/A'}`, `${item.progress ? item.progress.toFixed(2) : 'N/A'}%`]);
            break;
        case 'budgetAdherence':
            headers = ['Category', 'Budgeted Amount', 'Actual Spend', 'Remaining Amount'];
            data = reportData.map(item => [item.category, `$${item.budgetedAmount ? Number(item.budgetedAmount).toFixed(2) : 'N/A'}`, `$${item.actualSpend ? Number(item.actualSpend).toFixed(2) : 'N/A'}`, `$${item.budgetedAmount && item.actualSpend ? (item.budgetedAmount - item.actualSpend).toFixed(2) : 'N/A'}`]);
            break;
        default:
            return;
    }

    doc.autoTable({
        head: [headers],
        body: data,
        margin: { top: 20 },
        styles: { fontSize: 10 },
    });

    doc.save(`${reportType}_Report.pdf`);
};
