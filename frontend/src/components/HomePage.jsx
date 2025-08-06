import SkillList from "./SkillList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-12">
                    <SkillList />
                </div>
                
                <div className="flex justify-center">
                    <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                        <button
                            onClick={() => navigate(`/conv`)}
                            className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Chat
                        </button>
                        <button
                            onClick={() => navigate(`/auth`)}
                            className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Auth
                        </button>
                        <button
                            onClick={() => navigate(`/my-profile`)}
                            className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            My Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default HomePage;