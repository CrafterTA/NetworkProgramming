import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--extra-light)'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1rem'
          }}>
            Đang kiểm tra đăng nhập...
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.Role)) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--extra-light)',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{
              fontSize: '4rem',
              color: '#ef4444',
              marginBottom: '1rem'
            }}>
              🚫
            </div>
            <h2 style={{
              color: 'var(--text-dark)',
              marginBottom: '1rem',
              fontSize: '1.5rem'
            }}>
              Không có quyền truy cập
            </h2>
            <p style={{
              color: 'var(--text-light)',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cần trợ giúp.
            </p>
            <button
              onClick={() => window.history.back()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Quay lại
            </button>
          </div>
        </div>
      );
    }
  }

  // Render protected component if authenticated
  return children;
};

export default ProtectedRoute;
