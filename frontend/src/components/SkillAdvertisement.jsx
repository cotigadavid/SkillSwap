import React from "react";
import '../styling/SkillAdvertisement.css';
import star from '../assets/star.png';

function SkillAdvertisement({adImage, photo, name, category, description, rating, numberReview}) {
    return (
        <div className="post">
            <img src={adImage} alt="Ad" className="ad-image" />
            <img src={photo} className="photo"></img>
            <h3 className="name">{name}</h3>
            <p className="category">{category}</p>
            <p className="description">{description}</p>
            <div className="rating">
                <img src={star} alt="Star" className="star" />
                <span>{rating}</span>
                <span className="number-reviews">({numberReview})</span>
            </div>
        </div>
    );
}

export default SkillAdvertisement;