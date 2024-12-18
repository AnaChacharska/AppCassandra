import { useState } from "react";
import Card from '../components/Card';

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

    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerCaseQuery = query.toLowerCase();
        const filtered = leavesData.filter((item) =>
            item.title.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
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

        setFilteredData([...filteredData, newRecord]);
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
        const updatedData = filteredData.filter((item) => item.id !== id);
        setFilteredData(updatedData);
        alert("Record deleted successfully.");
    };

    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className={`container ${isDarkMode ? 'dark' : ''}`}>
            <h1 className="title">Cassandra Leaves Dashboard</h1>

            {/* Success Message */}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {/* Toggle Switch */}
            <div className="toggle-container">
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-bar"
                />
            </div>

            <button className="add-button" onClick={() => { setIsEditing(false); setIsModalOpen(true); }}>
                Add Record
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
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
                        <div className="modal-actions">
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

            <div className="grid">
                {paginatedData.map((item) => (
                    <Card
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <div className="pagination">
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

            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=DM+Sans&display=swap');
              .container {
                padding: 40px;
                font-family: 'Poppins', sans-serif;
                background-color: #8BE4E1;
                color: black;
                position: relative;
              }
              .dark {
                background-color: #333;
                color: white;
              }
              .title {
                font-size: 2.8rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 20px;
              }
              .search-bar-container {
                text-align: center;
                margin-bottom: 20px;
              }
              .search-bar {
                padding: 12px;
                width: 60%;
                max-width: 500px;
                font-size: 1rem;
                border: 1px solid #d0d4d8;
                border-radius: 5px;
                margin: 0 auto;
                background-color: white;
                color: #239591;
              }
              .dark .search-bar {
                background-color: #555;
                color: white;
                border: 1px solid #444;
              }
              .add-button {
                display: block;
                margin: 20px auto;
                padding: 12px 20px;
                color: white;
                background: #239591;
                border-radius: 5px;
                cursor: pointer;
                transition: 0.3s ease;
              }
              .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
              }
              .pagination {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
                flex-wrap: wrap;
              }
              .pagination button {
                padding: 12px 20px;
                color: white;
                background: #239591;
                border-radius: 5px;
                cursor: pointer;
              }
              .dark .add-button, .dark .pagination button {
                background: #444;
              }
              .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .modal-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
                text-align: center;
              }
              .modal-content h2 {
                margin-bottom: 20px;
              }
              .modal-content input {
                padding: 12px;
                border: 1px solid #d0d4d8;
                border-radius: 5px;
                width: 100%;
                margin-bottom: 15px;
              }
              .modal-actions {
                display: flex;
                gap: 10px;
                justify-content: center;
              }
              .modal-actions button {
                padding: 10px 20px;
                border-radius: 5px;
                color: white;
                background: #239591;
                cursor: pointer;
              }
              .success-message {
                background-color: #d4edda;
                color: #155724;
                padding: 10px;
                margin-bottom: 20px;
                text-align: center;
                border: 1px solid #c3e6cb;
                border-radius: 5px;
              }
              .toggle-container {
                position: absolute;
                top: 20px;
                right: 20px;
              }
              .toggle-switch {
                position: relative;
                display: inline-block;
                width: 60px;
                height: 34px;
              }
              .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
              }
              .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 34px;
              }
              .slider:before {
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
              }
              input:checked + .slider {
                background-color: #2196F3;
              }
              input:checked + .slider:before {
                transform: translateX(26px);
              }
              @media (max-width: 600px) {
                .pagination {
                  flex-direction: column;
                  align-items: center;
                }
                .pagination button {
                  width: 100%;
                  max-width: none;
                }
              }
            `}</style>
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
