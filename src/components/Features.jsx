import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { 
    id: 1, 
    img: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=300&h=200&fit=crop&crop=smart', 
    title: 'Học tập linh hoạt', 
    description: 'Học mọi lúc, mọi nơi',
    icon: '🕒',
    stats: '24/7 Available'
  },
  { 
    id: 2, 
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop&crop=smart', 
    title: 'Chứng chỉ quốc tế', 
    description: 'Được công nhận toàn cầu',
    icon: '🏆',
    stats: '100% Valid'
  },
  { 
    id: 3, 
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop&crop=smart', 
    title: 'Giảng viên chuyên gia', 
    description: 'Đội ngũ giảng viên hàng đầu',
    icon: '👨‍🏫',
    stats: '500+ Experts'
  },
  { 
    id: 4, 
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop&crop=smart', 
    title: 'Hỗ trợ AI thông minh', 
    description: 'Học tập cá nhân hóa với AI',
    icon: '🤖',
    stats: 'AI Powered'
  },
];

const Features = () => {
  const navigate = useNavigate();

  return (
    <section className="section__container tour__container expanded-tour__container" id="features">
      <h3 className="section__subheader">Tính năng nổi bật</h3>
      <h2 className="section__header">
        Tại sao chọn <span style={{color: 'var(--primary-color)'}}>nền tảng</span> của chúng tôi?
      </h2>
      <p className="section__description" style={{marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem'}}>
        Chúng tôi mang đến trải nghiệm học tập tuyệt vời với công nghệ tiên tiến và phương pháp giảng dạy hiện đại
      </p>
      
      <div className="tour__grid expanded-tour__grid">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="tour__card expanded-tour__card"
            style={{ 
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate(`/features/${feature.id}`)}
          >
            {/* Feature Badge */}
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '2rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: 'var(--primary-color)',
              zIndex: 2,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              {feature.stats}
            </div>

            <img src={feature.img} alt={feature.title} style={{
              height: '200px',
              objectFit: 'cover',
              borderRadius: '0.75rem'
            }} />
            
            {/* Feature Icon */}
            <div style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              margin: '1rem 0 0.5rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}>
              {feature.icon}
            </div>
            
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--text-dark)',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {feature.title}
            </h4>
            
            <p style={{
              color: 'var(--text-light)',
              textAlign: 'center',
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {feature.description}
            </p>

            {/* Hover Effect Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--primary-color) 0%, #1d4ed8 100%)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.3s ease'
            }} className="feature-hover-line" />
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem'
      }}>
        <button 
          className="btn"
          onClick={() => navigate('/courses')}
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🚀 Khám phá tất cả khóa học
        </button>
      </div>
    </section>
  );
};

export default Features;