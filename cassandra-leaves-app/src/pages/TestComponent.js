import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestComponent = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://x8ki-letl-twmt.n7.xano.io/api:WVrFdUAc/cassandra_leaves', {
                    params: {
                        page_number: 1,
                        offset: 8,
                    },
                });
                setLeaves(response.data.items);  // Storing items in state
            } catch (error) {
                setError('Error fetching data');
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Test Data from Xano</h1>
            {error && <p>{error}</p>}
            <ul>
                {leaves.length > 0 ? (
                    leaves.map((item) => (
                        <li key={item.id}>
                            <div>
                                <strong>Title:</strong> {item.title}
                            </div>
                            <div>
                                <strong>Tags:</strong> {item.tags.join(', ')}
                            </div>
                            <div>
                                <strong>Content:</strong> <span dangerouslySetInnerHTML={{ __html: item.content }} />
                            </div>
                            <hr />
                        </li>
                    ))
                ) : (
                    <p>No data found</p>
                )}
            </ul>
        </div>
    );
};

export default TestComponent;
