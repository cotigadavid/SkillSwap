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
        <div className='LoginForm'>
            <p>Edit Skill</p>
            <form onSubmit={handleSave}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>difficulty</label>
                    <input
                        type="text"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hours needed</label>
                    <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input type="file" accept="image/*" onChange={handlePictureChange} />

                    {skill.image && (
                        <img
                        src={`http://localhost:8000${skill.image}`}
                        alt="Current"
                        width="100"
                        />
                    )}
                </div>
                <button type="submit" className='submitButton' onClick={handleSave}>Save</button>
                <button type="button" className='closeButton' onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default SkillEdit;