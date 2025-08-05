import SkillList from "./SkillList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    return (
    <div className="flex flex-col items-center gap-4 mt-6">
        <SkillList />
        <div className="flex gap-4">
            <button
                onClick={() => navigate(`/conv`)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Chat
            </button>
            <button
                onClick={() => navigate(`/auth`)}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
                Auth
            </button>
            <button
                onClick={() => navigate(`/my-profile`)}
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition"
            >
                My Profile
            </button>
        </div>
    </div>
);

};

export default HomePage;