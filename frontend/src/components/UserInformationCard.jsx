import came from '../assets/came.jpeg';

const UserInformationCard = ({ user }) => {

    return (
        <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Your Information</h3>
            <p className="mb-1"><span className="font-medium">Phone Number:</span> {user.phone_number}</p>
            <p className="mb-1"><span className="font-medium">Age:</span> {user.age}</p>
            <p className="mb-1"><span className="font-medium">City:</span> {user.residing_city}</p>
            <p className="mb-4"><span className="font-medium">County:</span> {user.residing_county}</p>

            <h3 className="text-xl font-semibold mb-3">Skills</h3>
            <ul className="grid grid-cols-2 gap-3">
                {user.skills && user.skills.map(skill => (
                    <li
                        key={skill.id}
                        className="flex items-center gap-3 p-2 bg-white border rounded shadow-sm"
                    >
                        <img
                            src={skill.skill_picture}
                            width="40"
                            height="40"
                            alt="Skill"
                            className="rounded"
                        />
                        <div>
                            <p className="font-medium">{skill.title}</p>
                            <p className="text-sm text-gray-500">Difficulty: {skill.difficulty}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default UserInformationCard;