import Link from "next/link";

const Card = ({ item, onEdit, onDelete }) => {
    return (
        <div className="card">
            <img src={item.preview_picture} alt={item.title} className="card-image" />
            <div className="card-content">
                <Link href={`/quote/${item.id}`}>
                    <h2 className="card-title" dangerouslySetInnerHTML={{ __html: item.title }}></h2>
                </Link>
                <p>{item.domain_name}</p>
            </div>
            <div className="actions">
                <img
                    src="/writing_2643093.png"
                    alt="Edit"
                    className="action-icon"
                    onClick={() => onEdit(item)}
                />
                <img
                    src="/trash_2057606.png"
                    alt="Delete"
                    className="action-icon"
                    onClick={() => onDelete(item.id)}
                />
            </div>
            <style jsx>{`
              .card {
                background: white;
                padding: 0;
                border: 1px solid #e0e3e6;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                height: 400px; 
              }
              .card:hover {
                transform: translateY(-5px);
              }
              .card-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
              }
              .card-content {
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex-grow: 1;
              }
              .card-title {
                font-size: 1.2rem; /* Consistent text size */
                margin-bottom: 10px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2; 
                -webkit-box-orient: vertical;
                cursor: pointer;
                text-decoration: none; 
                transition: color 0.3s ease;
              }
              .card-title:hover {
                color: #848d97; 
              }
              .card p {
                font-size: 1rem; 
                color: #777;
                margin-bottom: auto; 
              }
              .actions {
                display: flex;
                justify-content: flex-start;
                padding: 0 20px 20px 20px;
                gap: 10px; 
              }
              .action-icon {
                width: 24px;
                height: 24px; 
                cursor: pointer;
                transition: opacity 0.3s ease;
              }
              .action-icon:hover {
                opacity: 0.7; 
              }
            `}</style>
        </div>
    );
};

export default Card;
