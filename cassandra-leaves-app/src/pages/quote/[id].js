import { useRouter } from "next/router";

export default function QuoteDetail({ leavesData }) {
    const router = useRouter();
    const { id } = router.query;

    // Find the record matching the ID
    const record = leavesData.find((item) => String(item.id) === String(id));

    if (!record) {
        return (
            <div className="container">
                <h1 className="title">Record Not Found</h1>
                <p>The record with ID {id} does not exist.</p>
                <button
                    className="button"
                    onClick={() => router.push("/")}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="title">Record Details</h1>
            <div className="details">
                <p><strong>ID:</strong> {record.id}</p>
                <p><strong>Title:</strong> {record.title}</p>
                <p><strong>Domain:</strong> {record.domain_name}</p>
                <p><strong>Content:</strong></p>
                <div dangerouslySetInnerHTML={{ __html: record.content }} className="content" />
                <p><strong>Tags:</strong> {record.tags.join(", ")}</p>
                <p><strong>Language:</strong> {record.language}</p>
                <p><strong>MIME Type:</strong> {record.mimetype}</p>
                <p><strong>HTTP Status:</strong> {record.http_status}</p>
                <p><strong>Published By:</strong> {record.published_by}</p>
                <p>
                    <strong>Source URL:</strong> <a href={record.url} target="_blank" rel="noopener noreferrer">{record.url}</a>
                </p>
                <p>
                    <strong>Preview Picture:</strong>
                    <br />
                    <img src={record.preview_picture} alt="Preview" className="preview" />
                </p>
                <p><strong>Wallabag Created At:</strong> {record.wallabag_created_at}</p>
                <p><strong>Wallabag Updated At:</strong> {record.wallabag_updated_at}</p>
                <p><strong>User Name:</strong> {record.user_name}</p>
                <p><strong>User Email:</strong> {record.user_email}</p>
            </div>
            <button
                className="button"
                onClick={() => router.push("/")}
            >
                Back to Dashboard
            </button>

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
                background-color: rgba(255, 255, 255, 0.8);
              }
              .title {
                font-size: 2.8rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 20px;
                color: #1b1c1d;
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
                padding: 40px;
                background: #f9f9f9;
                border: 1px solid #e0e3e6;
                border-radius: 5px;
              }
              .preview {
                max-width: 100%;
                border-radius: 10px;
                margin-top: 10px;
              }
              .button {
                margin-top: 20px;
                padding: 12px 20px;
                font-size: 1rem;
                color: white;
                background: #848d97;
                border-radius: 5px;
                cursor: pointer;
                transition: 0.3s ease;
              }
              .button:hover {
                background: #1b1c1d;
              }
            `}</style>
        </div>
    );
}

// Load data for the page
export async function getStaticProps() {
    const leavesData = require("../../data/leaves.json");
    return {
        props: {
            leavesData,
        },
    };
}

// Generate paths for all quotes
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
