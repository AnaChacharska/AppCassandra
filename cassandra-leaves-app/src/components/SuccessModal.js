import React, { useState } from "react";
import styles from "./SuccessModal.module.css";

const SuccessModal = ({ message, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`${styles.modal} ${isClosing ? styles.fadeOut : ""}`}>
            <div className={`${styles.modalContent} ${isClosing ? styles.fadeOut : ""}`}>
                <h2>Success</h2>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;