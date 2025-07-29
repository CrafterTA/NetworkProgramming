import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAuthAction = () => {
    if (isAuthenticated()) {
      logout()
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="nav__header">
        <div className="nav__logo">
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}>
            <img 
              src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-03.png" 
              alt="HUTECH Logo" 
              className="nav__logo-img"
            />
            <span className="nav__brand-text">
              HUTECH
            </span>
          </Link>
        </div>
        <div className="nav__menu__btn" id="menu-btn" onClick={toggleMenu}>
          <i className={`ri-${isMenuOpen ? 'close' : 'menu-3'}-line`}></i>
        </div>
      </div>
      <ul className={`nav__links ${isMenuOpen ? 'nav__links--open' : ''}`} id="nav-links">
        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link></li>
        <li><Link to="/courses" onClick={() => setIsMenuOpen(false)}>Khóa học</Link></li>
        <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog học tập</Link></li>
        <li><a href="#about" onClick={() => setIsMenuOpen(false)}>Về chúng tôi</a></li>
        <li><Link to="/instructors" onClick={() => setIsMenuOpen(false)}>Giảng viên</Link></li>
        {isAuthenticated() && (
          <li>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-dark)',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}>
              👋 Xin chào, {user?.FullName || 'Học viên'}
            </span>
          </li>
        )}
        <li>
          <button 
            className="btn nav__auth-btn" 
            onClick={() => {
              handleAuthAction()
              setIsMenuOpen(false)
            }}
          >
            {isAuthenticated() ? (
              <>
                🚪 Đăng xuất
              </>
            ) : (
              <>
                🚀 Đăng nhập
                <span><i className="ri-arrow-right-line"></i></span>
              </>
            )}
          </button>
        </li>
        {!isAuthenticated() && (
          <li>
            <button 
              className="btn nav__register-btn" 
              onClick={() => {
                navigate('/register')
                setIsMenuOpen(false)
              }}
            >
              🎓 Đăng ký
            </button>
          </li>
        )}
      </ul>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid transparent;
        }

        .navbar--scrolled {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .navbar--scrolled .nav__header {
          padding: 0.75rem 1.5rem;
        }

        .navbar--scrolled .nav__logo-img {
          max-height: 35px;
        }

        .navbar--scrolled .nav__brand-text {
          font-size: 1.2rem;
        }

        .nav__header {
          padding: 1rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s ease;
        }

        .nav__logo-img {
          max-width: 100px;
          height: auto;
          max-height: 40px;
          object-fit: contain;
          transition: all 0.3s ease;
        }

        .nav__brand-text {
          fontSize: 1.3rem;
          fontWeight: 700;
          color: var(--text-dark);
          letterSpacing: 0.5px;
          transition: all 0.3s ease;
        }

        .nav__menu__btn {
          font-size: 1.75rem;
          color: var(--text-dark);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          display: none;
        }

        .nav__menu__btn:hover {
          background: rgba(59, 130, 246, 0.1);
          color: var(--primary-color);
        }

        .nav__links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav__links li {
          display: flex;
          align-items: center;
        }

        .nav__links a {
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-dark);
          text-decoration: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav__links a::after {
          content: '';
          position: absolute;
          bottom: 0.25rem;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--primary-color);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav__links a:hover::after {
          width: 60%;
        }

        .nav__links a:hover {
          color: var(--primary-color);
          background: rgba(59, 130, 246, 0.05);
        }

        .nav__auth-btn {
          background: linear-gradient(135deg, var(--primary-color) 0%, #1d4ed8 100%) !important;
          border: none !important;
          padding: 0.6rem 1.2rem !important;
          border-radius: 0.6rem !important;
          color: white !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
        }

        .nav__auth-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .nav__register-btn {
          background: transparent !important;
          border: 2px solid var(--primary-color) !important;
          color: var(--primary-color) !important;
          padding: 0.6rem 1.2rem !important;
          border-radius: 0.6rem !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
        }

        .nav__register-btn:hover {
          background: var(--primary-color) !important;
          color: white !important;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .nav__menu__btn {
            display: block;
          }

          .nav__links {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1.5rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-top: 1px solid rgba(59, 130, 246, 0.1);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }

          .nav__links--open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav__links li {
            width: 100%;
            justify-content: center;
          }

          .nav__links a {
            width: 100%;
            text-align: center;
            padding: 1rem;
            font-size: 1.1rem;
          }

          .nav__auth-btn, .nav__register-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 1rem 2rem !important;
            font-size: 1.1rem !important;
          }
        }

        @media (min-width: 769px) {
          .nav__menu__btn {
            display: none;
          }

          .nav__links {
            position: static;
            background: transparent;
            flex-direction: row;
            padding: 0;
            gap: 2rem;
            transform: none;
            opacity: 1;
            visibility: visible;
            border: none;
            box-shadow: none;
          }

          .nav__links li {
            width: auto;
          }

          .nav__links a {
            width: auto;
            text-align: left;
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }

          .nav__auth-btn, .nav__register-btn {
            width: auto !important;
            padding: 0.6rem 1.2rem !important;
            font-size: 0.9rem !important;
          }
        }

        @media (max-width: 480px) {
          .nav__header {
            padding: 0.75rem;
          }

          .navbar--scrolled .nav__header {
            padding: 0.5rem 0.75rem;
          }

          .nav__brand-text {
            font-size: 1.2rem;
          }

          .navbar--scrolled .nav__brand-text {
            font-size: 1.1rem;
          }

          .nav__logo-img {
            max-height: 35px;
          }

          .navbar--scrolled .nav__logo-img {
            max-height: 30px;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar