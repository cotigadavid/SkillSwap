import { useState } from 'react';
import secureAxios from '../secureAxios';

const AddSkill = ({ onSkillAdded }) => {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [hours, setHours] = useState('');

    const ranges = {
        easy: [1, 20],
        medium: [20, 50],
        hard: [50, 100],
        serious: [100, 9999],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (difficulty && hours) {
            const [min, max] = ranges[difficulty] || [0, Infinity];
            if (hours < min || hours > max) {
                alert(`For ${difficulty} skills, hours should be between ${min} and ${max}.`);
                return;
            }
        }

        try {
            const response = await secureAxios.post('skills/', {
                title,
                difficulty,
                hours_needed: hours,
            });

            if (onSkillAdded) {
                onSkillAdded(response.data);
            }

            setTitle('');
            setDifficulty('');
            setHours('');
        } catch (error) {
            console.error('Error adding skill:', error);
            alert("There was an error adding the skill. Please try again.");
        }
    };

    return (
        <div className="bg-white">
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Add New Skill</h3>
           
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium text-gray-900">Skill Title</label>
                    <input
                        type="text"
                        placeholder="Enter skill title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] 
                                   focus:outline-none focus:ring-2 focus:ring-teal-500 
                                   focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-900">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] 
                                bg-white text-gray-900
                                focus:outline-none focus:ring-2 focus:ring-teal-500 
                                focus:border-transparent transition-all duration-200"
                        required
                    >
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="serious">Serious</option>
                    </select>

                </div>

                <div>
                    <label className="block mb-2 font-medium text-gray-900">Hours Needed</label>
                    <input
                        type="number"
                        placeholder="Enter number of hours"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-[6px] 
                                   focus:outline-none focus:ring-2 focus:ring-teal-500 
                                   focus:border-transparent transition-all duration-200 text-gray-900"
                        required
                    />
                    {difficulty && (
                        <p className="mt-2 text-sm text-gray-500">
                            For <span className="font-medium">{difficulty}</span> you must choose between{" "}
                            {ranges[difficulty][0]} and {ranges[difficulty][1] === 9999 ? '∞' : ranges[difficulty][1]} hours.
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 
                                   text-white rounded-[6px] font-medium 
                                   transition-all duration-200"
                    >
                        Add Skill
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSkill;
