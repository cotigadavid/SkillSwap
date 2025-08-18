import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureAxios from '../secureAxios';
import AddSkill from './AddSkill';
import SkillEdit from './SkillEdit';
//import '../styling/UserEdit.css';

const UserEditCard = ({ user }) => {
    const [skills, setSkills] = useState(user.skills || []);
    const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
    const [birthDate, setBirthDate] = useState(user.birth_date);
    const [residingCity, setResidingCity]  = useState(user.residing_city);
    const [residingCounty, setResidingCounty]  = useState(user.residing_county);
    const [editingSkillId, setEditingSkillId] = useState(null);

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('userId');

            const formData = new FormData();
            formData.append('phone_number', phoneNumber);
            formData.append('birth_date', birthDate);
            formData.append('residing_city', residingCity);
            formData.append('residing_county', residingCounty);

            await secureAxios.patch(`users/${userId}/`, {
                body: formData,
            });
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    };

    const navigate = useNavigate();

    const handleDiscard = () => {
        navigate(-1);
    };  

    const handleDeleteSkill = async (skillId) => {
        try {
            const response = await secureAxios(`skills/${skillId}/`, {
                method: 'DELETE'
            });
            if (response.status === 204 || response.status === 200) {
                setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
            }
            console.log(response);
        } catch (error) {
            console.error("Error deleting skill: ", error);
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded p-6 shadow-sm">
            <p className="text-xl font-semibold mb-6 text-gray-800">Edit your information</p>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Birthdate</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Home City</label>
                    <input
                        type="text"
                        value={residingCity}
                        onChange={(e) => setResidingCity(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Home County</label>
                    <input
                        type="text"
                        value={residingCounty}
                        onChange={(e) => setResidingCounty(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gray-400"
                    />
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Skills</h3>
                    <div className="space-y-3">
                        {skills.map(skill => (
                            <div
                                key={skill.id}
                                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded"
                            >
                                <div className="flex items-center gap-3">
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
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSkillId(skill.id)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                                {editingSkillId === skill.id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white border border-gray-300 rounded p-6 shadow-sm max-w-md w-full mx-4">
                                            <SkillEdit skill={skill} onClose={() => setEditingSkillId(null)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-300">
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleDiscard}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Discard
                    </button>
                </div>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-300">
                <AddSkill />
            </div>
        </div>
    );
};

export default UserEditCard;