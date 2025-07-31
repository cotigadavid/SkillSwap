import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SkillList from './components/SkillList';
import UserProfile from './components/UserProfile';
import AdInfo from './components/AdInfo';
import AddSkill from './components/AddSkill';
import SkillEdit from './components/SkillEdit';
import AuthWindow from './components/AuthWindow';
import ChatWindow from './components/ChatWindow';
import Conversations from './components/Conversations';
import AddProfilePicture from './components/AddProfilePhoto';
import UserEditCard from './components/UserEditCard';
import OtherProfile from './components/OtherProfile';

function App() {
  return (
    <div className='main'>
      <Routes>
        <Route path="/auth" element={<AuthWindow/>}/>
        <Route path="/" element={<Conversations />} />
        <Route path="/conv/:convId" element={<ChatWindow />} />
        <Route path="/add" element={<UserEditCard/>}/>
        <Route path="/profile/:userId" element={<OtherProfile/>}/>
      </Routes>
    </div>
  );
}

export default App;
