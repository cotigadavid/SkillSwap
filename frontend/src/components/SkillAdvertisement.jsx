//import '../styling/SkillAdvertisement.css';
import star from '../assets/star.png';

function SkillAdvertisement({skill}) {
    return (
        <div className="post">
            <img src={skill.skill_picture} alt="Ad" className="ad-image" />
            <img src={skill.user.profile} className="photo"></img>
            <h3 className="name">{skill.user.name}</h3>
            <p className="category">{skill.title}</p>
            <p className="description">{skill.description}</p>
            <div className="rating">
                <img src={star} alt="Star" className="star" />
                <span>{skill.reviews.rating}</span>
                <span className="number-reviews">({skill.reviews.count})</span>
            </div>
        </div>
    );
}

export default SkillAdvertisement;