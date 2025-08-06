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
        <div className="w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Skill</h2>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Difficulty</label>
                    <input
                        type="text"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Hours needed</label>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400 resize-none"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Skill Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    {skill.image && (
                        <img
                            src={`http://localhost:8000${skill.image}`}
                            alt="Current"
                            width="100"
                            className="mt-3 rounded border border-gray-300"
                        />
                    )}
                </div>
                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SkillEdit;