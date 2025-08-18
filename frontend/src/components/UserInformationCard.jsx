const UserInformationCard = ({ user, isOwnProfile = true }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-[6px] p-6 w-full max-w-lg mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {isOwnProfile ? "Your Information" : `${user.first_name} ${user.last_name}`}
            </h3>

            <div className="space-y-3 mb-8">
                <p className="text-gray-700">
                    <span className="font-medium text-gray-900">Phone Number:</span> {user.phone_number}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium text-gray-900">Age:</span> {user.age}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium text-gray-900">City:</span> {user.residing_city}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium text-gray-900">County:</span> {user.residing_county}
                </p>
            </div>

            <h3 className="text-xl font-semibold mb-6 text-gray-900">Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
                {user.skills && user.skills.map(skill => (
                    <div
                        key={skill.id}
                        className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-[6px] hover:border-gray-400 transition-all duration-200 w-full max-w-[220px]"
                    >
                        <img
                            src={skill.skill_picture}
                            width="160"
                            height="80"
                            alt="Skill"
                            className="rounded-[6px] border border-gray-200"
                        />
                        <div>
                            <p className="font-medium text-gray-900">{skill.title}</p>
                            <p className="text-sm text-gray-500">Difficulty: {skill.difficulty}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserInformationCard;
