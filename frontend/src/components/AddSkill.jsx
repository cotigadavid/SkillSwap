import { useState } from 'react';
import secureAxios from '../secureAxios';

const AddSkill = () => {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [hours, setHours] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await secureAxios.post('skills/', {
            
            title: title,
            difficulty: difficulty,
            hours_needed: hours,
            
        });
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4"
        >
            <input
                type="text"
                placeholder="Skill title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text"
                placeholder="Difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="number"
                placeholder="Hours Needed"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Add Skill
            </button>
        </form>
    );


};

export default AddSkill;