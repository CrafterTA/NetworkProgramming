import React from 'react';
import Button from './Button';

const Services = () => {
  return (
    <section className="destination">
      <div className="section__container destination__container">
        <h3 className="section__subheader">Dịch vụ của chúng tôi</h3>
        <h2 className="section__header">Giải pháp <span style={{color: 'var(--primary-color)'}}>Giáo dục Online</span> Toàn diện</h2>
        <p className="section__description" style={{marginBottom: '3rem'}}>
          Chúng tôi cung cấp các dịch vụ giáo dục trực tuyến chất lượng cao, giúp học viên phát triển kỹ năng và đạt được mục tiêu học tập
        </p>
        
        <div className="destination__grid">
          {/* Service Card 1 - Learning Platform */}
          <div className="destination__card">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=smart" alt="Nền tảng học tập online" />
            <div className="destination__card__content">
              <h4>Nền tảng học tập thông minh</h4>
              <h5>Học tập cá nhân hóa với AI</h5>
              <div className="destination__card__footer">
                <h6 style={{color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600'}}>
                  ⭐ 4.9/5 đánh giá
                </h6>
                <button className="btn" style={{
                  padding: '0.5rem 1rem', 
                  fontSize: '0.9rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.3s ease'
                }}>
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </div>

          {/* Service Card 2 - Live Classes */}
          <div className="destination__card">
            <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop&crop=smart" alt="Lớp học trực tiếp" />
            <div className="destination__card__content">
              <h4>Lớp học trực tiếp với chuyên gia</h4>
              <h5>Tương tác real-time, Q&A trực tiếp</h5>
              <div className="destination__card__footer">
                <h6 style={{color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600'}}>
                  🎥 Live 24/7
                </h6>
                <button className="btn" style={{
                  padding: '0.5rem 1rem', 
                  fontSize: '0.9rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.3s ease'
                }}>
                  Tham gia ngay
                </button>
              </div>
            </div>
          </div>

          {/* Service Card 3 - Certification */}
          <div className="destination__card">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop&crop=smart" alt="Chứng chỉ được công nhận" />
            <div className="destination__card__content">
              <h4>Chứng chỉ được công nhận</h4>
              <h5>Được doanh nghiệp và tổ chức tin tưởng</h5>
              <div className="destination__card__footer">
                <h6 style={{color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '600'}}>
                  🏆 100% hợp lệ
                </h6>
                <button className="btn" style={{
                  padding: '0.5rem 1rem', 
                  fontSize: '0.9rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.3s ease'
                }}>
                  Xem mẫu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div style={{
          marginTop: '4rem',
          textAlign: 'center',
          padding: '3rem 2rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-dark)',
            marginBottom: '1rem'
          }}>
            Sẵn sàng bắt đầu hành trình học tập?
          </h3>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-light)',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Tham gia cùng hơn 50,000+ học viên đã tin tưởng lựa chọn nền tảng giáo dục của chúng tôi
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button className="btn" style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              transition: '0.3s ease',
              boxShadow: '0 4px 15px rgba(1, 187, 191, 0.3)'
            }}>
              Dùng thử miễn phí
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'var(--primary-color)',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              borderRadius: '0.75rem',
              border: '2px solid var(--primary-color)',
              cursor: 'pointer',
              transition: '0.3s ease',
              display: 'flex',
              alignItems: 'center'
            }}>
              Xem demo
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Services;