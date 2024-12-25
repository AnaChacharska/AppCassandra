import { useState } from "react";

function useModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteRecord, setDeleteRecord] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen((prev) => !prev);
    const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

    return {
        isModalOpen,
        setIsModalOpen,
        isEditing,
        setIsEditing,
        successMessage,
        setSuccessMessage,
        deleteRecord,
        setDeleteRecord,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        toggleModal,
        toggleDeleteModal,
    };
}

export default useModal;
