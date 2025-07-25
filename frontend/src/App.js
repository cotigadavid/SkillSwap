import './App.css';
import AuthWindow from './components/AuthWindow';
import SkillList from './components/SkillList';
import UserProfile from './components/UserProfile';
import AddSkill from './components/AddSkill';
import SkillEdit from './components/SkillEdit';

function App() {
  return (
    <div className='main'>
      <UserProfile/>
    </div>
  );
}

export default App;