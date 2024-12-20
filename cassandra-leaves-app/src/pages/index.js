import { useEffect, useState } from "react";
import Card from "../components/Card";
import styles from "./Home.module.css";

export default function Home({ leavesData }) {
    const [filteredData, setFilteredData] = useState(leavesData || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [formState, setFormState] = useState({ id: "", title: "", domain_name: "" });
    const [modalState, setModalState] = useState({
        isEditing: false,
        isModalOpen: false,
        successMessage: "",
        deleteRecord: null,
        isDeleteModalOpen: false,
    });

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(savedMode);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerCaseQuery = query.toLowerCase();
        const filtered = leavesData.filter((item) =>
            item.title.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleGoUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleAddRecord = () => {
        if (!formState.title || !formState.domain_name) {
            alert("Please fill out all fields.");
            return;
        }

        const newRecord = {
            id: filteredData.length + 1,
            title: formState.title,
            domain_name: formState.domain_name,
        };

        setFilteredData([newRecord, ...filteredData]);
        setFormState({ id: "", title: "", domain_name: "" });
        setModalState({
            ...modalState,
            isModalOpen: false,
            successMessage: "Record added successfully!",
        });
        setTimeout(() => setModalState({ ...modalState, successMessage: "" }), 3000);
    };

    const handleEdit = (record) => {
        setFormState(record);
        setModalState({ ...modalState, isEditing: true, isModalOpen: true });
    };

    const handleUpdateRecord = () => {
        const updatedData = filteredData.map((item) =>
            item.id === formState.id ? formState : item
        );

        setFilteredData(updatedData);
        setFormState({ id: "", title: "", domain_name: "" });
        setModalState({
            ...modalState,
            isEditing: false,
            isModalOpen: false,
            successMessage: "Record updated successfully!",
        });
        setTimeout(() => setModalState({ ...modalState, successMessage: "" }), 3000);
    };

    const handleDelete = (id) => {
        setModalState({ ...modalState, deleteRecord: id, isDeleteModalOpen: true });
    };

    const confirmDelete = () => {
        const updatedData = filteredData.filter((item) => item.id !== modalState.deleteRecord);
        setFilteredData(updatedData);
        setModalState({
            ...modalState,
            deleteRecord: null,
            isDeleteModalOpen: false,
        });
        alert("Record deleted successfully.");
    };

    const cancelDelete = () => {
        setModalState({ ...modalState, deleteRecord: null, isDeleteModalOpen: false });
    };

    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", newMode);
            return newMode;
        });
    };

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
            <h1 className={styles.title}>Cassandra Leaves Dashboard</h1>

            {modalState.successMessage && (
                <div className={styles.successMessage}>{modalState.successMessage}</div>
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
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={styles.searchBar}
                />
                <button className={styles.addButton} onClick={() => setModalState({ ...modalState, isEditing: false, isModalOpen: true })}>
                    Add Record
                </button>
            </div>

            {modalState.isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{modalState.isEditing ? "Edit Record" : "Add New Record"}</h2>
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
                            {modalState.isEditing ? (
                                <button onClick={handleUpdateRecord}>Update</button>
                            ) : (
                                <button onClick={handleAddRecord}>Add</button>
                            )}
                            <button onClick={() => setModalState({ ...modalState, isModalOpen: false })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {modalState.isDeleteModalOpen && (
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
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <div className={styles.goUpButton} onClick={handleGoUp}>
                <img src="/up-chevron_8213555.png" alt="Go to top" />
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
