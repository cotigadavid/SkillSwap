import UserInformationCard from "./UserInformationCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import secureAxios from "../secureAxios";

const OtherProfile = () => {
    const [user, setUser] = useState('');

    const { userId } = useParams();

    useEffect(() =>  {
            const fetchUser = async () => {
                try {
                    const response = await secureAxios.get(`http://localhost:8000/api/users/${userId}/`);
                    const data = response.data;
                    console.log(data);
                    setUser(data);
                } catch (error) {
                    console.error("Error fetching useer: ", error);
                }
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