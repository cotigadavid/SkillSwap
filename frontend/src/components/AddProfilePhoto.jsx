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
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleSubmit}>Upload</button>
            <button onClick={closeFunction}>Cancel</button>
        </div>
    );
};

export default AddProfilePicture;