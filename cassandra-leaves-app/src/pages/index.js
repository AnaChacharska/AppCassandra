import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import styles from "./Home.module.css";

export default function Home({ leavesData }) {
    const [dataState, setDataState] = useState({
        formState: { id: "", title: "", domain_name: "" },
    });

    const [uiState, setUiState] = useState({
        searchQuery: "",
        currentPage: 1,
        isDarkMode: false,
        modalState: {
            isEditing: false,
            isModalOpen: false,
            successMessage: "",
            deleteRecord: null,
            isDeleteModalOpen: false,
        },
    });

    const itemsPerPage = 9;

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode") === "true";
        setUiState((prevState) => ({ ...prevState, isDarkMode: savedMode }));
    }, []);

    // Use useMemo to derive filteredData
    const filteredData = useMemo(() => {
        const lowerCaseQuery = uiState.searchQuery.toLowerCase();
        return leavesData?.filter((item) =>
            item.title.toLowerCase().includes(lowerCaseQuery)
        ) || [];
    }, [leavesData, uiState.searchQuery]);

    const handleSearch = (query) => {
        setUiState((prevState) => ({
            ...prevState,
            searchQuery: query,
            currentPage: 1,
        }));
    };

    const handleGoUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataState((prevState) => ({
            ...prevState,
            formState: { ...prevState.formState, [name]: value },
        }));
    };

    const handleAddRecord = () => {
        if (!dataState.formState.title || !dataState.formState.domain_name) {
            alert("Please fill out all fields.");
            return;
        }

        const newRecord = {
            id: filteredData.length + 1,
            title: dataState.formState.title,
            domain_name: dataState.formState.domain_name,
        };

        leavesData.unshift(newRecord); // Add the new record to the original data
        setDataState((prevState) => ({
            ...prevState,
            formState: { id: "", title: "", domain_name: "" },
        }));
        setUiState((prevState) => ({
            ...prevState,
            modalState: {
                ...prevState.modalState,
                isModalOpen: false,
                successMessage: "Record added successfully!",
            },
        }));
        setTimeout(() =>
                setUiState((prevState) => ({
                    ...prevState,
                    modalState: { ...prevState.modalState, successMessage: "" },
                }))
            , 3000);
    };

    const handleEdit = (record) => {
        setDataState((prevState) => ({ ...prevState, formState: record }));
        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, isEditing: true, isModalOpen: true },
        }));
    };

    const handleUpdateRecord = () => {
        const index = leavesData.findIndex((item) => item.id === dataState.formState.id);
        if (index !== -1) leavesData[index] = dataState.formState;

        setDataState((prevState) => ({
            ...prevState,
            formState: { id: "", title: "", domain_name: "" },
        }));
        setUiState((prevState) => ({
            ...prevState,
            modalState: {
                ...prevState.modalState,
                isEditing: false,
                isModalOpen: false,
                successMessage: "Record updated successfully!",
            },
        }));
        setTimeout(() =>
                setUiState((prevState) => ({
                    ...prevState,
                    modalState: { ...prevState.modalState, successMessage: "" },
                }))
            , 3000);
    };

    const handleDelete = (id) => {
        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, deleteRecord: id, isDeleteModalOpen: true },
        }));
    };

    const confirmDelete = () => {
        const index = leavesData.findIndex((item) => item.id === uiState.modalState.deleteRecord);
        if (index !== -1) leavesData.splice(index, 1);

        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, deleteRecord: null, isDeleteModalOpen: false },
        }));
        alert("Record deleted successfully.");
    };

    const cancelDelete = () => {
        setUiState((prevState) => ({
            ...prevState,
            modalState: { ...prevState.modalState, deleteRecord: null, isDeleteModalOpen: false },
        }));
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (uiState.currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const toggleDarkMode = () => {
        setUiState((prevState) => {
            const newMode = !prevState.isDarkMode;
            localStorage.setItem("darkMode", newMode);
            return { ...prevState, isDarkMode: newMode };
        });
    };

    return (
        <div className={`${styles.container} ${uiState.isDarkMode ? styles.dark : ""}`}>
            <h1 className={styles.title}>Cassandra Leaves Dashboard</h1>

            {uiState.modalState.successMessage && (
                <div className={styles.successMessage}>{uiState.modalState.successMessage}</div>
            )}

            <div className={styles.toggleContainer}>
                <label className={styles.toggleSwitch}>
                    <input
                        type="checkbox"
                        checked={uiState.isDarkMode}
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
                <button
                    className={styles.addButton}
                    onClick={() =>
                        setUiState((prevState) => ({
                            ...prevState,
                            modalState: { ...prevState.modalState, isEditing: false, isModalOpen: true },
                        }))
                    }
                >
                    Add Record
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {uiState.modalState.isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{uiState.modalState.isEditing ? "Edit Record" : "Add New Record"}</h2>
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={dataState.formState.title}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="domain_name"
                            placeholder="Domain"
                            value={dataState.formState.domain_name}
                            onChange={handleInputChange}
                        />
                        <div className={styles.modalActions}>
                            {uiState.modalState.isEditing ? (
                                <button onClick={handleUpdateRecord}>Update</button>
                            ) : (
                                <button onClick={handleAddRecord}>Add</button>
                            )}
                            <button
                                onClick={() =>
                                    setUiState((prevState) => ({
                                        ...prevState,
                                        modalState: { ...prevState.modalState, isModalOpen: false },
                                    }))
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Delete Confirmation */}
            {uiState.modalState.isDeleteModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this record?</p>
                        <div className={styles.modalActions}>
                            <button onClick={confirmDelete}>Yes, Delete</button>
                            <button onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Data */}
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

            {/* Pagination */}
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
                            currentPage: Math.min(
                                prevState.currentPage + 1,
                                totalPages
                            ),
                        }))
                    }
                    disabled={uiState.currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <button className={styles.goUpButton} onClick={handleGoUp}>
                Go Up
            </button>
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
