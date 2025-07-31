import UserInformationCard from "./UserInformationCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const OtherProfile = () => {
    const [user, setUser] = useState('');

    const { userId } = useParams();

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
        }, []);

    return (
        <div>
            <img src={`${user.profile_picture}`} width="100" height="100" alt="Profile" />
            <UserInformationCard user={user}/>
        </div>
    );
    
};

export default OtherProfile;