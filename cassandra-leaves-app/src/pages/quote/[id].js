import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Home.module.css";
import BackButton from "../../components/BackButton";

export default function QuoteDetail({ initialRecord }) {
    const router = useRouter();
    const { id, page } = router.query;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(!initialRecord);
    const [error, setError] = useState(null);
    const [record, setRecord] = useState(initialRecord);

    useEffect(() => {
        if (!id || initialRecord) return;

        const fetchRecord = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/fetchData?id=${id}`);
                setRecord(response.data);
                setError(null);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching record:", err);
                setError("Failed to load the record. Please try again.");
                setLoading(false);
            }
        };

        fetchRecord();
    }, [id]);

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode") === "true";
        setIsDarkMode(savedMode);
    }, []);

    useEffect(() => {
        const handleScrollToTop = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        const goTopButton = document.querySelector(".go-top-button");
        if (goTopButton) {
            goTopButton.addEventListener("click", handleScrollToTop);
        }
        return () => {
            if (goTopButton) {
                goTopButton.removeEventListener("click", handleScrollToTop);
            }
        };
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <BackButton page={page} />
                <p>{error  && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}</p>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="container">
                <BackButton page={page} />
                <h1 className="title">Record Not Found</h1>
                <p>The record with ID {id} does not exist.</p>
            </div>
        );
    }

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", newMode);
            return newMode;
        });
    };
    return (
        <div className={`container ${isDarkMode ? 'dark' : ''}`}>
            <div className="toggle-container">
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            <div className="header-container">
                <div className="back-button" onClick={() => router.push(`/?page=${page || 1}`)}>
                    <span>&lt;Back</span>
                </div>
                <h1 className="title">{record.title}</h1>
                <h2 className="title2">{record.domain_name}</h2>
            </div>
            <div className="details">
                <img src={record.preview_picture} alt="Preview" className="preview" />
                <div dangerouslySetInnerHTML={{ __html: record.content }} className="content" />
                <div className="tag-cloud">
                    {record.tags && record.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
                <div className="user-info">
                    <div className="info-item">
                        <img src="/link_6048306.png" alt="Link Icon" className="icon" />
                        <span><a href={record.url} target="_blank" rel="noopener noreferrer">{record.url}</a></span>
                    </div>
                    <div className="info-item">
                        <img src="/mail_16866791.png" alt="Mail Icon" className="icon" />
                        <span>{record.user_email}</span>
                    </div>
                    <div className="info-item">
                        <img src="/identity_16596318.png" alt="User Icon" className="icon" />
                        <span>{record.user_name}</span>
                    </div>
                </div>
            </div>
            <div className="go-top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <img src="/up-chevron_8213555.png" alt="Go to top" className="top-icon" />
            </div>






            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=DM+Sans&display=swap');

              .container {
                position: relative;
                padding: 20px;
                background-size: cover;
                color: #1b1c1d;
                font-family: 'Poppins', sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                background-color: #8BE4E1;
                box-sizing: border-box;
                align-items: center;
              }
              .dark {
                background-color: #123733;
              }
              .dark .title{
                color: #ededed;
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
              .back-button {
                position: relative;
                display: inline-block;
                font-size: 1.2rem;
                font-weight: 500;
                color: gray;
                cursor: pointer;
                margin-right: 20px;
                z-index: 10;
              }
              .back-button:hover{
                color: white;
              }
              .home-icon {
                width: 40px;
                height: 40px;
              }
              .header-container {
                width: 100%;
                max-width: 1000px;
                padding-left: 0;
              }
              .title {
                margin-top: 70px;
                font-size: 4.5rem;
                font-weight: 700;
                color: black;
                width: 100%;
                margin-bottom: 10px;
              }
              .details {
                margin-top: 20px;
                padding: 30px;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
                box-sizing: border-box;
                word-wrap: break-word;
                width: 100%;
                max-width: 1000px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
              }
              .content {
                margin-top: 10px;
                margin-bottom: 20px;
                padding: 20px;
                background: #f9f9f9;
                border: 1px solid #e0e3e6;
                border-radius: 5px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                flex-grow: 1;
                overflow-y: auto;
              }
              .dark .content{
                background-color: #16615d;
                color: #ededed;
              }
              .dark .details{
                background-color: #15514d;
              }
              .dark .tag{
                color: #ededed;
                background-color: #383838;
              }
              .dark .info-item{
                color: white;
              }
              .preview {
                max-width: 100%;
                border-radius: 10px;
                margin-top: 10px;
                height: auto;
              }
              .go-top-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                cursor: pointer;
                z-index: 1000;
                transition: transform 0.3s ease, opacity 0.3s ease;
                opacity: 0.8;
              }
              .go-top-button:hover{
                transform: scale(1.1);
                opacity: 1;
              }
              .go-up-button img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
              .top-icon {
                width: 100%;
                height: 100%;
              }

              h2 {
                color: lightslategray;
                font-weight: 100;
                margin-bottom: 20px;
                width: 100%;
                transition: color 0.3s;
              }
              h2:hover {
                color: white;
                font-weight: 300;
                cursor: pointer;
              }
              .tag-cloud {
                margin-top: 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                align-items: center;
                text-align: center;
                position: relative;
              }

              .tag-cloud::after {
                content: "";
                display: block;
                width: 100%;
                height: 0.5px;
                background-color: #ccc;
                margin-top: 20px;
              }
              .tag {
                background: #e8fbf8;
                border: 1px solid #ccc;
                border-radius: 20px;
                padding: 5px 15px;
                font-size: 1rem;
                font-weight: lighter;
                color: gray;
                transition: background 0.3s ease, color 0.3s ease;
                cursor: pointer;
              }

              .tag:hover {
                color: #000;
                border-color: black;
              }
              {
              .title {
                margin-top: 30px;
                font-size: 2.5rem;
              }
              .header-container {
                padding-left: 10px;
              }
              .details {
                padding: 10px;
                margin-top: 10px;
                width: 100%;
              }
              .content {
                padding: 10px;
                margin-top: 10px;
                margin-bottom: 10px;
              }
              .back-button {
                top: 10px;
                left: 10px;
              }
              .home-icon {
                width: 30px;
                height: 30px;
              }
              .go-top-button {
                width: 30px;
                height: 30px;
              }
              .user-info {
                display: grid;
                gap: 20px;
                place-items: center;
                margin-top: 20px;
                padding-bottom: 30px;
              }
              .info-item {
                display: inline-flex;
                align-items: center;
                gap: 8px;
              }

              .icon {
                width: 16px;
                height: 16px;
                display: block;
                object-fit: contain;
              }

              .info-text {
                font-size: 14px;
                line-height: 1.2;
                vertical-align: middle;
              }

              @media (max-width: 768px) {
                .user-info {
                  gap: 15px;
                }
              }
              }
              .info-table-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                font-family: 'Poppins', sans-serif;
              }

              .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: #e8fbf8;
                border-radius: 30px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                font-weight: 600;
                color: #333;
              }

              .info-row:nth-child(even) {
                background-color: #d6f5f2;
              }

              .info-label {
                color: #555;
                font-size: 1rem;
                font-weight: bold;
              }

              .info-value {
                color: #000;
                font-size: 1rem;
              }

              @media (max-width: 768px) {
                .info-row {
                  flex-direction: column;
                  padding: 10px 15px;
                }
                .info-label, .info-value {
                  text-align: center;
                }
              }

              .loading {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
              }

              .spinner {
                border: 4px solid transparent;
                border-top: 4px solid #3498db; /* Blue */
                border-right: 4px solid #e74c3c; /* Red for a gradient effect */
                border-radius: 50%;
                width: 60px; /* Smaller size */
                height: 60px;
                animation: spin 1.2s linear infinite; /* Faster spin */
              }

              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
        </div>
    );
}

export async function getServerSideProps({ params }) {
    const { id } = params;
    const { MongoClient } = await import("mongodb");

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();

        const database = client.db("your-database");
        const collection = database.collection("useful_data");

        const usefulData = await collection.findOne({ id: id });
        console.log("Useful Data:", usefulData);

        if (!usefulData) {
            console.error(`No useful data found for ID: ${id}`);
            return { notFound: true };
        }

        const metadataResponse = await axios.get(`https://x8ki-letl-twmt.n7.xano.io/api:_YdzcIS0/metadata_table/${id}`);
        const metadata = metadataResponse.data;
        console.log("Metadata:", metadata);

        if (!metadata) {
            console.error(`No metadata found for ID: ${id}`);
            return { notFound: true };
        }

        const combinedData = {
            title: usefulData.title,
            url: usefulData.url,
            preview_picture: usefulData.preview_picture,
            content: usefulData.content,
            last_sourced_from_wallabag: usefulData.last_sourced_from_wallabag || null,
            domain_name: metadata.domain_name,
            language: metadata.language,
            tags: metadata.tags,
            http_status: metadata.http_status,
            published_by: metadata.published_by,
            user_email: metadata.user_email,
        };

        return {
            props: {
                initialRecord: combinedData,
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                initialRecord: null,
            },
        };
    }
}
