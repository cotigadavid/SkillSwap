import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import SkillList from './components/SkillList';
import UserProfile from './components/UserProfile';
import AdInfo from './components/AdInfo';
import AdMain from './components/AdMain';
import AddSkill from './components/AddSkill';
import SkillEdit from './components/SkillEdit';
import AuthWindow from './components/AuthWindow';
import ChatWindow from './components/ChatWindow';
import Conversations from './components/Conversations';
import AddProfilePicture from './components/AddProfilePhoto';
import UserEditCard from './components/UserEditCard';
import OtherProfile from './components/OtherProfile';
import HomePage from './components/HomePage';
import RequestList from './components/RequestList';
import ConfirmEmailPage from './components/ConfirmEmailPage';
import ResetPassword from './components/ResetPassword';
import ChoosePassword from './components/ChoosePassword';

function App() {
  return (
      <div className='main'>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/skills/:id" element={<AdMain />} />
          <Route path="/auth" element={<AuthWindow/>}/>
          <Route path="/conv" element={<Conversations />} />
          <Route path="/conv/:convId" element={<ChatWindow />} />
          <Route path="/my-profile" element={<UserProfile />} />
          <Route path="/profile/:userId" element={<OtherProfile/>}/>
          <Route path="/requests" element={<RequestList/>} />
          <Route path="/confirm-email/" element={<ConfirmEmailPage />} />
          <Route path="/reset-password/" element={<ResetPassword />} />
          <Route path="/choose-password/:uid/:token/" element={<ChoosePassword />} />
        </Routes>
      </div>
  );
}

export default App;
