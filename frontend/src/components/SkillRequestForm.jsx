import React, {useState} from "react";



function SkillRequestForm({mySkills = [], onSubmit}) {
    const [selectedSkillIds, setSelectedSkillIds] = useState([]);
    const [message, setMessage] = useState("Hi there! Let's exchange skills!");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedSkillIds.length > 0 && onSubmit) {
            onSubmit(selectedSkillIds, message);
        }
    };

    const handleChange = (event) => {
        const selectedSkills = Array.from(event.target.selectedOptions)
        const ids = selectedSkills.map(option => parseInt(option.value))
        setSelectedSkillIds(ids);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="selectSkill">Choose a skill to offer</label>
                <select id="selectSkill" value={selectedSkillIds} onChange={handleChange} multiple required>
                    <option value ="">Select</option> 
                    {mySkills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                            {skill.title}
                        </option>
                    ))}  
                </select>

                <label htmlFor="message">Message(optional):</label>
                <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here..."/>

                <button type="submit">Submit</button>
        </form>
    );
};

export default SkillRequestForm;