import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // Default role
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng';
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make actual API call to your backend
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     FullName: formData.fullName,
      //     Email: formData.email,
      //     PasswordHash: formData.password, // Should be hashed on backend
      //     Role: formData.role,
      //     IsGuest: false
      //   })
      // });
      // const userData = await response.json();
      
      // Simulate successful registration with SQL structure
      const mockUserData = {
        UserID: Math.floor(Math.random() * 1000), // Mock ID
        FullName: formData.fullName,
        Email: formData.email,
        Role: formData.role,
        IsGuest: false,
        CreatedAt: new Date().toISOString()
      };
      
      // Use AuthContext login function
      // login(userData); // You would use this with real API data
      
      localStorage.setItem('user', JSON.stringify(mockUserData));
      
      navigate('/');
    } catch (error) {
      setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
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
        maxWidth: '500px'
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
            Đăng ký tài khoản
          </h2>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1rem'
          }}>
            Tham gia cùng hàng nghìn học viên HUTECH
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

          {/* Full Name Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nhập họ và tên đầy đủ"
              style={{
                width: '100%',
                padding: '1rem',
                border: errors.fullName ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
            {errors.fullName && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {errors.fullName}
              </p>
            )}
          </div>

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

          {/* Phone Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              style={{
                width: '100%',
                padding: '1rem',
                border: errors.phone ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
            {errors.phone && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
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
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
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

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--text-dark)'
            }}>
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              style={{
                width: '100%',
                padding: '1rem',
                border: errors.confirmPassword ? '2px solid #dc2626' : '2px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
            {errors.confirmPassword && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{
                  marginTop: '0.25rem',
                  transform: 'scale(1.2)'
                }}
              />
              <span style={{
                fontSize: '0.9rem',
                color: 'var(--text-light)',
                lineHeight: '1.5'
              }}>
                Tôi đồng ý với{' '}
                <Link to="/terms" style={{
                  color: 'var(--primary-color)',
                  textDecoration: 'none'
                }}>
                  Điều khoản sử dụng
                </Link>
                {' '}và{' '}
                <Link to="/privacy" style={{
                  color: 'var(--primary-color)',
                  textDecoration: 'none'
                }}>
                  Chính sách bảo mật
                </Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p style={{
                color: '#dc2626',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                {errors.agreeTerms}
              </p>
            )}
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
                🎓 Tạo tài khoản
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
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
            Đã có tài khoản?{' '}
            <Link to="/login" style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Đăng nhập ngay
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

export default Register;
