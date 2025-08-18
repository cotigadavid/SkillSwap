import { useState, useEffect } from "react";
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
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900">User Profile</h2>
                {user ? (
                    <>
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-[100px] h-[100px] mb-4">
                                <img
                                    src={`${user.profile_picture}`}
                                    className="rounded-full object-cover w-full h-full border-2 border-gray-200"
                                    alt="Profile"
                                />
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                                    onClick={() => setShowAddPhoto(true)}
                                >
                                    <img src={edit} width="16" height="16" alt="Edit" />
                                </button>
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{user.username}</p>
                        </div>
                       
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={toggleInfoState}
                                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
                            >
                                {infoState === 'info' ? 'Edit Profile' : 'Cancel Edit'}
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
                    <div className="bg-white border border-gray-200 rounded-[6px] p-8">
                        <p className="text-center text-gray-600">Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;