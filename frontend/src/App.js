import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SkillList from './components/SkillList';
import UserProfile from './components/UserProfile';
import AdInfo from './components/AdInfo';
import AdMain from './components/AdMain';
import AddSkill from './components/AddSkill';
import SkillEdit from './components/SkillEdit';
import AuthWindow from './components/AuthWindow';


function App() {
  return (
    <div className='main'>
      <Routes>
        <Route path="/" element={<UserProfile />} />
        <Route path="/skills" element={<SkillList />} />
        <Route path="/skills/:id" element={<AdMain />} />
      </Routes>
    </div>
  );
}

export default App;
