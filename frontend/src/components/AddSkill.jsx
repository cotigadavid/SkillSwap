import { useState } from 'react';
import secureAxios from '../secureAxios';

const AddSkill = () => {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [hours, setHours] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem('access'); 

        const response = await secureAxios.post('skills/', {
            
            title: title,
            difficulty: difficulty,
            hours_needed: hours,
            
        });

        const data = await response.data;
    };

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Skill title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        <input
            type="text"
            placeholder="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
        />
        <input
            type="number"
            placeholder="Hours Needed"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
        />
        <button type="submit">Add Skill</button>
        </form>
    );

};

export default AddSkill;