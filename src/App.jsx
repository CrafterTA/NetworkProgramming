import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AgentChat from './pages/AgentChat';
import TestChat from './pages/TestChat';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/chat/ChatWidget';



function App() {
  const location = useLocation();
  
  // Check if current route is agent route
  const isAgentRoute = location.pathname.startsWith('/agent');
  
  useEffect(() => {
    // Khởi tạo ScrollReveal
    if (window.ScrollReveal) {
      ScrollReveal().reveal('.section__container', {
        duration: 1000,
        distance: '50px',
        easing: 'ease-in-out',
        origin: 'bottom',
        delay: 200
      });
      ScrollReveal().reveal('.header__image', { origin: 'left', distance: '100px' });
      ScrollReveal().reveal('.header__content', { origin: 'right', distance: '100px' });
      ScrollReveal().reveal('.about__image', { origin: 'left', distance: '100px' });
      ScrollReveal().reveal('.about__content', { origin: 'right', distance: '100px' });
      ScrollReveal().reveal('.tour__card', { interval: 200, origin: 'bottom' });
      ScrollReveal().reveal('.destination__card', { interval: 200, origin: 'bottom' });
      ScrollReveal().reveal('.review__card', { interval: 200, origin: 'bottom' });
      ScrollReveal().reveal('.blog__card', { interval: 200, origin: 'bottom' });
    }

    // Khởi tạo Swiper
    if (window.Swiper) {
      new window.Swiper('.swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        },
      });
    }



  }, []);

  return (
    <AuthProvider>
      <ChatProvider>
        {/* Only show Navbar for non-agent routes */}
        {!isAgentRoute && <Navbar />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test-chat" element={<TestChat />} />
          
          {/* Agent Chat Route - Protected for agents/admins only */}
          <Route path="/agent/chat" element={
            <ProtectedRoute allowedRoles={['agent', 'admin']}>
              <AgentChat />
            </ProtectedRoute>
          } />
          
          {/* Protected routes example - uncomment when you have courses page */}
          {/* <Route path="/courses" element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } /> */}
        </Routes>
       
        {/* Only show Footer and ChatWidget for non-agent routes */}
        {!isAgentRoute && <Footer />}
        {!isAgentRoute && <ChatWidget />}
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;