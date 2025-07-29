import React from 'react';
import Button from './Button';

const Hero = () => {
  return (
    <header className="section__container header__container" id="home">
      <div className="header__image">
        <img src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=700&h=500&fit=crop&crop=smart" alt="Online Education Platform" />
      </div>
      <div className="header__content">
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '2rem',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '1.5rem'
        }}>
          🎓 Nền tảng học tập #1 Việt Nam
        </div>
        
        <h1 style={{color: 'var(--text-dark)'}}>
          Học tập <span style={{color: 'var(--primary-color)'}}>Online</span> 
          <br />Thông minh & Hiệu quả
        </h1>
        
        <p className="section__description">
          Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. 
          Học mọi lúc, mọi nơi với công nghệ AI tiên tiến, tương tác trực tiếp và 
          nhận chứng chỉ được công nhận bởi doanh nghiệp.
        </p>

        {/* Search/Filter Form */}
        <form action="/" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <div className="input__group">
            <label htmlFor="category" style={{
              color: 'var(--text-light)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{color: 'var(--primary-color)'}}>📚</span> Danh mục khóa học
            </label>
            <input
              type="text"
              name="category"
              placeholder="Lập trình, Marketing, Thiết kế..."
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--text-dark)'
              }}
            />
          </div>
          
          <div className="input__group">
            <label htmlFor="level" style={{
              color: 'var(--text-light)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{color: 'var(--primary-color)'}}>⚡</span> Trình độ
            </label>
            <input
              type="text"
              name="level"
              placeholder="Người mới bắt đầu, Trung cấp, Chuyên gia"
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                color: 'var(--text-dark)'
              }}
            />
          </div>
          
          <button className="btn" style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '0.75rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🔍 Tìm khóa học
          </button>
        </form>

        {/* Stats Section */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '2.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{textAlign: 'center'}}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: 'var(--primary-color)',
              marginBottom: '0.25rem'
            }}>50K+</div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>Học viên</div>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: 'var(--primary-color)',
              marginBottom: '0.25rem'
            }}>1,200+</div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>Khóa học</div>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: 'var(--primary-color)',
              marginBottom: '0.25rem'
            }}>4.9</div>
            <div style={{
              fontSize: '0.9rem',
              color: 'var(--text-light)',
              fontWeight: '500'
            }}>⭐ Đánh giá</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;