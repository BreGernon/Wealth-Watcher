import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove }  from 'firebase/firestore';
import Header from './Header';
import '../styles/Expenses.css';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'edit', 'add', or 'delete'
    const [formData, setFormData] = useState({ category: '', amount: '', description: '', date: '' });
  
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setExpenses(userData.expenses || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching expenses:", error);
            }
        };

        fetchExpenses();
    }, []);

    const handleRowClick = (expense) => {
      setSelectedExpense(expense);
    };
  
    const openModal = (type) => {
      setModalType(type);
      if (type === 'edit' && selectedExpense) {
        setFormData({
          category: selectedExpense.category,
          amount: selectedExpense.amount,
          description: selectedExpense.description,
          date: selectedExpense.date,
        });
      } else {
        setFormData({ category: '', amount: '', description: '', date: '' });
      }
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setFormData({ category: '', amount: '', description: '', date: '' });
    };
  
    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFormSubmit = async(e) => {
      e.preventDefault();

      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db,"users", user.uid);
      
  
      if (modalType === 'add') {
        const newExpense = {
          id: uuidv4(), // Generate a new ID or use a unique ID generator
          ...formData,
        };
        try {
            await updateDoc(docRef, {
                expenses: arrayUnion(newExpense),
            });

            setExpenses([...expenses, newExpense]);
        } catch (error) {
            console.error("Error adding expense:", error);
        }
      } else if (modalType === 'edit' && selectedExpense) {
        const updatedExpenses = expenses.map((expense) =>
          expense.id === selectedExpense.id ? { ...expense, ...formData } : expense
        );
        try {
            await updateDoc(docRef, {
                expenses: updatedExpenses,
            });

            setExpenses(updatedExpenses);
        } catch (error) {
            console.error("Error updating expense:", error);
        }
      }
  
      closeModal();
    }
};
  
    const handleDelete = async () => {
        const user = auth.currentUser;
        if (user && selectedExpense) {
            const docRef = doc(db, "users", user.uid);

            try {
                await updateDoc(docRef, {
                    expenses: arrayRemove(selectedExpense),
                });

                setExpenses(expenses.filter((expense) => expense.id !== selectedExpense.id));
                setSelectedExpense(null);
                closeModal();
            } catch (error) {
                console.error("Error deleting expense:", error);
            }
        }
    };
  
    return (
      <div>
        <Header />
        <h2>Expenses</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                onClick={() => handleRowClick(expense)}
                className={selectedExpense && selectedExpense.id === expense.id ? 'selected' : ''}
              >
                <td>{expense.category}</td>
                <td>${Number(expense.amount).toFixed(2)}</td>
                <td>{expense.description}</td>
                <td>{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="expense-actions">
          <button onClick={() => openModal('edit')} disabled={!selectedExpense}>
            Edit
          </button>
          <button onClick={() => openModal('delete')} disabled={!selectedExpense}>
            Delete
          </button>
          <button onClick={() => openModal('add')}>Add New Expense</button>
        </div>
  
        {/* Modal for Adding and Editing Expenses */}
        <Modal show={isModalOpen && modalType !== 'delete'} onClose={closeModal} title={modalType === 'add' ? 'Add New Expense' : 'Edit Expense'}>
          <form onSubmit={handleFormSubmit}>
            <label>
              Category:
              <input type="text" name="category" value={formData.category} onChange={handleFormChange} required />
            </label>
            <label>
              Amount:
              <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} required />
            </label>
            <label>
              Description:
              <input type="text" name="description" value={formData.description} onChange={handleFormChange} required />
            </label>
            <label>
              Date:
              <input type="date" name="date" value={formData.date} onChange={handleFormChange} required />
            </label>
            <button type="submit">Save</button>
          </form>
        </Modal>
  
        {/* Modal for Deleting Expense */}
        <Modal show={isModalOpen && modalType === 'delete'} onClose={closeModal} title="Delete Expense">
          <p>Are you sure you want to delete this expense?</p>
          <button onClick={handleDelete}>Yes, Delete</button>
        </Modal>
      </div>
    );
  };

export default Expenses;