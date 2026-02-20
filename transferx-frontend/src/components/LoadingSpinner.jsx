import './LoadingSpinner.css';

export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="loading-spinner-overlay">
        <div className="loading-spinner loading-spinner--large"></div>
      </div>
    );
  }

  return <div className="loading-spinner loading-spinner--small"></div>;
}
