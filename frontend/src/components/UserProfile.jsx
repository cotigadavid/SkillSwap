import { useState, useEffect } from "react";
import '../styling/UserProfile.css'
import came from '../assets/came.jpeg';
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
    }, [showAddPhoto]);

    const toggleInfoState = () => {
        if (infoState === 'info')
            setInfoState('edit');
        else
            setInfoState('info');
    };

    return (
        <div className="UserProfile">
            <h2>User Profile</h2>
            {user ? (
                <>
                    <div className="Header">
                        <div className="ImageContainer">
                            <button type="button" onClick={() => setShowAddPhoto(true)}>
                                <img src={edit} width="40" height="40" alt="Edit"></img>
                            </button>
                            {/* <img src={came} width="100" height="100" alt="Profile"/> */}
                            <img src={`${user.profile_picture}`} width="100" height="100" alt="Profile" />
                        </div>
                        <p>{user.username}</p>
                    </div>
                    <button onClick={toggleInfoState}>edit</button>
                    {infoState === 'info' && <UserInformationCard user={user}/>}
                    {infoState === 'edit' && <UserEditCard user={user}/>}

                    {showAddPhoto && <AddProfilePicture userId={userId} closeFunction={() => setShowAddPhoto(false)}/>}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;

