import React, { useState, useEffect } from "react";
import SkillAdvertisement from "./SkillAdvertisement";
import { Link } from 'react-router-dom';
import profilePic from '../assets/profile.jpg';
import '../styling/SkillList.css';



function SkillList() {

    const [skills, setSkills] = useState([]);

    useEffect(() => {
      const fetchSkills = async () => {
        const response = await fetch('http://localhost:8000/api/skills-public/');
        const data = await response.json();
        setSkills(data);
      };

      fetchSkills();
    }, []);
  
    return (
        <div>
            <h2>Lista anunturi:</h2>
                {skills.map(item => (
                    <Link key={item.id} to={`/skills/${item.id}`}>
                        <SkillAdvertisement
                            adImage={item.user.profile}
                            photo={item.user.profile}
                            name={item.user.name}
                            category={item.title}
                            description={null}
                            rating={null}
                            numberReview={null}
                        />
                    </Link>
                ))}
            
        </div>
    )
}

export default SkillList;