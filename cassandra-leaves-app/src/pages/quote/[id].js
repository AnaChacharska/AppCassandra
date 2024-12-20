import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./QuoteDetail.module.css";

export default function QuoteDetail({ leavesData }) {
    const router = useRouter();
    const { id } = router.query;
    const [isDarkMode, setIsDarkMode] = useState(false);

    const record = leavesData.find((item) => String(item.id) === String(id));

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

    if (!record) {
        return (
            <div className={styles.container}>
                <div className={styles.backButton} onClick={() => router.push("/")}>Back</div>
                <h1 className={styles.title}>Record Not Found</h1>
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
        <div className={`${styles.container} ${isDarkMode ? styles.dark : ""}`}>
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

            <div className={styles.headerContainer}>
                <div className={styles.backButton} onClick={() => router.push("/")}>
                    <span>&lt;Back</span>
                </div>
                <h1 className={styles.title}>{record.title}</h1>
                <h2>{record.domain_name}</h2>
            </div>
            <div className={styles.details}>
                <img src={record.preview_picture} alt="Preview" className={styles.preview} />
                <div dangerouslySetInnerHTML={{ __html: record.content }} className={styles.content} />
                <div className={styles.tagCloud}>
                    {record.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                </div>
                <div className={styles.userInfo}>
                    <div className={styles.infoItem}>
                        <img src="/link_6048306.png" alt="Link Icon" className={styles.icon} />
                        <span><a href={record.url} target="_blank" rel="noopener noreferrer">{record.url}</a></span>
                    </div>
                    <div className={styles.infoItem}>
                        <img src="/mail_16866791.png" alt="Mail Icon" className={styles.icon} />
                        <span>{record.user_email}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <img src="/identity_16596318.png" alt="User Icon" className={styles.icon} />
                        <span>{record.user_name}</span>
                    </div>
                </div>
            </div>
            <div className={styles.goTopButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <img src="/up-chevron_8213555.png" alt="Go to top" className={styles.topIcon} />
            </div>
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
