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
        const userId = localStorage.getItem('userId');
        await fetch(`http://localhost:8000/api/users/${userId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                phone_number: phoneNumber,
                birth_date: birthDate,
                residing_city: residingCity,
                residing_county: residingCounty
            })
        })
    };

    const navigate = useNavigate();

    const handleDiscard = () => {
        navigate(-1);
    };  

    const handleDeleteSkill = async (skillId) => {
        const response = await secureAxios(`skills/${skillId}/`, {
            method: 'DELETE'
        });
        if (response.status === 204 || response.status === 200) {
            setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
        }
        console.log(response);
    };

    return (
        <div className="p-6 bg-gray-100 rounded shadow-md">
            <p className="text-xl font-semibold mb-4">Edit your information</p>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Birthdate</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Home City</label>
                    <input
                        type="text"
                        value={residingCity}
                        onChange={(e) => setResidingCity(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Home County</label>
                    <input
                        type="text"
                        value={residingCounty}
                        onChange={(e) => setResidingCounty(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Skills</h3>
                    <ul className="space-y-3">
                        {skills.map(skill => (
                            <li
                                key={skill.id}
                                className="flex items-center justify-between p-2 bg-white border rounded shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={skill.skill_picture} width="40" height="40" alt="Skill" />
                                    <div>
                                        <p className="font-medium">{skill.title}</p>
                                        <p className="text-sm text-gray-500">Difficulty: {skill.difficulty}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(skill.id)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSkillId(skill.id)}
                                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                </div>
                                {editingSkillId === skill.id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <SkillEdit skill={skill} onClose={() => setEditingSkillId(null)} />
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
            <div className="mt-6">
                <AddSkill />
            </div>
        </div>
    );

};

export default UserEditCard;