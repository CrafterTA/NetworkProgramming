import React from 'react';

const Testimonials = () => {
  return (
    <section className="about" id="about">
      <div className="section__container about__container">
        <div className="about__image">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=400&fit=crop&crop=smart" alt="Học viên thành công" />
        </div>
        <div className="about__content">
          <h3 className="section__subheader">Phản hồi từ học viên</h3>
          <h2 className="section__header">
            Hàng nghìn học viên đã <span style={{color: 'var(--primary-color)'}}>thành công</span> với chúng tôi
          </h2>
          <p className="section__description">
            Với hơn 5 năm kinh nghiệm trong lĩnh vực giáo dục trực tuyến, chúng tôi đã giúp 
            hơn 50,000+ học viên phát triển kỹ năng và đạt được mục tiêu nghề nghiệp. 
            Từ sinh viên mới tốt nghiệp đến chuyên gia muốn nâng cao trình độ, 
            nền tảng của chúng tôi luôn đồng hành cùng bạn trên hành trình học tập.
          </p>

          {/* Stats Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '2rem',
            margin: '2rem 0',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>50K+</div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-light)',
                fontWeight: '500'
              }}>Học viên đã học</div>
            </div>
            
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>98%</div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-light)',
                fontWeight: '500'
              }}>Tỷ lệ hài lòng</div>
            </div>
            
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>1200+</div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-light)',
                fontWeight: '500'
              }}>Khóa học</div>
            </div>
            
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'var(--primary-color)',
                marginBottom: '0.5rem'
              }}>4.9⭐</div>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-light)',
                fontWeight: '500'
              }}>Đánh giá TB</div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div style={{
            backgroundColor: 'var(--extra-light)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            marginTop: '2rem',
            borderLeft: '4px solid var(--primary-color)',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--text-medium)',
              marginBottom: '1rem',
              lineHeight: '1.6'
            }}>
              "Tôi đã học được rất nhiều kỹ năng mới và ứng dụng ngay vào công việc. 
              Giảng viên nhiệt tình, nội dung cập nhật. Đây thực sự là khoản đầu tư xứng đáng!"
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600'
              }}>
                NV
              </div>
              <div>
                <div style={{
                  fontWeight: '600',
                  color: 'var(--text-dark)',
                  fontSize: '0.95rem'
                }}>
                  Nguyễn Văn A
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-light)'
                }}>
                  Lập trình viên tại FPT Software
                </div>
              </div>
            </div>
          </div>
          
          <div className="about__signature" style={{
            marginTop: '2rem',
            fontSize: '1.8rem',
            color: 'var(--primary-color)',
            fontWeight: '700'
          }}>
            EduPlatform Online
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;