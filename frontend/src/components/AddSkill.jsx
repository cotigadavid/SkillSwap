import { useState } from 'react';

const AddSkill = () => {
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [hours, setHours] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/skills/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                difficulty: difficulty,
                hours_needed: hours,
            }),
        });

        const data = await response.json();

        if (response.ok) {
                alert("Skill added successfully!");
        } else {
                console.error(data);
                alert("Error adding skill");
        }
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