import React from 'react';
import '../styles/Modal.css';

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className='modal-backdrop'>
            <div className='modal-content'>
                <h3>{title}</h3>
                <div>{children}</div>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;