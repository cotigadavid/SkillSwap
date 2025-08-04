import SkillList from "./SkillList";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    return (
        <div>
            <SkillList/>
            <button onClick={() => navigate(`/conv`)}>Chat</button>
            <button onClick={() => navigate(`/auth`)}>Auth</button>
            <button onClick={() => navigate(`/my-profile`)}>My Profile</button>
        </div>
    );
};

export default HomePage;