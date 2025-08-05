import { useState, useEffect } from "react";
//import '../styling/UserProfile.css'
import UserInformationCard from "./UserInformationCard";
import UserEditCard from "./UserEditCard";
import AddProfilePicture from "./AddProfilePhoto";
import edit from '../assets/edit.png'


const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [infoState, setInfoState] = useState('info');
    const [showAddPhoto, setShowAddPhoto] = useState(false);

    const userId = localStorage.getItem('userId');
    useEffect(() =>  {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
                method: 'GET'
            });
            const data = await response.json();
            console.log(data);
            setUser(data);
        };

        fetchUser();
    }, [showAddPhoto, infoState]);

    const toggleInfoState = () => {
        if (infoState === 'info')
            setInfoState('edit');
        else
            setInfoState('info');
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">User Profile</h2>
            {user ? (
                <>
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-[100px] h-[100px] mb-2">
                            <img
                                src={`${user.profile_picture}`}
                                className="rounded-full object-cover w-full h-full border border-gray-300"
                                alt="Profile"
                            />
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
                                onClick={() => setShowAddPhoto(true)}
                            >
                                <img src={edit} width="20" height="20" alt="Edit" />
                            </button>
                        </div>
                        <p className="text-lg font-medium">{user.username}</p>
                    </div>

                    <div className="flex justify-center gap-4 mb-4">
                        <button
                            onClick={toggleInfoState}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                            {infoState === 'info' ? 'Edit' : 'Cancel'}
                        </button>
                    </div>

                    <div>
                        {infoState === 'info' && <UserInformationCard user={user} />}
                        {infoState === 'edit' && <UserEditCard user={user} />}
                    </div>

                    {showAddPhoto && (
                        <AddProfilePicture
                            userId={userId}
                            closeFunction={() => setShowAddPhoto(false)}
                        />
                    )}
                </>
            ) : (
                <p className="text-center text-gray-600">Loading...</p>
            )}
        </div>
    );

};

export default UserProfile;

