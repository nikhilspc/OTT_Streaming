import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchData = async () => {
    const res = await api.get(`products/${id}/`);
    setProduct(res.data);
    const revRes = await api.get(`reviews/?product=${id}`);
    setReviews(revRes.data.filter((r) => r.product === parseInt(id)));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('reviews/', { product: id, rating, comment });
      setComment('');
      fetchData();
    } catch (err) {
      alert('You may have already reviewed this, or need to log in.');
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <p><b>Category:</b> {product.category_name} → {product.sub_category_name}</p>
      <p><b>Provider:</b> {product.provider_name}</p>
      <p><b>Average Rating:</b> ⭐ {product.average_rating || 'No ratings yet'}</p>

      <div className="video-embed">
        <iframe
          width="560"
          height="315"
          src={product.video_url}
          title={product.title}
          allowFullScreen
        ></iframe>
      </div>

      <h3>Reviews</h3>
      {reviews.map((r) => (
        <div key={r.id} className="review">
          <b>{r.username}</b> — ⭐ {r.rating}
          <p>{r.comment}</p>
        </div>
      ))}

      <h4>Add a Review</h4>
      <form onSubmit={handleReviewSubmit}>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
        </select>
        <textarea placeholder="Write a review..." value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
}