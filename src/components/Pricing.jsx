import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlanSelect = (planId) => {
    if (isAuthenticated) {
      // If logged in, go to payment or course selection
      navigate(`/checkout/${planId}`);
    } else {
      // If not logged in, go to register
      navigate('/register');
    }
  };

  const pricingPlans = [
    {
      id: 1,
      name: "Gói Cơ Bản",
      price: "299,000",
      period: "tháng",
      popular: false,
      features: [
        "✅ Truy cập 100+ khóa học cơ bản",
        "✅ Video bài giảng HD",
        "✅ Tài liệu PDF tải về",
        "✅ Hỗ trợ qua email",
        "✅ Chứng chỉ hoàn thành"
      ],
      buttonText: "Bắt đầu học",
      color: "#6b7280"
    },
    {
      id: 2,
      name: "Gói Pro",
      price: "599,000", 
      period: "tháng",
      popular: true,
      features: [
        "✅ Truy cập TẤT CẢ khóa học",
        "✅ Lớp học trực tiếp với chuyên gia",
        "✅ Tương tác Q&A real-time",
        "✅ Hỗ trợ 24/7",
        "✅ Chứng chỉ quốc tế",
        "✅ Nhóm học tập riêng",
        "✅ Dự án thực tế"
      ],
      buttonText: "Chọn gói Pro",
      color: "var(--primary-color)"
    },
    {
      id: 3,
      name: "Gói Enterprise", 
      price: "1,299,000",
      period: "tháng",
      popular: false,
      features: [
        "✅ Tất cả tính năng Pro",
        "✅ Mentor cá nhân 1-1",
        "✅ Roadmap học tập cá nhân hóa",
        "✅ Ưu tiên hỗ trợ",
        "✅ Khóa học độc quyền",
        "✅ Networking events",
        "✅ Career coaching",
        "✅ Job placement support"
      ],
      buttonText: "Liên hệ tư vấn",
      color: "#f59e0b"
    }
  ];

  return (
    <section className="section__container" id="pricing" style={{backgroundColor: 'var(--extra-light)'}}>
      <div style={{textAlign: 'center', marginBottom: '4rem'}}>
        <h3 className="section__subheader">Bảng giá</h3>
        <h2 className="section__header">Chọn gói học phù hợp với <span style={{color: 'var(--primary-color)'}}>mục tiêu</span> của bạn</h2>
        <p className="section__description" style={{maxWidth: '600px', margin: '0 auto'}}>
          Các gói học được thiết kế linh hoạt, phù hợp với mọi nhu cầu từ người mới bắt đầu đến chuyên gia
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '1.5rem',
              padding: '2.5rem 2rem',
              boxShadow: plan.popular 
                ? '0 20px 40px rgba(1, 187, 191, 0.15)' 
                : '0 10px 30px rgba(0,0,0,0.1)',
              border: plan.popular ? '3px solid var(--primary-color)' : '1px solid #e5e7eb',
              position: 'relative',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            className="pricing-card"
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '0.5rem 2rem',
                borderRadius: '2rem',
                fontSize: '0.9rem',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(1, 187, 191, 0.3)'
              }}>
                🔥 PHỔ BIẾN NHẤT
              </div>
            )}

            {/* Plan Name */}
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--text-dark)',
                marginBottom: '0.5rem'
              }}>
                {plan.name}
              </h3>
              
              {/* Price */}
              <div style={{marginBottom: '1rem'}}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: '800',
                  color: plan.color
                }}>
                  {plan.price.toLocaleString()}₫
                </span>
                <span style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-light)',
                  marginLeft: '0.5rem'
                }}>
                  /{plan.period}
                </span>
              </div>
            </div>

            {/* Features */}
            <div style={{marginBottom: '2.5rem'}}>
              {plan.features.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  color: 'var(--text-medium)'
                }}>
                  <span style={{marginRight: '0.5rem'}}>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button 
              className="btn"
              onClick={() => handlePlanSelect(plan.id)}
              style={{
                width: '100%',
                backgroundColor: plan.popular ? 'var(--primary-color)' : plan.color,
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: plan.popular 
                  ? '0 8px 25px rgba(1, 187, 191, 0.4)' 
                  : '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Money Back Guarantee */}
      <div style={{
        textAlign: 'center', 
        marginTop: '4rem',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '4rem auto 0'
      }}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🛡️</div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--text-dark)',
          marginBottom: '1rem'
        }}>
          Đảm bảo hoàn tiền 100%
        </h3>
        <p style={{
          color: 'var(--text-light)',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Nếu không hài lòng với khóa học trong 30 ngày đầu, chúng tôi sẽ hoàn lại 100% số tiền. 
          Không câu hỏi, không điều kiện ràng buộc.
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📞</div>
            <div style={{fontWeight: '600', color: 'var(--text-dark)'}}>Hỗ trợ 24/7</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎓</div>
            <div style={{fontWeight: '600', color: 'var(--text-dark)'}}>50,000+ Học viên</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⭐</div>
            <div style={{fontWeight: '600', color: 'var(--text-dark)'}}>4.9/5 Đánh giá</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;