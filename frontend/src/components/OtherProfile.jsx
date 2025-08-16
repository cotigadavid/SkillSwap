import UserInformationCard from "./UserInformationCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import secureAxios from "../secureAxios";

const OtherProfile = () => {
    const [user, setUser] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await secureAxios.get(`http://localhost:8000/api/users/${userId}/`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user: ", error);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-700 border-solid"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <img
                src={user.profile_picture}
                alt={`${user.first_name} ${user.last_name}`}
                width={100}
                height={100}
                className="rounded-full object-cover"
            />
            <UserInformationCard user={user} isOwnProfile={false} />
        </div>
    );
};

export default OtherProfile;
