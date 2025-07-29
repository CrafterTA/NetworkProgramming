import React from 'react';
import { useNavigate } from 'react-router-dom';
import plantImg from '../assets/plant.jpg';
import recycleImg from '../assets/recycle.jpg';
import schoolCleanImg from '../assets/schoolclean.jpg';
import eduImg from '../assets/edu.jpg';

const missions = [
  { id: 1, img: plantImg, title: 'Trồng cây xanh', activities: '15 Hoạt động+' },
  { id: 2, img: recycleImg, title: 'Tái chế rác thải', activities: '10 Hoạt động+' },
  { id: 3, img: schoolCleanImg, title: 'Vệ sinh trường học', activities: '18 Hoạt động+' },
  { id: 4, img: eduImg, title: 'Giáo dục môi trường', activities: '12 Hoạt động+' },
];

const Mission = () => {
  const navigate = useNavigate();

  return (
    <section className="section__container tour__container expanded-tour__container" id="mission">
      <h3 className="section__subheader">Nhiệm vụ xanh</h3>
      <h2 className="section__header">Hãy cùng thực hiện những "nhiệm vụ" vì môi trường</h2>
      <div className="tour__grid expanded-tour__grid">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="tour__card expanded-tour__card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/mission/${mission.id}`)}
          >
            <img src={mission.img} alt="mission" />
            <h4>{mission.title}</h4>
            <p>{mission.activities}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Mission;