import { useState } from "react";

export default function Home({ leavesData }) {
    const [filteredData, setFilteredData] = useState(leavesData || []); // Default to an empty array
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formState, setFormState] = useState({ id: "", title: "", domain_name: "" });
    const [isEditing, setIsEditing] = useState(false);

    // Handle search
    const handleSearch = (query) => {
        setSearchQuery(query);
        const lowerCaseQuery = query.toLowerCase();
        const filtered = leavesData.filter((item) =>
            item.title.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page on search
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    // Add a new record
    const handleAddRecord = () => {
        if (!formState.title || !formState.domain_name) {
            alert("Please fill out all fields.");
            return;
        }

        const newRecord = {
            id: filteredData.length + 1, // Generate a new ID
            title: formState.title,
            domain_name: formState.domain_name,
        };

        setFilteredData([...filteredData, newRecord]);
        setFormState({ id: "", title: "", domain_name: "" });
    };

    // Edit a record
    const handleEdit = (record) => {
        setIsEditing(true);
        setFormState(record);
    };

    const handleUpdateRecord = () => {
        const updatedData = filteredData.map((item) =>
            item.id === formState.id ? formState : item
        );

        setFilteredData(updatedData);
        setIsEditing(false);
        setFormState({ id: "", title: "", domain_name: "" });
    };

    // Delete a record
    const handleDelete = (id) => {
        const updatedData = filteredData.filter((item) => item.id !== id);
        setFilteredData(updatedData);
        alert("Record deleted successfully.");
    };

    // Pagination logic
    const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="container">
            <h1 className="title">Cassandra Leaves Dashboard</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-bar"
            />

            {/* Form */}
            <div className="form">
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
                {isEditing ? (
                    <button onClick={handleUpdateRecord}>Update Record</button>
                ) : (
                    <button onClick={handleAddRecord}>Add Record</button>
                )}
            </div>

            {/* Table */}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Domain</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td dangerouslySetInnerHTML={{ __html: item.title }}></td>
                        <td>{item.domain_name}</td>
                        <td>
                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
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
              .container {
                padding: 20px;
                background-image: url('/Screenshot 2024-12-11 234657.png');
                background-size: cover;
                background-position: center;
                height: 100vh;
                color: white;
                font-family: Arial, Helvetica, sans-serif;
                background-color: rgba(0, 0, 0, 0.5);
                background-blend-mode: lighten;
              }
              .title {
                font-size: 2.5rem;
                font-weight: bold;
                text-align: center;
                margin-bottom: 20px;
              }
              .search-bar {
                margin-bottom: 20px;
                padding: 10px;
                width: 100%;
                font-size: 1rem;
                border: 1px solid white;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
              }
              .form {
                margin-bottom: 20px;
                display: flex;
                gap: 10px;
              }
              .form input {
                padding: 10px;
                font-size: 1rem;
                border: 1px solid white;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
              }
              .form button {
                padding: 10px 15px;
                font-size: 1rem;
                color: white;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid white;
                border-radius: 5px;
                cursor: pointer;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 10px;
                overflow: hidden;
              }
              th,
              td {
                padding: 15px;
                text-align: left;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
              }
              th {
                font-weight: bold;
                background: rgba(0, 0, 0, 0.8);
              }
              tr:nth-child(even) {
                background: rgba(255, 255, 255, 0.1);
              }
              tr:hover {
                background: rgba(255, 255, 255, 0.2);
              }
              .pagination {
                margin-top: 20px;
                display: flex;
                justify-content: center;
                gap: 10px;
              }
              .pagination button {
                padding: 10px 15px;
                font-size: 1rem;
                color: white;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid white;
                border-radius: 5px;
                cursor: pointer;
              }
            `}</style>
        </div>
    );
}

// Load data from the JSON file
export async function getStaticProps() {
    const leavesData = require("../data/leaves.json");
    return {
        props: {
            leavesData,
        },
    };
}
