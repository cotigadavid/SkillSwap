import { useState } from "react";

const AddProfilePicture = ( {closeFunction} ) => {
    const [file, setFile] = useState(null);
   
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
    const handleSubmit = async () => {
        if (!file)
            return;
        const userId = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('profile_picture', file);
        const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
            method: 'PATCH',
            body: formData
        });
        console.log(response);
        if (response.ok) {
            alert('Profile picture updated!');
        } else {
            alert('Upload failed');
        }
        closeFunction();
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-300 rounded p-6 shadow-sm w-full max-w-sm mx-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Update Profile Picture</h3>
                
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                    >
                        Upload
                    </button>
                    <button
                        onClick={closeFunction}
                        className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProfilePicture;