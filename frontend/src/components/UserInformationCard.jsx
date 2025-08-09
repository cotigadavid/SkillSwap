import came from '../assets/came.jpeg';

const UserInformationCard = ({ user }) => {
    return (
        <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Information</h3>
            <div className="space-y-2 mb-6">
                <p className="text-gray-700"><span className="font-medium">Phone Number:</span> {user.phone_number}</p>
                <p className="text-gray-700"><span className="font-medium">Age:</span> {user.age}</p>
                <p className="text-gray-700"><span className="font-medium">City:</span> {user.residing_city}</p>
                <p className="text-gray-700"><span className="font-medium">County:</span> {user.residing_county}</p>
            </div>
            
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.skills && user.skills.map(skill => (
                    <div
                        key={skill.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-300 rounded"
                    >
                        <img
                            src={skill.skill_picture}
                            width="40"
                            height="40"
                            alt="Skill"
                            className="rounded border border-gray-300"
                        />
                        <div>
                            <p className="font-medium text-gray-800">{skill.title}</p>
                            <p className="text-sm text-gray-500">Difficulty: {skill.difficulty}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserInformationCard;