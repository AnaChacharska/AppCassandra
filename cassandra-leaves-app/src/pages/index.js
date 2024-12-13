import Link from "next/link";
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
                            <Link href={`/quote/${item.id}`}>
                                <button>View</button>
                            </Link>
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
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=DM+Sans&display=swap');

              .container {
                padding: 40px;
                background: url('Screenshot 2024-12-13 124659.png') no-repeat center center;
                background-size: cover;
                color: #1b1c1d;
                font-family: 'Poppins', sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
              }
              .title {
                font-size: 2.8rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 20px;
                color: #1b1c1d;
              }
              .search-bar {
                margin-bottom: 20px;
                padding: 12px;
                width: 100%;
                font-size: 1rem;
                border: 1px solid #d0d4d8;
                border-radius: 5px;
                color: #848d97;
              }
              .form {
                margin-bottom: 20px;
                display: flex;
                gap: 15px;
                justify-content: center;
              }
              .form input {
                padding: 12px;
                font-size: 1rem;
                border: 1px solid #d0d4d8;
                border-radius: 5px;
                width: 200px;
                color: #848d97;
              }
              .form button {
                padding: 12px 40px;
                font-size: 1rem;
                color: white;
                background: #848d97;
                border-radius: 5px;
                cursor: pointer;
                transition: 0.3s ease;
              }
              .form button:hover {
                background: #1b1c1d;
              }
              table {
                width: 100%;
                margin-top: 20px;
                border-collapse: collapse;
                border: 1px solid #d0d4d8;
                border-radius: 5px;
                overflow: hidden;
                background-color: rgba(255, 255, 255, 0.6);
              }
              th,
              td {
                padding: 15px;
                text-align: left;
                border-bottom: 1px solid #d0d4d8;
              }
              th {
                background-color: #e0e3e6;
                font-weight: 500;
              }
              tr:nth-child(even) {
                background: #f9f9f9;
              }
              tr:hover {
                background: #e0e3e6;
              }
              .pagination {
                margin-top: 20px;
                display: flex;
                justify-content: center;
                gap: 15px;
              }
              .pagination button {
                padding: 12px 20px;
                font-size: 1rem;
                color: white;
                background: #848d97;
                border-radius: 5px;
                cursor: pointer;
                transition: 0.3s ease;
              }
              .pagination button:hover {
                background: #1b1c1d;
              }
              .quoted-content {
                margin-bottom: 20px;
                background-color: rgba(255, 255, 255, 0.6);
                padding: 40px;
                border-radius: 10px;
                color: #1b1c1d;
              }
              .quoted-content h2 {
                margin-bottom: 10px;
              }
              .quoted-content button {
                margin-top: 10px;
                padding: 10px 15px;
                background: #848d97;
                border: none;
                color: white;
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
