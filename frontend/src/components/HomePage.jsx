import SkillList from "./SkillList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-12">
                    <SkillList />
                </div>
            </div>
        </div>
    );
};

export default HomePage;