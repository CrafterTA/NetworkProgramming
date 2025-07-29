import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Main Footer Content */}
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__brand">
            <div className="footer__logo">
              <img 
                src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-03.png" 
                alt="HUTECH Logo"
                className="footer__logo-img"
              />
              <h3 className="footer__brand-name">HUTECH Education</h3>
            </div>
            <p className="footer__description">
              Nền tảng học tập trực tuyến tiên tiến của Đại học Công nghệ TP.HCM. 
              Mang đến trải nghiệm học tập chất lượng cao với công nghệ hiện đại.
            </p>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <i className="ri-map-pin-line"></i>
                <span>475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM</span>
              </div>
              <div className="footer__contact-item">
                <i className="ri-phone-line"></i>
                <span>(028) 5445 7777</span>
              </div>
              <div className="footer__contact-item">
                <i className="ri-mail-line"></i>
                <span>info@hutech.edu.vn</span>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Khóa học phổ biến</h4>
            <ul className="footer__links">
              <li><Link to="/courses/programming">Lập trình Web</Link></li>
              <li><Link to="/courses/design">Thiết kế đồ họa</Link></li>
              <li><Link to="/courses/marketing">Digital Marketing</Link></li>
              <li><Link to="/courses/data">Khoa học dữ liệu</Link></li>
              <li><Link to="/courses/ai">Trí tuệ nhân tạo</Link></li>
              <li><Link to="/courses/mobile">Phát triển mobile</Link></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Liên kết nhanh</h4>
            <ul className="footer__links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/about">Giới thiệu</Link></li>
              <li><Link to="/courses">Khóa học</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/instructors">Giảng viên</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer__section">
            <h4 className="footer__section-title">Hỗ trợ</h4>
            <ul className="footer__links">
              <li><Link to="/help">Trung tâm trợ giúp</Link></li>
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/terms">Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy">Chính sách bảo mật</Link></li>
              <li><Link to="/refund">Chính sách hoàn tiền</Link></li>
              <li><Link to="/certificate">Chứng chỉ</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer__section footer__newsletter">
            <h4 className="footer__section-title">Đăng ký nhận tin</h4>
            <p className="footer__newsletter-text">
              Nhận thông tin về khóa học mới, ưu đãi đặc biệt và tips học tập hữu ích
            </p>
            <form className="footer__newsletter-form">
              <div className="footer__input-group">
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn"
                  className="footer__input"
                />
                <button type="submit" className="footer__submit-btn">
                  <i className="ri-send-plane-line"></i>
                </button>
              </div>
            </form>
            <div className="footer__social">
              <h5 className="footer__social-title">Theo dõi chúng tôi</h5>
              <div className="footer__social-links">
                <a href="https://facebook.com/hutech.edu.vn" target="_blank" rel="noopener noreferrer">
                  <i className="ri-facebook-fill"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-youtube-fill"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-instagram-line"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-linkedin-fill"></i>
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-twitter-fill"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © 2025 HUTECH Education Platform. Designed with ❤️ for better learning experience.
            </p>
            <div className="footer__bottom-links">
              <Link to="/sitemap">Sơ đồ trang web</Link>
              <Link to="/accessibility">Trợ năng</Link>
              <Link to="/careers">Tuyển dụng</Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        }

        .footer__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer__content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
          gap: 3rem;
          padding: 4rem 0 3rem;
        }

        .footer__brand {
          max-width: 350px;
        }

        .footer__logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .footer__logo-img {
          height: 45px;
          width: auto;
          object-fit: contain;
        }

        .footer__brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.5px;
        }

        .footer__description {
          color: #cbd5e1;
          line-height: 1.7;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .footer__contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer__contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .footer__contact-item i {
          color: #3b82f6;
          font-size: 1.1rem;
          width: 20px;
          flex-shrink: 0;
        }

        .footer__section-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .footer__section-title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 30px;
          height: 2px;
          background: #3b82f6;
          border-radius: 1px;
        }

        .footer__links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer__links a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          position: relative;
          padding-left: 1rem;
        }

        .footer__links a::before {
          content: '→';
          position: absolute;
          left: 0;
          opacity: 0;
          transition: all 0.3s ease;
          color: #3b82f6;
        }

        .footer__links a:hover {
          color: #3b82f6;
          padding-left: 1.5rem;
        }

        .footer__links a:hover::before {
          opacity: 1;
        }

        .footer__newsletter {
          max-width: 280px;
        }

        .footer__newsletter-text {
          color: #cbd5e1;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .footer__input-group {
          display: flex;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .footer__input-group:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .footer__input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
        }

        .footer__input::placeholder {
          color: #94a3b8;
        }

        .footer__submit-btn {
          padding: 0.75rem 1rem;
          background: #3b82f6;
          border: none;
          color: white;
          cursor: pointer;
          transition: background 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer__submit-btn:hover {
          background: #2563eb;
        }

        .footer__social-title {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .footer__social-links {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .footer__social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          border-radius: 50%;
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer__social-links a:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .footer__bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 0;
        }

        .footer__bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer__copyright {
          color: #94a3b8;
          font-size: 0.9rem;
          margin: 0;
        }

        .footer__bottom-links {
          display: flex;
          gap: 2rem;
        }

        .footer__bottom-links a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }

        .footer__bottom-links a:hover {
          color: #3b82f6;
        }

        @media (max-width: 1024px) {
          .footer__content {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .footer__content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          
          .footer__brand {
            grid-column: 1 / -1;
            max-width: none;
          }
        }

        @media (max-width: 480px) {
          .footer__content {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 3rem 0 2rem;
          }
          
          .footer__container {
            padding: 0 1rem;
          }
          
          .footer__bottom-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
