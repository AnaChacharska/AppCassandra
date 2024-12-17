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
            <h1 className="title">{record.title}</h1>
            <h2>{record.domain_name}</h2>
            <div className="details">
                <p>
                    <img src={record.preview_picture} alt="Preview" className="preview" />
                </p>
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
            <div className="go-top-button">
                <img src="/up-chevron_8213555.png" alt="Go to top" className="top-icon" />
            </div>

            <style jsx>{`
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&family=DM+Sans&display=swap');

              .container {
                position: relative;
                padding: 50px 150px;
                background-size: cover;
                color: #1b1c1d;
                font-family: 'Poppins', sans-serif;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                background-color: #8BE4E1;
              }
              .back-button {
                position: absolute;
                top: 20px;
                left: 20px;
                cursor: pointer;
              }
              .home-icon {
                width: 40px;
                height: 40px;
              }
              .title {
                font-size: 2.8rem;
                font-weight: 700;
                margin-bottom: 20px;
                color: white;
              }
              .details {
                margin-top: 20px;
                padding: 40px;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 10px;
              }
              .content {
                margin-top: 10px;
                margin-bottom: 20px;
                padding: 30px;
                background: #f9f9f9;
                border: 1px solid #e0e3e6;
                border-radius: 5px;
              }
              .preview {
                max-width: 100%;
                border-radius: 10px;
                margin-top: 10px;
              }
              .go-top-button {
                margin-top: 20px;
                width: 40px;
                height: 40px;
                cursor: pointer;
                align-self: center;
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
              }
              h2:hover {
                color: white;
                font-weight: 300;
              }
              .tag-cloud {
                margin-top: 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
              }
              .tag {
                background: #f0f0f0;
                border-radius: 20px;
                padding: 5px 15px;
                font-size: 1rem;
                font-weight: 500;
                color: #333;
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
