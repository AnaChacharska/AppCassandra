import { useState, useMemo } from "react";
import { useModal, useDarkMode } from "../hooks/useModal";
import Card from "../components/Card";
import styles from "./Home.module.css";

export default function Home({ leavesData }) {
    const [leaves, setLeaves] = useState(leavesData || []);
    const [uiState, setUiState] = useState({
        searchQuery: "",
        currentPage: 1,
        modalState: {
            isEditing: false,
            successMessage: "",
            deleteRecord: null,
            isDeleteModalOpen: false,
        },
    });

    const [formState, setFormState] = useState({
        id: "",
        title: "",
        domain_name: "",
    });

    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { isModalOpen, openModal, closeModal } = useModal();
    const { isModalOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();

    const itemsPerPage = 8;

    // Derived filteredData using useMemo to handle search filtering
    const filteredData = useMemo(() => {
        return leaves.filter((item) =>
            item.title.toLowerCase().includes(uiState.searchQuery.toLowerCase())
        );
    }, [leaves, uiState.searchQuery]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (uiState.currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSearch = (query) => {
        setUiState((prevState) => ({
            ...prevState,
            searchQuery: query,
            currentPage: 1, // Reset to the first page on new search
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddRecord = () => {
        if (!formState.title || !formState.domain_name) {
            alert("Please fill out all fields.");
            return;
        }

        const newRecord = {
            id: leaves.length + 1,
            title: formState.title,
            domain_name: formState.domain_name,
        };

        setLeaves((prevLeaves) => [newRecord, ...prevLeaves]);
        setFormState({ id: "", title: "", domain_name: "" });
        closeModal();
        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, successMessage: "Record added successfully!" },
        }));

        setTimeout(() => {
            setUiState((prevState) => ({
                ...prevState,
                modalState: { ...prevState.modalState, successMessage: "" },
            }));
        }, 3000);
    };

    const handleEdit = (record) => {
        setFormState(record);
        openModal();
        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, isEditing: true },
        }));
    };

    const handleUpdateRecord = () => {
        const updatedLeaves = leaves.map((item) =>
            item.id === formState.id ? formState : item
        );

        setLeaves(updatedLeaves);
        setFormState({ id: "", title: "", domain_name: "" });
        closeModal();
        setUiState((prevState) => ({
            ...prevState,
            modalState: {
                ...prevState.modalState,
                isEditing: false,
                successMessage: "Record updated successfully!",
            },
        }));

        setTimeout(() => {
            setUiState((prevState) => ({
                ...prevState,
                modalState: { ...prevState.modalState, successMessage: "" },
            }));
        }, 3000);
    };

    const handleDelete = (id) => {
        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, deleteRecord: id },
        }));
        openDeleteModal();
    };

    const confirmDelete = () => {
        const updatedLeaves = leaves.filter((item) => item.id !== uiState.modalState.deleteRecord);
        setLeaves(updatedLeaves);
        closeDeleteModal();
        alert("Record deleted successfully.");
    };

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
            <h1 className={styles.title}>Cassandra Leaves Dashboard</h1>

            {uiState.modalState.successMessage && (
                <div className={styles.successMessage}>{uiState.modalState.successMessage}</div>
            )}

            <div className={styles.toggleContainer}>
                <label className={styles.toggleSwitch}>
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                    />
                    <span className={styles.slider}></span>
                </label>
            </div>

            <div className={styles.searchAddContainer}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={uiState.searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={styles.searchBar}
                />
                <button className={styles.addButton} onClick={openModal}>
                    Add Record
                </button>
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{uiState.modalState.isEditing ? "Edit Record" : "Add New Record"}</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formState.title}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="domain_name"
                            placeholder="Domain"
                            value={formState.domain_name}
                            onChange={handleInputChange}
                        />
                        <div className={styles.modalActions}>
                            {uiState.modalState.isEditing ? (
                                <button onClick={handleUpdateRecord}>Update</button>
                            ) : (
                                <button onClick={handleAddRecord}>Add</button>
                            )}
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this record?</p>
                        <div className={styles.modalActions}>
                            <button onClick={confirmDelete}>Yes, Delete</button>
                            <button onClick={closeDeleteModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.grid}>
                {paginatedData.map((item) => (
                    <Card
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={() =>
                        setUiState((prevState) => ({
                            ...prevState,
                            currentPage: Math.max(prevState.currentPage - 1, 1),
                        }))
                    }
                    disabled={uiState.currentPage === 1}
                >
                    Previous
                </button>
                <span>
          Page {uiState.currentPage} of {totalPages}
        </span>
                <button
                    onClick={() =>
                        setUiState((prevState) => ({
                            ...prevState,
                            currentPage: Math.min(prevState.currentPage + 1, totalPages),
                        }))
                    }
                    disabled={uiState.currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const leavesData = require("../data/leaves.json");
    return {
        props: {
            leavesData,
        },
    };
}
