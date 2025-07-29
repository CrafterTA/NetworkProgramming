import React from 'react';
import logo from '../assets/logo_gr.png';

const Footer = () => {
  return (
        <footer id="contact">
      <div class="section__container footer__container">
        <div class="footer__logo">
          <img src={logo} alt="logo" />
        </div>
        <ul class="footer__links">
          <li><a href="#home">Trang chủ</a></li>
          <li><a href="#about">Về chúng tôi</a></li>
          <li><a href="#mission">Nhiệm vụ xanh</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#donate">Quyên góp</a></li>
        </ul>
        <ul class="footer__socials">
          <li>
            <a href="#"><i class="ri-facebook-fill"></i></a>
          </li>
          <li>
            <a href="#"><i class="ri-twitter-fill"></i></a>
          </li>
          <li>
            <a href="#"><i class="ri-instagram-line"></i></a>
          </li>
          <li>
            <a href="#"><i class="ri-linkedin-fill"></i></a>
          </li>
        </ul>
      </div>
      <div class="footer__bar">
        Copyright © 2025 Broccoli. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;