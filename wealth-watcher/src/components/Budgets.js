import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Header from './Header';
import "../styles/Budgets.css";
import Modal from './Modal';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [formData, setFormData] = useState({ category: '', description: '', budgetedAmount: ''});

    useEffect(() => {
        const fetchBudgetsAndExpenses = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setBudgets(userData.budgets || []);
                        setExpenses(userData.expenses || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching budgets: ", error);
            }
        };
        fetchBudgetsAndExpenses();
    }, []);

    const handleRowClick = (budget) => {
        setSelectedBudget(budget);
    };

    const openModal = (type) => {
        setModalType(type);
        if (type === 'edit' && selectedBudget) {
            setFormData({
                category: selectedBudget.category,
                description: selectedBudget.description,
                budgetedAmount: selectedBudget.budgetedAmount,
            });
        } else {
            setFormData({ category: '', description: '', budgetedAmount: ''});
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ category: '', description: '', budgetedAmount: ''});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;

        if (user) {
            const docRef = doc(db, "users", user.uid);

            if (modalType === 'add') {
                const newBudget = {
                    id: budgets.length + 1,
                    ...formData,
                    budgetedAmount: parseFloat(formData.budgetedAmount),
                };
                try {
                    await updateDoc(docRef, {
                        budgets: arrayUnion(newBudget),
                    });

                    setBudgets([...budgets, newBudget]);
                } catch (error) {
                    console.error("Error adding budget:", error);
                }
            } else if (modalType === 'edit' && selectedBudget) {
                const updatedBudgets = budgets.map((budget) =>
                    budget.id === selectedBudget.id ? { ...budget, ...formData } : budget
                );
                try {
                    await updateDoc(docRef, {
                        budgets: updatedBudgets,
                    });

                    setBudgets(updatedBudgets);
                } catch (error) {
                    console.error("Error updating budget:", error);
                }
            }

            closeModal();
        }
    };

    const handleDelete = async () => {
        const user = auth.currentUser;
        if (user && selectedBudget) {
            const docRef = doc(db, "users", user.uid);

            try {
                await updateDoc(docRef, {
                    budgets: arrayRemove(selectedBudget),
                });

                setBudgets(budgets.filter((budget) => budget.id !== selectedBudget.id));
                setSelectedBudget(null);
                closeModal();
            } catch (error) {
                console.error("Error deleting budget:", error);
            }
        }
    };

    const calculateCurrentSpend = (category) => {
        return expenses
            .filter((expense) => expense.category === category)
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
    };

    return (
        <div>
            <Header />
            <h2>Budgets</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Budgeted Amount</th>
                        <th>Current Spend</th>
                        <th>Remaining Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.map((budget) => {
                        const currentSpend = calculateCurrentSpend(budget.category);
                        const remainingAmount = budget.budgetedAmount - currentSpend;

                        return (
                            <tr
                                key={budget.id}
                                onClick={() => handleRowClick(budget)}
                                className={selectedBudget && selectedBudget.id === budget.id ? 'selected' : ''}
                            >
                                <td>{budget.category}</td>
                                <td>{budget.description}</td>
                                <td>${Number(budget.budgetedAmount).toFixed(2)}</td>
                                <td>${currentSpend.toFixed(2)}</td>
                                <td>${remainingAmount.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="budget-actions">
                <button onClick={() => openModal('edit')} disabled={!selectedBudget}>
                    Edit
                </button>
                <button onClick={() => openModal('delete')} disabled={!selectedBudget}>
                    Delete
                </button>
                <button onClick={() => openModal('add')}>Add New Budget</button>
            </div>

            {/* Modal for Adding and Editing Budgets */}
            <Modal show={isModalOpen && modalType !== 'delete'} onClose={closeModal} title={modalType === 'add' ? 'Add New Budget' : 'Edit Budget'}>
                <form onSubmit={handleFormSubmit}>
                    <label>
                        Category:
                        <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Description:
                        <input type="text" name="description" value={formData.description} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Budgeted Amount:
                        <input type="number" name="budgetedAmount" value={formData.budgetedAmount} onChange={handleFormChange} required />
                    </label>
                    <button type="submit">Save</button>
                </form>
            </Modal>

            {/* Modal for Deleting Budget */}
            <Modal show={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Delete Budget">
                <p>Are you sure you want to delete this budget?</p>
                <button onClick={handleDelete}>Yes, Delete</button>
            </Modal>
        </div>
    );
};

export default Budgets;