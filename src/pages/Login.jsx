import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make actual API call to your backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const userData = await response.json();
      
      // Simulate successful login with SQL structure
      const mockUserData = {
        UserID: 1,
        FullName: 'Học viên HUTECH',
        Email: formData.email,
        Role: 'customer',
        IsGuest: false,
        CreatedAt: new Date().toISOString()
      };
      
      // Use AuthContext login function
      // login(userData); // You would use this with real API data
      
      localStorage.setItem('user', JSON.stringify(mockUserData));
      
      navigate('/');
    } catch (error) {
      setErrors({ general: 'Đăng nhập thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--primary-color) 0%, #1d4ed8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        padding: '3rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '450px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            marginBottom: '2rem'
          }}>
            <img 
              src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-03.png" 
              alt="HUTECH Logo" 
              style={{ height: '40px', objectFit: 'contain' }}
            />
           
          </Link>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-dark)',
            marginBottom: '0.5rem'
          }}>
            Đăng nhập
          </h2>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1rem'
          }}>
            Chào mừng bạn quay trở lại!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}>
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              style={{
                width: '100%',
                padding: '1rem',
                border: errors.email ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = 'var(--primary-color)';
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.target.style.borderColor = '#e5e7eb';
                }
              }}
            />
            {errors.email && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              style={{
                width: '100%',
                padding: '1rem',
                border: errors.password ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = 'var(--primary-color)';
                }
              }}
              onBlur={(e) => {
                if (!errors.password) {
                  e.target.style.borderColor = '#e5e7eb';
                }
              }}
            />
            {errors.password && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div style={{
            textAlign: 'right',
            marginBottom: '2rem'
          }}>
            <Link to="/forgot-password" style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: isLoading ? '#9ca3af' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Đang xử lý...
              </>
            ) : (
              <>
                🚀 Đăng nhập
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '0.95rem'
          }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
