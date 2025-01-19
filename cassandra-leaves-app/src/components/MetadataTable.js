import React, { useState, useMemo } from "react";
import styles from "./MetadataTable.module.css";

const MetadataTable = ({ metadata }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMetadata = useMemo(() => {
        const result = metadata.filter((item) =>
            Object.values(item).some((value) =>
                (value !== null && value !== undefined ? value.toString() : "")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        );
        console.log("Filtered Metadata:", result);
        return result;
    }, [metadata, searchQuery]);

    console.log("Metadata:", metadata);

    return (
        <div className={styles.metadataTableContainer}>
            <input
                type="text"
                placeholder="Search metadata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchBar}
            />
            <table className={styles.metadataTable}>
                <thead>
                <tr>
                    <th>Domain Name</th>
                    <th>Language</th>
                    <th>Tags</th>
                    <th>HTTP Status</th>
                    <th>Published By</th>
                    <th>User Email</th>
                </tr>
                </thead>
                <tbody>
                {filteredMetadata.map((item, index) => (
                    <tr key={index}>
                        <td>{item.domain_name}</td>
                        <td>{item.language}</td>
                        <td>{item.tags.join(", ")}</td>
                        <td>{item.http_status}</td>
                        <td>{item.published_by}</td>
                        <td>{item.user_email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MetadataTable;