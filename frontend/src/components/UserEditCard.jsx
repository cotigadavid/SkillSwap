import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import secureAxios from '../secureAxios';
import AddSkill from './AddSkill';
import SkillEdit from './SkillEdit';

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
        setPhoneNumber(user.phone_number || "");
        setBirthDate(user.birth_date || "");
        setResidingCity(user.residing_city || "");
        setResidingCounty(user.residing_county || "");
        setSkills(user.skills || []);
        setEditingSkillId(null);
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
        <div className="bg-white border border-gray-200 rounded-[6px] p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Edit your information</h2>
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium text-gray-900">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-900">Birthdate</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-900">Home City</label>
                    <input
                        type="text"
                        value={residingCity}
                        onChange={(e) => setResidingCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-900">Home County</label>
                    <input
                        type="text"
                        value={residingCounty}
                        onChange={(e) => setResidingCounty(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Skills</h3>
                    <div className="space-y-3">
                        {skills.map(skill => (
                            <div
                                key={skill.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-[6px] hover:border-gray-400 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={skill.skill_picture} 
                                        width="40" 
                                        height="40" 
                                        alt="Skill" 
                                        className="rounded-[6px] border border-gray-200"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">{skill.title}</p>
                                        <p className="text-sm text-gray-500">Difficulty: {skill.difficulty}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSkillId(skill.id)}
                                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200 text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                                {editingSkillId === skill.id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white border border-gray-200 rounded-[6px] p-6 max-w-md w-full mx-4">
                                            <SkillEdit skill={skill} onClose={() => setEditingSkillId(null)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleDiscard}
                        className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200"
                    >
                        Discard
                    </button>
                    <button 
                        type="submit" 
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
                    >
                        Save
                    </button>
                </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
                <AddSkill onSkillAdded={(newSkill) => setSkills(prev => [...prev, newSkill])} />
            </div>
        </div>
    );
};

export default UserEditCard;