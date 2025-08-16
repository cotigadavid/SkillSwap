import { useState } from "react";
import secureAxios from "../secureAxios";

const AddProfilePicture = ( {closeFunction} ) => {
        const [file, setFile] = useState(null);
    
        const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };
    
        const handleSubmit = async () => {
        if (!file) return;

        try {
            const userId = localStorage.getItem('userId');
            const formData = new FormData();
            formData.append('profile_picture', file);

            const response = await secureAxios.patch(`users/${userId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                alert('Profile picture updated!');
            } else {
                alert('Upload failed');
            }

        } catch (error) {
            console.error('Upload error: ', error);
            alert("There was an error uploading the image. Please try again.")
        }

        closeFunction();
    }
   
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-[6px] p-6 w-full max-w-sm mx-4">
                <h3 className="text-lg font-semibold mb-6 text-gray-900">Update Profile Picture</h3>
               
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 mb-6 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-[6px] file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 transition-all duration-200"
                />
               
                <div className="flex gap-3">
                    <button
                        onClick={closeFunction}
                        className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProfilePicture;