import React, {useState} from "react";

function SkillRequestForm({ mySkills, onSubmit }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async () => {
      try {
          if (selectedSkills.length === 0) return;
          
          setIsSubmitting(true);
          await onSubmit(selectedSkills, message);
      } catch(error) {
          console.error("Failed to send request: ", error);
      }
      setIsSubmitting(false);
  };

  return (
    <div className="bg-white border border-gray-300 rounded p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Select Your Skills to Offer</h2>
        <p className="text-gray-600">Choose which skills you'd like to exchange</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            My Skills
          </label>
          <div className="space-y-2">
            {mySkills.map((skill) => (
              <label
                key={skill.id}
                className={`flex items-center p-3 rounded border cursor-pointer ${
                  selectedSkills.includes(skill.id)
                    ? 'bg-gray-50 border-gray-400'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-600 focus:ring-gray-400 mr-3"
                  checked={selectedSkills.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                />
                <span className={`font-medium ${
                  selectedSkills.includes(skill.id) ? 'text-gray-800' : 'text-gray-700'
                }`}>
                  {skill.title}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell them why you're interested in this skill exchange..."
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-400 resize-none"
            rows="4"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedSkills.length === 0 || isSubmitting}
          className={`w-full py-3 px-6 rounded font-semibold text-white ${
            selectedSkills.length === 0 || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-800'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending Request...
            </div>
          ) : (
            'Send Skill Exchange Request'
          )}
        </button>
      </div>
    </div>
  );
}

export default SkillRequestForm;