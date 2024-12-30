import {useState, useMemo, useEffect} from "react";
import {useModal, useDarkMode} from "../hooks/useModal"; // Custom hooks for managing modal and dark mode
import Card from "../components/Card"; // Reusable Card component to display data
import styles from "./Home.module.css"; // CSS module for styling
import axios from "axios";

export default function Home({leavesData}) {
    // State to manage the list of leaves data
    const [leaves, setLeaves] = useState(leavesData || []);
    const [error, setError] = useState("");

    // State to manage UI-specific details like search, pagination, and modal
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

    // Fetch data from Xano on component mount
    useEffect(() => {
        const fetchAllLeaves = async () => {
            let allLeaves = [];
            let page = 1;
            const offset = 8; // Number of items per page
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            const fetchPage = async (page) => {
                try {
                    const response = await axios.get(
                        "https://x8ki-letl-twmt.n7.xano.io/api:WVrFdUAc/cassandra_leaves",
                        {
                            params: {
                                page_number: page,
                                offset: offset,
                            },
                        }
                    );

                    const items = response.data.items;
                    if (items.length > 0) {
                        allLeaves = [...allLeaves, ...items];
                        setLeaves(allLeaves); // Update state after each page
                        await delay(1000); // Delay of 1 second between requests
                        await fetchPage(page + 1); // Fetch the next page
                    } else {
                        setLeaves(allLeaves); // Set the leaves state when done
                    }
                } catch (error) {
                    if (error.response && error.response.status === 429) {
                        console.warn("Rate limit exceeded. Retrying...");
                        await delay(2000); // Delay of 2 seconds before retrying
                        await fetchPage(page); // Retry the same page
                    } else {
                        setError("Error fetching data");
                        console.error("Error fetching data from Xano:", error);
                    }
                }
            };

            await fetchPage(page);
        };

        fetchAllLeaves();
    }, []);

    // State to manage the form fields for adding or editing records
    const [formState, setFormState] = useState({
        content: "",
        domain_name: "",
        http_status: "",
        language: "",
        last_sourced_from_wallabag: "",
        mimetype: "",
        preview_picture: "",
        published_by: "",
        tags: "",
        title: "",
        updated_at: "",
        url: "",
        user_email: "",
        user_id: "",
        user_name: "",
        wallabag_created_at: "",
        wallabag_is_archived: "",
        wallabag_updated_at: "",
    });

    // Custom hook to manage dark mode functionality
    const {isDarkMode, toggleDarkMode} = useDarkMode();

    // Custom hook to manage the modal state for adding/editing records
    const {isModalOpen, openModal, closeModal} = useModal();

    // Custom hook to manage the modal state for delete confirmation
    const {isModalOpen: isDeleteModalOpen, openModal: openDeleteModal, closeModal: closeDeleteModal} = useModal();

    // Pagination settings
    const itemsPerPage = 16;

    // Memoized value to filter the leaves data based on the search query
    const filteredData = useMemo(() => {
        return leaves.filter((item) =>
            item.title.toLowerCase().includes(uiState.searchQuery.toLowerCase())
        );
    }, [leaves, uiState.searchQuery]);

    // Calculate the total number of pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Slice the data to show only the records for the current page
    const startIndex = (uiState.currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Handles updating the search query and resets pagination
    const handleSearch = (query) => {
        setUiState((prevState) => ({
            ...prevState,
            searchQuery: query,
            currentPage: 1, // Reset to the first page on new search
        }));
    };

    const handleGoUp = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Handles changes in form input fields
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Adds a new record to the list
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

        setLeaves((prevLeaves) => [newRecord, ...prevLeaves]); // Add the new record to the top of the list
        setFormState({id: "", title: "", domain_name: ""}); // Reset the form state
        closeModal(); // Close the modal
        setUiState((prevState) => ({
            ...prevState,
            modalState: {...prevState.modalState, successMessage: "Record added successfully!"},
        }));

        // Clear the success message after 3 seconds
        setTimeout(() => {
            setUiState((prevState) => ({
                ...prevState,
                modalState: {...prevState.modalState, successMessage: ""},
            }));
        }, 3000);
    };

    // Prepares the form state for editing an existing record
    const handleEdit = (record) => {
        setFormState(record); // Populate form state with the selected record's data
        openModal(); // Open the modal for editing
        setUiState((prevState) => ({
            ...prevState,
            modalState: {...prevState.modalState, isEditing: true},
        }));
    };

    // Updates the existing record in the list
    const handleUpdateRecord = () => {
        const updatedLeaves = leaves.map((item) =>
            item.id === formState.id ? formState : item
        );

        setLeaves(updatedLeaves); // Update the list with the modified record
        setFormState({id: "", title: "", domain_name: ""}); // Reset the form state
        closeModal(); // Close the modal
        setUiState((prevState) => ({
            ...prevState,
            modalState: {
                ...prevState.modalState,
                isEditing: false,
                successMessage: "Record updated successfully!",
            },
        }));

        // Clear the success message after 3 seconds
        setTimeout(() => {
            setUiState((prevState) => ({
                ...prevState,
                modalState: {...prevState.modalState, successMessage: ""},
            }));
        }, 3000);
    };

    // Opens the delete confirmation modal
    const handleDelete = (id) => {
        setUiState((prevState) => ({
            ...prevState,
            modalState: {...prevState.modalState, deleteRecord: id},
        }));
        openDeleteModal(); // Open the delete confirmation modal
    };

    // Confirms the deletion of a record
    const confirmDelete = () => {
        const updatedLeaves = leaves.filter((item) => item.id !== uiState.modalState.deleteRecord);
        setLeaves(updatedLeaves); // Remove the record from the list
        closeDeleteModal(); // Close the delete confirmation modal
        alert("Record deleted successfully.");
    };

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
            <h1 className={styles.title}>Cassandra Leaves Dashboard</h1>

            {/* Display success message */}
            {uiState.modalState.successMessage && (
                <div className={styles.successMessage}>{uiState.modalState.successMessage}</div>
            )}

            {/* Toggle for dark mode */}
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

            {/* Search bar and Add Record button */}
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

            {/* Modal for adding or editing a record */}
            {isModalOpen && (
                <div className={`${styles.modal} ${styles.scrollableModal}`}>
                    <div className={styles.modalContent}>
                        <h2>{uiState.modalState.isEditing ? "Edit Record" : "Add New Record"}</h2>
                        <input
                            type="text"
                            name="content"
                            placeholder="Content"
                            value={formState.content}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="domain_name"
                            placeholder="Domain"
                            value={formState.domain_name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="http_status"
                            placeholder="Http Status"
                            value={formState.http_status}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="language"
                            placeholder="Language"
                            value={formState.language}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="last_sourced_from_wallabag"
                            placeholder="Last sourced"
                            value={formState.last_sourced_from_wallabag}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="mimetype"
                            placeholder="Mimetype"
                            value={formState.mimetype}
                            onChange={handleInputChange}
                        />
                        <input
                            type="image"
                            name="preview_picture"
                            placeholder="Preview picture"
                            value={formState.preview_picture}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="published_by"
                            placeholder="Published by"
                            value={formState.published_by}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="tags[]"
                            placeholder="Tags"
                            value={formState.tags}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formState.title}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="updated_at"
                            placeholder="Updated at"
                            value={formState.updated_at}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="url"
                            placeholder="Url"
                            value={formState.url}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="user_email"
                            placeholder="User email"
                            value={formState.user_email}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="user_id"
                            placeholder="User id"
                            value={formState.user_id}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="user_name"
                            placeholder="User name"
                            value={formState.user_name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="wallabag_created_at"
                            placeholder="Wallabag created at"
                            value={formState.wallabag_created_at}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="wallabag_is_archived"
                            placeholder="Wallabag is archived"
                            value={formState.wallabag_is_archived}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="wallabag_updated_at"
                            placeholder="Wallabag updated at"
                            value={formState.wallabag_updated_at}
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

            {/* Modal for delete confirmation */}
            {isDeleteModalOpen && (
                <div className={`${styles.modal} ${styles.nonScrollableModal}`}>
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

            {/* Display the records using the Card component */}
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

            {/* Pagination controls */}
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
            <div className={styles.goUpButton} onClick={handleGoUp}>
                <img src="/up-chevron_8213555.png" alt="Go to top" />
            </div>
        </div>
    );
}

// Static data fetching function to get leaves data
export async function getStaticProps() {
    const leavesData = require("../data/leaves.json"); // Load data from a local JSON file
    return {
        props: {
            leavesData,
        },
    };
}
