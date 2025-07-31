import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import Services from '../components/Services';
import Pricing from '../components/Pricing';
import BannerGallery from '../components/BannerGallery';
import ChatWidget from '../components/chat/ChatWidget';



const Home = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Hero />
      <Testimonials />
      <Features />
      <Services />
      <Pricing />
      <BannerGallery />
      <ChatWidget />
    </>
  );
};

export default Home;