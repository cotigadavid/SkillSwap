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
        <div className="bg-gray-50 border border-gray-300 rounded p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Skill</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Skill title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                />
                <input
                    type="text"
                    placeholder="Difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                />
                <input
                    type="number"
                    placeholder="Hours Needed"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-gray-700 text-white rounded hover:bg-gray-800 font-medium"
                >
                    Add Skill
                </button>
            </form>
        </div>
    );
};

export default AddSkill;