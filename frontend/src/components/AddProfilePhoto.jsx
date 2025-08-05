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
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex gap-4">
                <button 
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Upload
                </button>
                <button 
                    onClick={closeFunction}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );

};

export default AddProfilePicture;