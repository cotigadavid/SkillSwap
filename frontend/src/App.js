import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import HomePage from './components/HomePage';

function App() {
  return (
    <div>
      <head>
        <link href="/dist/styles.css" rel="stylesheet"/>
      </head>
      <div className='main'>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/skills/:id" element={<AdInfo />} />
          <Route path="/auth" element={<AuthWindow/>}/>
          <Route path="/conv" element={<Conversations />} />
          <Route path="/conv/:convId" element={<ChatWindow />} />
          <Route path="/my-profile" element={<UserProfile />} />
          <Route path="/profile/:userId" element={<OtherProfile/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
