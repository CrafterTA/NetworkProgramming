import React from 'react';
import blog1 from '../assets/blog-1.png';
import blog2 from '../assets/blog-2.png';
import blog3 from '../assets/blog-3.png';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();

  return (
    <section className="blog" id="blog">
      <div className="section__container blog__container">
        <h3 className="section__subheader">Blogs</h3>
        <h2 className="section__header">Những tin tức và blog</h2>
        <div className="blog__grid">
          <div className="blog__card">
            <img src={blog1} alt="blog" />
            <div className="blog__content">
              <h4>Trường xanh và những "người hùng" mang trong mình chiếc áo học sinh</h4>
              <button className="btn" onClick={() => navigate('/blog/1')}>
                Đọc thêm
                <span><i className="ri-arrow-right-long-line"></i></span>
              </button>
            </div>
          </div>
          <div className="blog__card">
            <img src={blog2} alt="blog" />
            <div className="blog__content">
              <h4>Trường học xanh là gì ? Cùng tìm hiểu về trường xanh</h4>
              <button className="btn" onClick={() => navigate('/blog/2')}>
                Đọc thêm
                <span><i className="ri-arrow-right-long-line"></i></span>
              </button>
            </div>
          </div>
          <div className="blog__card">
            <img src={blog3} alt="blog" />
            <div className="blog__content">
              <h4>
                Trường xanh và những mục tiêu bền vững trong giáo dục
              </h4>
              <button className="btn" onClick={() => navigate('/blog/3')}>
                Đọc thêm
                <span><i className="ri-arrow-right-long-line"></i></span>
              </button>
            </div>
          </div>
        </div>
        <div className="blog__btn">
          <button className="btn" onClick={() => navigate('/blog')}>
            Xem tất cả
            <span><i className="ri-arrow-right-long-line"></i></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;