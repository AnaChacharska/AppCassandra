import { useState, useMemo, useEffect, useContext } from "react";
import { useModal, useDarkMode } from "../hooks/useModal";
import Card from "../components/Card";
import styles from "./Home.module.css";
import axios from "axios";
import { GlobalContext } from "../contexts/GlobalContext";
import SuccessModal from "../components/SuccessModal";

export default function Home({ leavesData }) {
    const { leaves, setLeaves } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] = useState(false);
    const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] = useState(false);

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

    // In-memory cache for API responses
    const cache = {};

    // Fetch metadata from Xano with retry logic
    const fetchMetadata = async (retryCount = 5, delay = 1000, maxDelay = 32000) => {
        try {
            const response = await axios.get(
                "https://x8ki-letl-twmt.n7.xano.io/api:_YdzcIS0/metadata_table",
                { params: {} }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount > 0) {
                const jitter = Math.random() * 1000; // Add random jitter to delay
                const nextDelay = Math.min(delay * 2, maxDelay) + jitter;
                console.warn(`Rate limit exceeded. Retrying in ${nextDelay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, nextDelay));
                return fetchMetadata(retryCount - 1, nextDelay, maxDelay);
            } else {
                console.error('Error fetching metadata:', error);
                throw error;
            }
        }
    };


    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);

                const fetchUsefulData = async () => {
                    try {
                        const response = await axios.get("/api/fetchData");
                        return response.data;
                    } catch (error) {
                        console.error("Error fetching useful data:", error);
                        throw error;
                    }
                };

                const [metadata, usefulData] = await Promise.all([
                    fetchMetadata(),
                    fetchUsefulData(),
                ]);

                const combinedData = usefulData.map((item) => ({
                    ...item,
                    ...metadata.find((meta) => meta.domain_name === item.domain_name),
                }));

                setLeaves(combinedData);
                setIsInitialLoad(false);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data from APIs");
                setIsLoading(false);
            }
        };

        if (leaves.length === 0 && leavesData && leavesData.length > 0) {
            setLeaves(leavesData);
            setIsInitialLoad(false);
            setIsLoading(false);
        } else if (leaves.length === 0) {
            fetchAllData();
        } else {
            setIsLoading(false);
        }
    }, [leavesData, leaves, setLeaves]);


    // State to manage the form fields for adding or editing records
    const [formState, setFormState] = useState({
        id: "",
        created_at: "",
        content: "",
        domain_name: "",
        http_status: "",
        language: "",
        last_sourced_from_wallabag: "",
        mimetype: "",
        preview_picture: null,
        published_by: "",
        tags: [],
        title: "",
        updated_at: "",
        url: "",
        user_email: "",
        user_id: "",
        user_name: "",
        wallabag_created_at: "",
        wallabag_is_archived: false,
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
        return (leaves || []).filter((item) =>
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
        sessionStorage.setItem('currentPage', 1);
    };

    const handlePageChange = (newPage) => {
        setUiState((prevState) => ({
            ...prevState,
            currentPage: newPage,
        }));
        sessionStorage.setItem('currentPage', newPage);
    };

    const handleGoUp = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
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
    const handleAddRecord = async () => {
        if (!formState.title || !formState.domain_name) {
            alert("Please fill out all fields.");
            return;
        }

        const newRecord = {
            title: formState.title,
            url: formState.url,
            preview_picture: formState.preview_picture,
            content: formState.content,
            last_sourced_from_wallabag: formState.last_sourced_from_wallabag,
            domain_name: formState.domain_name,
            language: formState.language,
            tags: formState.tags,
            http_status: formState.http_status,
            published_by: formState.published_by,
            user_email: formState.user_email,
        };

        try {
            // Add to Xano
            const xanoResponse = await axios.post("https://x8ki-letl-twmt.n7.xano.io/api:_YdzcIS0/metadata_table", newRecord);
            if (xanoResponse.status === 200) {
                const addedRecord = xanoResponse.data;

                // Add to MongoDB
                const mongoResponse = await axios.post("/api/addRecord", addedRecord);
                if (mongoResponse.status === 200) {
                    setLeaves((prevLeaves) => [addedRecord, ...prevLeaves]);
                    setFormState({
                        title: "",
                        url: "",
                        preview_picture: "",
                        content: "",
                        last_sourced_from_wallabag: "",
                        domain_name: "",
                        language: "",
                        tags: [],
                        http_status: "",
                        published_by: "",
                        user_email: "",
                    });
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
                } else {
                    console.error("Failed to add record to MongoDB");
                }
            } else {
                console.error("Failed to add record to Xano");
            }
        } catch (error) {
            console.error("Error adding record:", error);
        }
    };
    const editRecordInXano = async (id, updatedData) => {
        try {
            const url = `https://x8ki-letl-twmt.n7.xano.io/api:_YdzcIS0/metadata_table/${id}`;
            console.log(`Updating record at URL: ${url}`);
            console.log(`Record ID: ${id}`);
            console.log(`Updated Data:`, updatedData);
            const response = await axios.patch(url, updatedData);
            if (response.status === 200) {
                console.log('Record updated successfully in Xano');
            } else {
                console.error('Failed to update record in Xano');
            }
        } catch (error) {
            console.error('Error updating record in Xano:', error);
        }
    };

// Prepares the form state for editing an existing record
    const handleEdit = (record) => {
        setFormState(record);
        setUiState((prevState) => ({
            ...prevState,
            modalState: {
                ...prevState.modalState,
                isEditing: true,
            },
        }));
        openModal(); // Open the modal
    };

// Updates the existing record in the list
    const handleUpdateRecord = async () => {
        try {
            // Update in Xano
            await editRecordInXano(formState.id, formState);

            // Update in MongoDB
            const mongoResponse = await axios.patch(`/api/updateRecord/${formState.id}`, formState);
            if (mongoResponse.status === 200) {
                const updatedLeaves = leaves.map((item) =>
                    item.id === formState.id ? formState : item
                );
                setLeaves(updatedLeaves);
                closeModal();
                setIsEditSuccessModalOpen(true);
                setFormState({
                    title: "",
                    url: "",
                    preview_picture: "",
                    content: "",
                    last_sourced_from_wallabag: "",
                    domain_name: "",
                    language: "",
                    tags: [],
                    http_status: "",
                    published_by: "",
                    user_email: "",
                });

                setTimeout(() => {
                    setUiState((prevState) => ({
                        ...prevState,
                        modalState: { ...prevState.modalState, successMessage: "" },
                    }));
                }, 3000);
            } else {
                console.error("Failed to update record in MongoDB");
            }
        } catch (error) {
            console.error("Error updating record:", error);
            alert("Failed to update record. Please try again.");
        }
    };

    // Opens the delete confirmation modal
    const handleDelete = (id) => {
        setUiState((prevState) => ({
            ...prevState,
            modalState: {...prevState.modalState, deleteRecord: id},
        }));
        openDeleteModal(); // Open the delete confirmation modal
    };

    const deleteRecordFromXano = async (id, retryCount = 5, delay = 1000, maxDelay = 32000) => {
        try {
            if (!id) {
                console.error('Record ID is missing');
                return;
            }

            const url = `https://x8ki-letl-twmt.n7.xano.io/api:_YdzcIS0/metadata_table/${id}`;
            console.log(`Deleting record with ID: ${id} at URL: ${url}`);

            const response = await axios.delete(url);
            if (response.status === 200) {
                console.log('Record deleted successfully from Xano');
            } else {
                console.error('Failed to delete record from Xano', response);
            }
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount > 0) {
                const jitter = Math.random() * 1000; // Add random jitter to delay
                const nextDelay = Math.min(delay * 2, maxDelay) + jitter;
                console.warn(`Rate limit exceeded. Retrying in ${nextDelay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, nextDelay));
                return deleteRecordFromXano(id, retryCount - 1, nextDelay, maxDelay);
            } else {
                console.error('Error deleting record from Xano:', error);
            }
        }
    };

    const confirmDelete = async () => {
        const id = uiState.modalState.deleteRecord;
        try {
            // Delete from Xano
            await deleteRecordFromXano(id);

            // Delete from MongoDB
            const mongoResponse = await axios.delete(`/api/deleteRecord/${id}`);
            if (mongoResponse.status === 200) {
                const updatedLeaves = leaves.filter((item) => item.id !== id);
                setLeaves(updatedLeaves);
                closeDeleteModal();
                setIsDeleteSuccessModalOpen(true);
            } else {
                console.error("Failed to delete record from MongoDB");
            }
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
            {isLoading && isInitialLoad ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                </div>
            ) : (
                <>
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
                                {uiState.modalState.successMessage && (
                                    <div className={styles.successMessage}>{uiState.modalState.successMessage}</div>
                                )}
                                {/* Modal Input Fields */}
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={formState.title}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="url"
                                    placeholder="URL"
                                    value={formState.url}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="preview_picture"
                                    placeholder="Preview Picture URL"
                                    value={formState.preview_picture || ""}
                                    onChange={(e) =>
                                        setFormState({...formState, preview_picture: e.target.value || null})
                                    }
                                />
                                <textarea
                                    name="content"
                                    placeholder="Content (clean HTML)"
                                    value={formState.content}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="date"
                                    name="last_sourced_from_wallabag"
                                    placeholder="Last Sourced from Wallabag"
                                    value={formState.last_sourced_from_wallabag}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="domain_name"
                                    placeholder="Domain Name"
                                    value={formState.domain_name}
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
                                    type="text"
                                    name="tags"
                                    placeholder="Tags (comma-separated)"
                                    value={Array.isArray(formState.tags) ? formState.tags.join(", ") : ""}
                                    onChange={(e) =>
                                        setFormState({
                                            ...formState,
                                            tags: e.target.value.split(",").map(tag => tag.trim())
                                        })
                                    }
                                />
                                <input
                                    type="number"
                                    name="http_status"
                                    placeholder="HTTP Status"
                                    value={formState.http_status}
                                    onChange={(e) => setFormState({...formState, http_status: Number(e.target.value)})}
                                />
                                <input
                                    type="text"
                                    name="published_by"
                                    placeholder="Published By"
                                    value={formState.published_by}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="email"
                                    name="user_email"
                                    placeholder="User Email"
                                    value={formState.user_email}
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
                                <h2>Confirm Delete</h2>
                                {uiState.modalState.successMessage && (
                                    <div className={styles.successMessage}>{uiState.modalState.successMessage}</div>
                                )}
                                <p>Are you sure you want to delete this record?</p>
                                <div className={styles.modalActions}>
                                    <button onClick={confirmDelete}>Yes, Delete</button>
                                    <button onClick={closeDeleteModal}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Success modals */}
                    {isDeleteSuccessModalOpen && (
                        <SuccessModal
                            message="Record deleted successfully."
                            onClose={() => setIsDeleteSuccessModalOpen(false)}
                        />
                    )}

                    {isEditSuccessModalOpen && (
                        <SuccessModal
                            message="Record updated successfully."
                            onClose={() => setIsEditSuccessModalOpen(false)}
                        />
                    )}

                    {/* Display the records using the Card component */}
                    <div className={styles.grid}>
                        {paginatedData.map((item) => (
                            <Card
                                key={item.id}
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                uiState={uiState}
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
                        <img src="/up-chevron_8213555.png" alt="Go to top"/>
                    </div>
                </>
            )}
        </div>
    );
}


// Static data fetching function to get leaves data
export async function getStaticProps() {
    try {
        let allLeaves = [];
        let page = 1;
        const offset = 0;

        while (true) {
            const response = await axios.get("https://x8ki-letl-twmt.n7.xano.io/api:WVrFdUAc/cassandra_leaves", {
                params: {
                    page_number: page,
                    offset: offset,
                },
            });

            const items = response.data.items;
            if (items.length === 0) break;

            allLeaves = [...allLeaves, ...items];
            page++;
        }

        // Fetch metadata from Xano
        const metadataResponse = await axios.get("https://x8ki-letl-twmt.n7.xano.io/api:_YdzcIS0/metadata_table");
        const metadata = metadataResponse.data;

        // Combine useful data with metadata
        const combinedData = allLeaves.map((item) => ({
            ...item,
            ...metadata.find((meta) => meta.domain_name === item.domain_name),
        }));

        return {
            props: {
                leavesData: combinedData,
            },
        };
    } catch (error) {
        console.error("Error fetching data from Xano:", error);
        return {
            props: {
                leavesData: [],
            },
        };
    }
}