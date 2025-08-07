import UserInformationCard from "./UserInformationCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const OtherProfile = () => {
    const [user, setUser] = useState('');

    const { userId } = useParams();

    useEffect(() =>  {
            const fetchUser = async () => {
                const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data);
                setUser(data);
            };
    
            fetchUser();
        }, []);

    return (
    <div className="flex flex-col items-center space-y-4 p-4">
        <img
        src={user.profile_picture}
        alt="Profile"
        width={100}
        height={100}
        className="rounded-full object-cover"
        />
        <UserInformationCard user={user} />
    </div>
    );

    
};

export default OtherProfile;