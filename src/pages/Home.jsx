import React, { useEffect } from 'react';

import Navbar from '../components/Navbar';
import Header from '../components/Header';
import About from '../components/Story';
import Mission from '../components/Mission';
import Destination from '../components/About';
import Donate from '../components/Donate';
import BannerGallery from '../components/BannerGallery';



const Home = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Header />
      <About />
      <Mission />
      <Destination />
      <Donate />
      <BannerGallery />
      
    </>
  );
};

export default Home;