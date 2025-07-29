import React from 'react'
import logo from '../assets/logo_gr.png'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav>
      <div className="nav__header">
        <div className="nav__logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="nav__menu__btn" id="menu-btn">
          <i className="ri-menu-3-line"></i>
        </div>
      </div>
      <ul className="nav__links" id="nav-links">
        <li><Link to="/">Trang chủ</Link></li>
        <li><Link to="/blog">Blog cộng đồng</Link></li>
        <li><a href="#mission">Nhiệm vụ xanh</a></li>
        <li><Link to="/honor">Bảng vinh danh</Link></li>
        <li>
          <button className="btn" onClick={() => navigate('/donate')}>
            Quyên góp cho cộng đồng
            <span><i className="ri-arrow-right-long-line"></i></span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar