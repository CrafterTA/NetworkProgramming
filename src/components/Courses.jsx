import React from 'react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();

  return (
    <section className="blog" id="blog">
      <div className="section__container blog__container">
        <h3 className="section__subheader">Khóa học</h3>
        <h2 className="section__header">Khóa học phổ biến nhất</h2>
        <div className="blog__grid">
          <div className="blog__card">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=smart" alt="Lập trình Web" />
            <div className="blog__content">
              <h4>Lập trình Web Full-stack từ cơ bản đến nâng cao</h4>
              <button className="btn" onClick={() => navigate('/blog/1')}>
                Tham gia khóa học
                <span><i className="ri-arrow-right-long-line"></i></span>
              </button>
            </div>
          </div>
          <div className="blog__card">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=smart" alt="Digital Marketing" />
            <div className="blog__content">
              <h4>Digital Marketing: Từ SEO đến Social Media Marketing</h4>
              <button className="btn" onClick={() => navigate('/blog/2')}>
                Tham gia khóa học
                <span><i className="ri-arrow-right-long-line"></i></span>
              </button>
            </div>
          </div>
          <div className="blog__card">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=smart" alt="Thiết kế UI/UX" />
            <div className="blog__content">
              <h4>
                Thiết kế UI/UX chuyên nghiệp với Figma và Adobe XD
              </h4>
              <button className="btn" onClick={() => navigate('/blog/3')}>
                Tham gia khóa học
                <span><i className="ri-arrow-right-long-line"></i></span>
              </button>
            </div>
          </div>
        </div>
        <div className="blog__btn">
          <button className="btn" onClick={() => navigate('/blog')}>
            Xem tất cả khóa học
            <span><i className="ri-arrow-right-long-line"></i></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;