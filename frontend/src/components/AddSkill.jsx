import { useState } from 'react';
import secureAxios from '../secureAxios';

const AddSkill = () => {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [hours, setHours] = useState('');
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await secureAxios.post('skills/', {
                title: title,
                difficulty: difficulty,
                hours_needed: hours,
            });
        } catch (error) {
            console.error('Error adding skill:', error);
            alert("There was an error adding the skill. Please try again.");
        }
    };
   
    return (
        <div className="bg-white border border-gray-200 rounded-[6px] p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Add New Skill</h3>
           
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Skill title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <input
                    type="text"
                    placeholder="Difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <input
                    type="number"
                    placeholder="Hours Needed"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
                >
                    Add Skill
                </button>
            </form>
        </div>
    );
};

export default AddSkill;