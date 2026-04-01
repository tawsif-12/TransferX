import './NewsCard.css';

export default function NewsCard({ news }) {
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHrs < 1) return 'Today';
    if (diffHrs < 24) return `Today, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="news-card">
      <div className="news-content">
        <div className="news-category">{news.category}</div>
        <h3 className="news-title">{news.title}</h3>
        <p className="news-description">{news.description}</p>
        <span className="news-time">{timeAgo(news.created_at)}</span>
      </div>
    </div>
  );
}
