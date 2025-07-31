import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';

const RatingModal = ({ room, onClose, onComplete }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { customerCloseRoom } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const roomId = room?.room_id || room?.id;
      
      if (!roomId) {
        throw new Error('Room ID not found');
      }
      
      await customerCloseRoom(roomId, {
        reason: 'Ended by customer with rating',
        rating,
        comment
      });
      
      onComplete();
    } catch (error) {
      console.error('❌ Error submitting rating:', error);
      
      // If the room is already closed (which is fine), still complete the action
      if (error?.message?.includes('already closed') || error?.status === 400) {
        console.log('📝 Room already closed, completing anyway');
        onComplete();
      } else {
        alert('Có lỗi xảy ra khi gửi đánh giá, nhưng chat đã được kết thúc');
        onComplete(); // Still complete even if rating fails
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rating-modal-overlay">
      <div className="rating-modal">
        <div className="modal-header">
          <h3>Đánh giá chất lượng hỗ trợ</h3>
          <button 
            className="close-btn"
            onClick={onClose}
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="rating-section">
            <p>Bạn có hài lòng với dịch vụ hỗ trợ không?</p>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="comment-section">
            <label htmlFor="comment">Góp ý thêm (tùy chọn):</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              rows={4}
              disabled={submitting}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              disabled={submitting}
              className="cancel-btn"
            >
              Bỏ qua
            </button>
            <button 
              type="submit" 
              disabled={submitting || rating === 0}
              className="submit-btn"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>

        <style>{`
          .rating-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .rating-modal {
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .modal-header h3 {
            margin: 0;
            color: #1f2937;
            font-size: 1.25rem;
            font-weight: 600;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-btn:hover {
            color: #374151;
          }

          .rating-section {
            margin-bottom: 20px;
            text-align: center;
          }

          .rating-section p {
            margin-bottom: 15px;
            color: #4b5563;
          }

          .stars {
            display: flex;
            justify-content: center;
            gap: 8px;
          }

          .star {
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            opacity: 0.3;
            transition: opacity 0.2s;
            padding: 4px;
          }

          .star:hover,
          .star.active {
            opacity: 1;
          }

          .comment-section {
            margin-bottom: 24px;
          }

          .comment-section label {
            display: block;
            margin-bottom: 8px;
            color: #374151;
            font-weight: 500;
          }

          .comment-section textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            resize: vertical;
            min-height: 80px;
            font-family: inherit;
          }

          .comment-section textarea:focus {
            outline: none;
            border-color: #3b82f6;
            ring: 2px solid rgba(59, 130, 246, 0.1);
          }

          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
          }

          .cancel-btn,
          .submit-btn {
            padding: 8px 16px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .cancel-btn {
            background: #f3f4f6;
            color: #374151;
          }

          .cancel-btn:hover:not(:disabled) {
            background: #e5e7eb;
          }

          .submit-btn {
            background: #3b82f6;
            color: white;
          }

          .submit-btn:hover:not(:disabled) {
            background: #2563eb;
          }

          .submit-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
};

export default RatingModal;
