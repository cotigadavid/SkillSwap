import React, {useState} from "react";



function SkillRequestForm({mySkills = [], onSubmit}) {
    const [selectedSkillIds, setSelectedSkillIds] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedSkillIds.length > 0 && onSubmit) {
            onSubmit(selectedSkillIds);
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

                <button type="submit">Submit</button>
        </form>
    );
};

export default SkillRequestForm;