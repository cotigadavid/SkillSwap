import { useState } from "react";
import secureAxios from "../secureAxios";
 
const SkillEdit = ({ skill, onClose }) => {
    const [title, setTitle] = useState(skill.title);
    const [difficulty, setDifficulty] = useState(skill.difficulty);
    const [hours, setHours] = useState(skill.hours_needed);
    const [description, setDescription] = useState(skill.description);
    const [picture, setPicture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
 
    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
 
        try {
            console.log('=== STARTING SAVE PROCESS ===');
            console.log('Skill ID:', skill.id);
            console.log('Picture selected:', !!picture);
 
            const textData = {
                title: title,
                difficulty: difficulty,
                hours_needed: parseInt(hours),
                description: description
            };
 
            console.log('Sending text data:', textData);
 
            const response = await secureAxios.patch(
                `skills/${skill.id}/`,
                textData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
 
            console.log('✅ Text data updated successfully');
 
            if (picture) {
                console.log('=== UPLOADING IMAGE ===');
 
                const payload = [{filename: picture.name, content_type: picture.type}];
 
                const presigned_urls = (await secureAxios.post("/generate-upload-url/", {files: payload})).data;
 
                const { url, key } = presigned_urls[0];
 
                await fetch(url, {
                    method: "PUT",
                    headers: { "Content-Type": picture.type },
                    body: picture
                });
 
                const imageFormData = new FormData();
                imageFormData.append('skill_picture', key);
 
 
                // const imageResponse = await secureAxios.patch(
                //     `skills/${skill.id}/`,
                //     imageFormData
                // );
 
                const imageResponse = await secureAxios.patch(`skills/${skill.id}/`, imageFormData, {
                headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
 
                console.log('✅ Image updated successfully:', imageResponse.data);
            }
 
            console.log('=== SAVE COMPLETED ===');
            alert('Skill updated successfully!');
            onClose();
            window.location.reload();
 
        } catch (error) {
            console.error("❌ ERROR:", error);
 
            if (error.response) {
                console.error("Error status:", error.response.status);
                console.error("Error data:", error.response.data);
 
                const errorMessage = error.response.data?.detail || 
                                   error.response.data?.message ||
                                   JSON.stringify(error.response.data);
                alert(`Error: ${errorMessage}`);
            } else {
                console.error("Network/other error:", error.message);
                alert(`Error: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
 
    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file);
 
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (validTypes.includes(file.type)) {
 
                const maxSize = 5 * 1024 * 1024; //
                if (file.size > maxSize) {
                    alert("File size too large. Please select an image smaller than 5MB.");
                    e.target.value = '';
                    return;
                }
 
                setPicture(file);
                console.log('Picture state updated'); 
            } else {
                alert("Please select a valid image file (JPEG, PNG, or GIF)");
                e.target.value = '';
            }
        }
    };
 
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[6px] w-full max-w-lg p-6 overflow-y-auto max-h-[90vh] shadow-lg">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Edit Skill</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium text-gray-900">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                        />
                    </div>
 
                    <div>
                        <label className="block mb-2 font-medium text-gray-900">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                        >
                            <option value="">Select difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="serious">Serious</option>
                        </select>
                    </div>
 
                    <div>
                        <label className="block mb-2 font-medium text-gray-900">Hours needed</label>
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            required
                            min="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900"
                        />
                    </div>
 
                    <div>
                        <label className="block mb-2 font-medium text-gray-900">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="4"
                            className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 resize-none"
                            placeholder="Describe your skill..."
                        />
                    </div>
 
                    <div>
                        <label className="block mb-2 font-medium text-gray-900">Skill Image</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onChange={handlePictureChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:border file:border-gray-300 file:rounded-[6px] file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 transition-all duration-200"
                        />
 
                        {skill.skill_picture && !picture && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Current image:</p>
                                <img
                                    src={`https://skillswap-bucket.s3.eu-north-1.amazonaws.com/${skill.skill_picture}`}
                                    alt="Current skill"
                                    className="w-24 h-24 object-cover rounded-[6px] border border-gray-200"
                                />
                            </div>
                        )}
 
                        {picture && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">New image selected:</p>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm text-teal-600">{picture.name}</p>
                                    <p className="text-xs text-gray-500">
                                        ({(picture.size / 1024).toFixed(1)} KB)
                                    </p>
                                </div>
                                <img
                                    src={URL.createObjectURL(picture)}
                                    alt="New skill preview"
                                    className="w-24 h-24 object-cover rounded-[6px] border border-gray-200 mt-2"
                                />
                            </div>
                        )}
                    </div>
 
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default SkillEdit;