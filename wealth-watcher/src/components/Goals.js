import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Header from './Header';
import '../styles/Expenses.css'; // Reusing the same styles for consistency
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'edit', 'add', or 'delete'
    const [formData, setFormData] = useState({ description: '', amount: '', currentAmount: 0 });

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setGoals(userData.goals || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching goals:", error);
            }
        };

        fetchGoals();
    }, []);

    const handleRowClick = (goal) => {
        setSelectedGoal(goal);
    };

    const openModal = (type) => {
        setModalType(type);
        if (type === 'edit' && selectedGoal) {
            setFormData({
                description: selectedGoal.description,
                amount: selectedGoal.amount,
                currentAmount: selectedGoal.currentAmount,
            });
        } else {
            setFormData({ description: '', amount: '', currentAmount: 0 });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ description: '', amount: '', currentAmount: 0 });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'amount' || name === 'currentAmount' ? parseFloat(value) || 0 : value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;

        if (user) {
            const docRef = doc(db, "users", user.uid);

            if (modalType === 'add') {
                const newGoal = {
                    id: uuidv4(), // Generate a unique ID for each goal
                    ...formData,
                    amount: parseFloat(formData.amount), // Ensure it's stored as a number
                    currentAmount: parseFloat(formData.currentAmount), // Ensure it's stored as a number
                };
                try {
                    await updateDoc(docRef, {
                        goals: arrayUnion(newGoal),
                    });

                    setGoals([...goals, newGoal]);
                } catch (error) {
                    console.error("Error adding goal:", error);
                }
            } else if (modalType === 'edit' && selectedGoal) {
                const updatedGoals = goals.map((goal) =>
                    goal.id === selectedGoal.id ? { ...goal, ...formData, amount: parseFloat(formData.amount), currentAmount: parseFloat(formData.currentAmount) } : goal
                );
                try {
                    await updateDoc(docRef, {
                        goals: updatedGoals,
                    });

                    setGoals(updatedGoals);
                } catch (error) {
                    console.error("Error updating goal:", error);
                }
            }

            closeModal();
        }
    };

    const handleDelete = async () => {
        const user = auth.currentUser;
        if (user && selectedGoal) {
            const docRef = doc(db, "users", user.uid);

            try {
                await updateDoc(docRef, {
                    goals: arrayRemove(selectedGoal),
                });

                setGoals(goals.filter((goal) => goal.id !== selectedGoal.id));
                setSelectedGoal(null);
                closeModal();
            } catch (error) {
                console.error("Error deleting goal:", error);
            }
        }
    };

    const handleAddMoney = async (amount) => {
        if (!selectedGoal || amount <= 0) return;

        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            try {
                const updatedGoal = {
                    ...selectedGoal,
                    currentAmount: (selectedGoal.currentAmount || 0) + amount, // Ensure addition works with numbers
                };

                await updateDoc(docRef, {
                    goals: arrayRemove(selectedGoal),
                });

                await updateDoc(docRef, {
                    goals: arrayUnion(updatedGoal),
                });

                setGoals(goals.map((goal) =>
                    goal.id === selectedGoal.id ? updatedGoal : goal
                ));
                setSelectedGoal(updatedGoal);
            } catch (error) {
                console.error("Error updating goal:", error);
            }
        }
    };

    const handleRemoveMoney = async (amount) => {
        if (!selectedGoal || amount <= 0) return;

        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            try {
                const updatedGoal = {
                    ...selectedGoal,
                    currentAmount: (selectedGoal.currentAmount || 0) - amount >= 0 ? (selectedGoal.currentAmount || 0) - amount : 0, // Prevents negative values
                };

                await updateDoc(docRef, {
                    goals: arrayRemove(selectedGoal),
                });

                await updateDoc(docRef, {
                    goals: arrayUnion(updatedGoal),
                });

                setGoals(goals.map((goal) =>
                    goal.id === selectedGoal.id ? updatedGoal : goal
                ));
                setSelectedGoal(updatedGoal);
            } catch (error) {
                console.error("Error updating goal:", error);
            }
        }
    };

    return (
        <div>
            <Header />
            <h2>Goals</h2>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Goal Amount</th>
                        <th>Current Amount</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {goals.map((goal) => (
                        <tr
                            key={goal.id}
                            onClick={() => handleRowClick(goal)}
                            className={selectedGoal && selectedGoal.id === goal.id ? 'selected' : ''}
                        >
                            <td>{goal.description}</td>
                            <td>${Number(goal.amount).toFixed(2)}</td>
                            <td>${Number(goal.currentAmount).toFixed(2)}</td>
                            <td>{((goal.currentAmount / goal.amount) * 100).toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="goal-actions">
                <button onClick={() => openModal('edit')} disabled={!selectedGoal}>
                    Edit
                </button>
                <button onClick={() => openModal('delete')} disabled={!selectedGoal}>
                    Delete
                </button>
                <button onClick={() => openModal('add')}>Add New Goal</button>
                <button onClick={() => handleAddMoney(10)} disabled={!selectedGoal}>
                    Add $10
                </button>
                <button onClick={() => handleAddMoney(50)} disabled={!selectedGoal}>
                    Add $50
                </button>
                <button onClick={() => handleRemoveMoney(10)} disabled={!selectedGoal}>
                    Remove $10
                </button>
                <button onClick={() => handleRemoveMoney(50)} disabled={!selectedGoal}>
                    Remove $50
                </button>
            </div>

            {/* Modal for Adding and Editing Goals */}
            <Modal show={isModalOpen && modalType !== 'delete'} onClose={closeModal} title={modalType === 'add' ? 'Add New Goal' : 'Edit Goal'}>
                <form onSubmit={handleFormSubmit}>
                    <label>
                        Description:
                        <input type="text" name="description" value={formData.description} onChange={handleFormChange} required />
                    </label>
                    <label>
                        Goal Amount:
                        <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} required />
                    </label>
                    <button type="submit">Save</button>
                </form>
            </Modal>

            {/* Modal for Deleting Goal */}
            <Modal show={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Delete Goal">
                <p>Are you sure you want to delete this goal?</p>
                <button onClick={handleDelete}>Yes, Delete</button>
            </Modal>
        </div>
    );
};

export default Goals;
