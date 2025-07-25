import React from "react"
import SkillAdvertisement from "./SkillAdvertisement"
import profilePic from '../assets/profile.jpg'
import '../styling/SkillList.css'

const skills = [
  {
    id: 1,
    adImage: profilePic,
    photo: profilePic,
    name: "Mihai Gheorghe",
    category: "Chitara",
    description: "Te invat sa canti la chitara de la 0! Am 24 de ani de experienta in chitara si am cantat in diverse trupe.",
    rating: 3.7,
    numberReview: 11,
  },
  {
    id: 2,
    adImage: profilePic,
    photo: profilePic,
    name: "Ana Popescu",
    category: "Pian",
    description: "Lectii de pian pentru incepatori si avansati. Experienta de 15 ani in predare.",
    rating: 4.5,
    numberReview: 23,
  },
  {
    id: 3,
    adImage: profilePic,
    photo: profilePic,
    name: "Ion Ionescu",
    category: "Vioara",
    description: "Te invat sa canti la vioara cu tehnici avansate. Experienta de 10 ani in orchestra.",
    rating: 4.8,
    numberReview: 18,
  },
  {
    id: 4,
    adImage: profilePic,
    photo: profilePic,
    name: "Maria Georgescu",
    category: "Canto",
    description: "Lectii de canto pentru toate varstele. Experienta de 20 de ani in muzica.",
    rating: 4.2,
    numberReview: 30,
  }
];

function SkillList() {
    return (
        <div>
            <h2>Lista anunturi:</h2>
            {skills.map(item => (
                <SkillAdvertisement
                    key={item.id}
                    adImage={item.adImage}
                    photo={item.photo}
                    name={item.name}
                    category={item.category}
                    description={item.description}
                    rating={item.rating}
                    numberReview={item.numberReview}
                />
            ))}
        </div>
    )
}

export default SkillList;