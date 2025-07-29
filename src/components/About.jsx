import React from 'react';
import Button from './Button';
import banner4 from '../assets/banner-4.jpg';
import banner6 from '../assets/banner-6.jpg';
import banner5 from '../assets/banner-5.jpg';


const About = () => {
  return (
    <section className="destination">
      <div className="section__container destination__container">
        <h3 className="section__subheader">Về chúng tôi</h3>
        <h2 className="section__header">Các hoạt động vì trường xanh</h2>
        <div className="destination__grid">
          <div className="destination__card">
            <img src={banner4} alt="destination" />
            <div className="destination__card__content">
              <h4>Hành trình xây dựng trường học xanh – Vì một tương lai bền vững!</h4>
              <h5>Trường THPT Bình Phước</h5>
              <div className="destination__card__footer">
         
                <p>23-5-2021</p>
              </div>
            </div>
          </div>
          <div className="destination__card">
            <img src={banner6} alt="destination" />
            <div className="destination__card__content">
              <h4>Cùng nhau trồng cây, tô xanh ngôi trường thân yêu.</h4>
              <h5>TPHCM</h5>
              <div className="destination__card__footer">
        
                <p>26-7-2022</p>
              </div>
            </div>
          </div>
          <div className="destination__card">
            <img src={banner5} alt="destination" />
            <div className="destination__card__content">
              <h4>Trường xanh – Nơi học sinh chung tay bảo vệ môi trường.</h4>
              <h5>Trường Tiểu Học Bù Nho</h5>
              <div className="destination__card__footer">
            
                <p>2-4-2024</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;