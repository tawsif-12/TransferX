import { useState, useEffect } from 'react';
import api from '../api/axios';
import './PlayerRating.css';

export default function PlayerRating({ playerId, playerName }) {
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRating();
  }, [playerId]);

  const fetchRating = async () => {
    try {
      const res = await api.get(`/ratings/player/${playerId}`);
      setAvgRating(res.data.averageRating);
      setTotalRatings(res.data.totalRatings);

      // Get userId from transferx_user or userId key
      let userId = localStorage.getItem('userId');
      if (!userId) {
        const userStr = localStorage.getItem('transferx_user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.id;
          } catch (e) {
            console.error('Failed to parse transferx_user:', e);
          }
        }
      }

      const userRatingData = res.data.ratings.find(
        (r) => r.user_id === parseInt(userId)
      );
      if (userRatingData) {
        setUserRating(userRatingData.rating);
        setReview(userRatingData.review || '');
      }
    } catch (error) {
      console.error('Failed to fetch rating:', error);
    }
  };

  const handleRating = async (rating) => {
    try {
      setLoading(true);
      await api.post(`/ratings/player/${playerId}`, {
        rating,
        review
      });
      setUserRating(rating);
      setMessage('Rating saved!');
      setTimeout(() => setMessage(''), 2000);
      fetchRating();
    } catch (error) {
      console.error('Failed to save rating:', error);
      setMessage('Failed to save rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-rating">
      <div className="rating-header">
        <h4>{playerName}</h4>
        <div className="avg-rating">
          ⭐ {avgRating > 0 ? avgRating : 'N/A'} ({totalRatings})
        </div>
      </div>

      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${userRating >= star ? 'active' : ''}`}
            onClick={() => handleRating(star)}
            disabled={loading}
            title={`Rate ${star}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="review-input"
        placeholder="Add a review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows="2"
      />

      {message && <div className="message">{message}</div>}
    </div>
  );
}
