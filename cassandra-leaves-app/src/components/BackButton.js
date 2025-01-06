import React from 'react';
import { useRouter } from 'next/router';

const BackButton = ({ page = 1 }) => {
    const router = useRouter();

    return (
        <div className="back-button" onClick={() => router.push(`/?page=${page}`)}>
            <span>Back</span>
            <style jsx>{`
                .back-button {
                    display: inline-block;
                    color: #0070f3;
                    font-size: 1rem;
                    cursor: pointer;
                    text-decoration: none;
                    margin-bottom: 1rem;
                    padding: 0.5rem 1rem;
                    border: 1px solid #0070f3;
                    border-radius: 5px;
                    transition: all 0.2s ease-in-out;
                }
                .back-button:hover {
                    background-color: #0070f3;
                    color: #fff;
                }
            `}</style>
        </div>
    );
};

export default BackButton;
