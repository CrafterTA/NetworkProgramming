import React from 'react';
import banner1 from '../assets/banner-1.jpg';
import banner2 from '../assets/banner-2.jpg';
import banner3 from '../assets/banner-3.jpg';
import banner4 from '../assets/banner-4.jpg';
import banner5 from '../assets/banner-5.jpg';
import banner6 from '../assets/banner-6.jpg';
import banner7 from '../assets/banner-7.jpg';
import banner8 from '../assets/banner-8.jpg';



const BannerGallery = () => {
  return (
    <section className="banner">
      <div className="banner__wrapper">
        <img src={banner1} alt="banner" />
        <img src={banner2} alt="banner" />
        <img src={banner3} alt="banner" />
        <img src={banner4} alt="banner" />
        <img src={banner5} alt="banner" />
        <img src={banner6} alt="banner" />
        <img src={banner7} alt="banner" />
        <img src={banner8} alt="banner" />
      </div>
    </section>
  );
};

export default BannerGallery;