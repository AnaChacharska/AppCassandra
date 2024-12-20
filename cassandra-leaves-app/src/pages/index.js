import { useEffect, useState } from "react";
import Card from "../components/Card";
import styles from "./Home.module.css";

export default function Home({ leavesData }) {
    const [filteredData, setFilteredData] = useState(leavesData || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const itemsPerPage = 9;

    const [formState, setFormState] = useState({ id: "", title: "", domain_name: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [deleteRecord, setDeleteRecord] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        setIsModalOpen(false);
        setSuccessMessage("Record added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setFormState(record);
        setIsModalOpen(true);
    };

    const handleUpdateRecord = () => {
        const updatedData = filteredData.map((item) =>
            item.id === formState.id ? formState : item
        );

        setFilteredData(updatedData);
        setIsEditing(false);
        setFormState({ id: "", title: "", domain_name: "" });
        setIsModalOpen(false);
        setSuccessMessage("Record updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleDelete = (id) => {
        setDeleteRecord(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        const updatedData = filteredData.filter((item) => item.id !== deleteRecord);
        setFilteredData(updatedData);
        setDeleteRecord(null);
        setIsDeleteModalOpen(false);
        alert("Record deleted successfully.");
    };

    const cancelDelete = () => {
        setDeleteRecord(null);
        setIsDeleteModalOpen(false);
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

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

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
                <button
                    className={styles.addButton}
                    onClick={() => { setIsEditing(false); setIsModalOpen(true); }}
                >
                    Add Record
                </button>
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{isEditing ? "Edit Record" : "Add New Record"}</h2>
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
                            {isEditing ? (
                                <button onClick={handleUpdateRecord}>Update</button>
                            ) : (
                                <button onClick={handleAddRecord}>Add</button>
                            )}
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
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
