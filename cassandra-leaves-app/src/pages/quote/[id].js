import { useRouter } from "next/router";
import { useEffect } from "react";

export default function QuoteDetail({ leavesData }) {
    const router = useRouter();
    const { id } = router.query;

    const record = leavesData.find((item) => String(item.id) === String(id));

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

    if (!record) {
        return (
            <div className="container">
                <div className="back-button" onClick={() => router.push("/")}>
                    <img src="/left-chevron_8213511.png" alt="Home" className="home-icon" />
                </div>
                <h1 className="title">Record Not Found</h1>
                <p>The record with ID {id} does not exist.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="back-button" onClick={() => router.push("/")}>
                <img src="/left-chevron_8213511.png" alt="Home" className="home-icon" />
            </div>
            <div className="header-container">
                <h1 className="title">{record.title}</h1>
                <h2>{record.domain_name}</h2>
            </div>
            <div className="details">
                <img src={record.preview_picture} alt="Preview" className="preview" />
                <div dangerouslySetInnerHTML={{ __html: record.content }} className="content" />
                <div className="tag-cloud">
                    {record.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
                <p><strong>Language:</strong> {record.language}</p>
                <p><strong>MIME Type:</strong> {record.mimetype}</p>
                <p><strong>HTTP Status:</strong> {record.http_status}</p>
                <p><strong>Published By:</strong> {record.published_by}</p>
                <p>
                    <strong>Source URL:</strong> <a href={record.url} target="_blank" rel="noopener noreferrer">{record.url}</a>
                </p>
                <p><strong>Wallabag Created At:</strong> {record.wallabag_created_at}</p>
                <p><strong>Wallabag Updated At:</strong> {record.wallabag_updated_at}</p>
                <p><strong>User Name:</strong> {record.user_name}</p>
                <p><strong>User Email:</strong> {record.user_email}</p>
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
              .back-button {
                position: absolute;
                top: 20px;
                left: 20px;
                cursor: pointer;
                z-index: 10;
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
                font-size: 2.5rem;
                font-weight: 700;
                color: white;
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
              .preview {
                max-width: 100%;
                border-radius: 10px;
                margin-top: 10px;
                height: auto;
              }
              .go-top-button {
                position: fixed; 
                bottom: 20px; 
                left: 20px; 
                width: 40px;
                height: 40px;
                cursor: pointer;
                z-index: 1000;
                transition: 0.3s ease;
              }

              .go-top-button:hover .top-icon {
                transform: scale(1.1);
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
                word-wrap: break-word;
              }
              .tag {
                background: #e8fbf8; 
                border: 1px solid #ccc; 
                border-radius: 20px;
                padding: 5px 15px;
                font-size: 1rem;
                font-weight: 600;
                color: #000;
                transition: background 0.3s ease, color 0.3s ease;
                cursor: pointer; /* Change cursor to pointer */
              }

              .tag:hover {
                color: #000; 
                border-color: black; 
              }
              @media (max-width: 768px) {
                .container {
                  padding: 10px;
                }
                .title {
                  margin-top: 30px; 
                  font-size: 1.5rem;
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
              }
            `}</style>
        </div>
    );
}

export async function getStaticProps() {
    const leavesData = require("../../data/leaves.json");
    return {
        props: {
            leavesData,
        },
    };
}

export async function getStaticPaths() {
    const leavesData = require("../../data/leaves.json");

    const paths = leavesData.map((item) => ({
        params: { id: item.id.toString() },
    }));

    return {
        paths,
        fallback: false,
    };
}
