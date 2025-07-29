import React, { useEffect, useRef } from 'react';
import donate from '../assets/donate.jpg';
import { useNavigate } from 'react-router-dom';

const Donate = () => {
  const swiperRef = useRef(null);
  const swiperInstance = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      text: "Với mỗi khoản quyên góp, chúng ta có thể trồng thêm nhiều cây xanh và bảo vệ hệ sinh thái. Hãy chung tay vì một tương lai xanh hơn!",
      name: "Nguyễn Văn A",
      title: "Người ủng hộ"
    },
    {
      id: 2,
      text: "Quyên góp không chỉ là hành động, mà là lời cam kết bảo vệ môi trường cho thế hệ tương lai. Hãy cùng chúng tôi hành động hôm nay!",
      name: "Trần Thị B",
      title: "Người ủng hộ"
    },
    {
      id: 3,
      text: "Mỗi đóng góp nhỏ của bạn sẽ tạo nên sự khác biệt lớn cho thiên nhiên. Hãy tham gia cùng chúng tôi để cứu lấy hành tinh!",
      name: "Lê Văn C",
      title: "Người ủng hộ"
    }
  ];

  useEffect(() => {

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.css';
    document.head.appendChild(link);


    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/8.4.7/swiper-bundle.min.js';
    script.onload = () => {
      if (swiperRef.current && window.Swiper) {
        swiperInstance.current = new window.Swiper(swiperRef.current, {
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },
          effect: 'slide',
          speed: 500,
          allowTouchMove: true,
          grabCursor: true,
          touchRatio: 1,
          touchAngle: 45,
          threshold: 10,
        });
      }
    };
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (swiperInstance.current) {
        swiperInstance.current.destroy();
      }
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="section__container review__container" id="donate">
      <div className="review__image">
        <img src={donate} alt="donation" />
      </div>
      <div className="review__content">
        <h3 className="section__subheader">Quyên góp</h3>
        <h2 className="section__header">Hãy cùng chung tay góp sức cho môi trường</h2>

        <div className="swiper" ref={swiperRef}>
          <div className="swiper-wrapper">
            {slides.map((slide) => (
              <div key={slide.id} className="swiper-slide">
                <div className="review__card">
                  <span><i className="ri-hand-heart-line"></i></span>
                  <p className="section__description">
                    {slide.text}
                  </p>
                  <h4>{slide.name}</h4>
                  <h5>{slide.title}</h5>
                  <div>
                    <button className="btn" onClick={() => navigate('/donate')}>Quyên góp ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;