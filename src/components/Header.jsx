import React from 'react';
import Button from './Button';
import headerPic from '../assets/headerpic.png';
import plane from '../assets/plane.png';

const Header = () => {
  return (
    <header className="section__container header__container" id="home">
      <div className="header__image">
        <img src={headerPic} alt="header" />
      </div>
      <div className="header__content">
        <img src={plane} alt="green" />
        <h1>Trường sạch, tương lai sáng</h1>
        <p className="section__description">
          Một ngôi trường sạch sẽ, xanh mát là nền tảng để học sinh phát triển toàn diện cả về thể chất lẫn tinh thần. Website của chúng tôi là nơi kết nối cộng đồng học sinh, giáo viên và phụ huynh, cùng chung tay thực hiện các sáng kiến giữ gìn vệ sinh trường học. Từ các chiến dịch dọn dẹp, tái chế đến giáo dục ý thức môi trường, chúng tôi hướng tới một học đường trong lành, nơi mọi người đều tự hào.
        </p>
        <form action="/">
          <div className="input__group">
            <label for="location">
              <span><i className="ri-map-pin-line"></i></span> Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Mọi miền đất nước"
            />
          </div>
          <div className="input__group">
            <label for="date">
              <span><i className="ri-calendar-line"></i></span> Date
            </label>
            <input
              type="text"
              name="location"
              placeholder="Hành trình bắt đầu hôm nay"
            />
          </div>
          <button className="btn">
            <i className="ri-search-line"></i>
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;