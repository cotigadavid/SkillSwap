import './App.css';
import AuthWindow from './components/AuthWindow';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import SkillAdvertisement from './components/SkillAdvertisement'
import SkillList from './components/SkillList';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <div className='main'>
      <UserProfile/>
    </div>
  );
}

export default App;