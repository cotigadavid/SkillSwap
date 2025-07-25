import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import came from '../assets/came.jpeg';
import secureAxios from '../secureAxios';
import AddSkill from './AddSkill';
import SkillEdit from './SkillEdit';
import '../styling/UserEdit.css';

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
        <div className='LoginForm'>
            <p>your information</p>
            <form onSubmit={handleSave}>
                <div>
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Birthdate</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Home city</label>
                    <input
                        type="text"
                        value={residingCity}
                        onChange={(e) => setResidingCity(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Home county</label>
                    <input
                        type="text"
                        value={residingCounty}
                        onChange={(e) => setResidingCounty(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <h3>Skills</h3>
                    <ul> {skills.map(skill => (
                        <div>
                        <li key={skill.id}> 
                            <img src={skill.skill_picture} width="50" height="50" alt="skill"/> 
                            {skill.title} {skill.difficulty} 
                            <button type="button" onClick={() => handleDeleteSkill(skill.id) }>Delete</button>  
                            <button type="button" onClick={() => setEditingSkillId(skill.id)}>Edit</button>
                            {editingSkillId === skill.id && (
                                <div className="modal-overlay">
                                <SkillEdit skill={skill} onClose={() => setEditingSkillId(null)} />
                                </div>
                            )}

                        </li>
                        </div>
                        ))}
                    </ul>
                </div>
                <button type="submit" className='submitButton'>Save</button>
                <button type="button" className='submitButton' onClick={handleDiscard}>Discard</button>
            </form>
            <AddSkill/>
        </div>
    );
};

export default UserEditCard;