import star from '../assets/star.png';

function SkillAdvertisement({skill}) {
    return (
    <div className="bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
        className="w-16 h-16 rounded-full object-cover border border-gray-300"
        src={skill.user.profile}
        alt="Profile"
        loading="lazy"
        />
        <img
        className="w-24 h-24 object-cover rounded border border-gray-300"
        src={skill.skill_picture}
        alt="Skill"
        loading="lazy"
        />
        <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{skill.user.name}</p>
        <p className="text-md text-gray-600">{skill.title}</p>
        <div className="flex items-center gap-1 mt-1">
            <img className="w-5 h-5" src={star} alt="Star" loading="lazy"/>
            {/* <span>{skill.reviews.rating}</span>
            <span className="text-sm text-gray-500">({skill.reviews.count})</span> */}
        </div>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3">{skill.description}</p>
        <p className="text-sm text-gray-500">{skill.user.location}</p>
        </div>
    </div>
    );
}
export default SkillAdvertisement;