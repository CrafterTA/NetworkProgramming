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
    <>
      <nav className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img 
              src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-03.png" 
              alt="HUTECH Logo" 
              className="brand-logo"
            />
            <span className="brand-text">HUTECH</span>
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link to="/" className="nav-item">Trang chủ</Link>
            <Link to="/courses" className="nav-item">Khóa học</Link>
            <Link to="/blog" className="nav-item">Blog học tập</Link>
            <a href="#about" className="nav-item">Về chúng tôi</a>
            <Link to="/instructors" className="nav-item">Giảng viên</Link>
          </div>

          {/* Auth Buttons */}
          <div className="navbar-auth">
            {isAuthenticated() && (
              <span className="user-greeting">
                👋 {user?.FullName || 'Học viên'}
              </span>
            )}
            
            <button className="auth-btn primary" onClick={handleAuthAction}>
              {isAuthenticated() ? '🚪 Đăng xuất' : '🚀 Đăng nhập'}
            </button>
            
            {!isAuthenticated() && (
              <button className="auth-btn secondary" onClick={() => navigate('/register')}>
                🎓 Đăng ký
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <i className={`ri-${isMenuOpen ? 'close' : 'menu-3'}-line`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            Trang chủ
          </Link>
          <Link to="/courses" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            Khóa học
          </Link>
          <Link to="/blog" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            Blog học tập
          </Link>
          <a href="#about" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            Về chúng tôi
          </a>
          <Link to="/instructors" className="mobile-nav-item" onClick={() => setIsMenuOpen(false)}>
            Giảng viên
          </Link>
          
          <div className="mobile-auth">
            {isAuthenticated() && (
              <span className="mobile-user-greeting">
                👋 Xin chào, {user?.FullName || 'Học viên'}
              </span>
            )}
            
            <button 
              className="mobile-auth-btn primary" 
              onClick={() => {
                handleAuthAction()
                setIsMenuOpen(false)
              }}
            >
              {isAuthenticated() ? '🚪 Đăng xuất' : '🚀 Đăng nhập'}
            </button>
            
            {!isAuthenticated() && (
              <button 
                className="mobile-auth-btn secondary" 
                onClick={() => {
                  navigate('/register')
                  setIsMenuOpen(false)
                }}
              >
                🎓 Đăng ký
              </button>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        .modern-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .modern-navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(1, 187, 191, 0.2);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modern-navbar.scrolled .navbar-container {
          height: 60px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .brand-logo {
          height: 40px;
          width: auto;
          object-fit: contain;
          transition: all 0.3s ease;
        }

        .modern-navbar.scrolled .brand-logo {
          height: 35px;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-dark);
          transition: all 0.3s ease;
        }

        .modern-navbar.scrolled .brand-text {
          font-size: 1.3rem;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-item {
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-item:hover {
          color: var(--primary-color);
          background: rgba(1, 187, 191, 0.1);
        }

        .navbar-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-greeting {
          color: var(--text-dark);
          font-weight: 600;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .auth-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          white-space: nowrap;
        }

        .auth-btn.primary {
          background: var(--primary-color);
          color: white;
        }

        .auth-btn.primary:hover {
          background: #019a9e;
          transform: translateY(-1px);
        }

        .auth-btn.secondary {
          background: transparent;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }

        .auth-btn.secondary:hover {
          background: var(--primary-color);
          color: white;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-dark);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: rgba(1, 187, 191, 0.1);
          color: var(--primary-color);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 1.5rem 2rem;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu.open {
          display: block;
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .mobile-nav-item {
          display: block;
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 500;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .mobile-nav-item:hover {
          color: var(--primary-color);
          padding-left: 1rem;
        }

        .mobile-auth {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          margin-top: 1rem;
        }

        .mobile-user-greeting {
          display: block;
          color: var(--text-dark);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .mobile-auth-btn {
          display: block;
          width: 100%;
          padding: 1rem;
          margin-bottom: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .mobile-auth-btn.primary {
          background: var(--primary-color);
          color: white;
        }

        .mobile-auth-btn.secondary {
          background: transparent;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .navbar-menu,
          .navbar-auth {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .mobile-menu {
            display: block;
          }
        }

        @media (max-width: 480px) {
          .brand-text {
            font-size: 1.3rem;
          }

          .modern-navbar.scrolled .brand-text {
            font-size: 1.2rem;
          }

          .brand-logo {
            height: 35px;
          }

          .modern-navbar.scrolled .brand-logo {
            height: 30px;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar
