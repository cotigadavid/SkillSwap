import { useState } from "react";

const SkillEdit = ( {skill, onClose} ) => {
    const [title, setTitle] = useState(skill.title);
    const [difficulty, setDifficulty] = useState(skill.difficulty);
    const [hours, setHours] = useState(skill.hours_needed);
    const [description, setDescription] = useState(skill.description);
    const [picture, setPicture] = useState(skill.picture);
    
    const handleSave = async () => {
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('difficulty', difficulty);
        formData.append('hours_needed', hours);
        formData.append('description', description);
        if (picture)
            formData.append('skill_picture', picture);

        await fetch(`http://localhost:8000/api/skills/${skill.id}/`, {
            method: 'PATCH',
            body: formData,
        })
    };

    const handlePictureChange = (e) => {
        setPicture(e.target.files[0]);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-center">Edit Skill</h2>
            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Difficulty</label>
                    <input
                        type="text"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Hours needed</label>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">Skill Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 rounded"
                    />
                    {skill.image && (
                        <img
                            src={`http://localhost:8000${skill.image}`}
                            alt="Current"
                            width="100"
                            className="mt-3 rounded"
                        />
                    )}
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );

};

export default SkillEdit;