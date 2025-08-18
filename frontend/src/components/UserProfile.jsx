import { useState, useEffect } from "react";
//import '../styling/UserProfile.css'
import UserInformationCard from "./UserInformationCard";
import UserEditCard from "./UserEditCard";
import AddProfilePicture from "./AddProfilePhoto";
import edit from '../assets/edit.png'
import secureAxios from "../secureAxios";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [infoState, setInfoState] = useState('info');
    const [showAddPhoto, setShowAddPhoto] = useState(false);
    const userId = localStorage.getItem('userId');
    
    useEffect(() =>  {
        const fetchUser = async () => {
            try {
                const response = await secureAxios.get(`users/${userId}/`);
                const data = response.data;
                console.log(data);
                setUser(data);
            } catch (error) {
                console.error("Error fetching user: ", error);
            }
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
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">User Profile</h2>
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
                                    className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-50"
                                    onClick={() => setShowAddPhoto(true)}
                                >
                                    <img src={edit} width="20" height="20" alt="Edit" />
                                </button>
                            </div>
                            <p className="text-lg font-medium text-gray-800">{user.username}</p>
                        </div>
                        
                        <div className="flex justify-center gap-4 mb-6">
                            <button
                                onClick={toggleInfoState}
                                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
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
                    <div className="bg-white border border-gray-300 rounded p-8 shadow-sm">
                        <p className="text-center text-gray-600">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;