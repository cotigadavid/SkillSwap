import '../styling/AuthWindow.css';
import { useState } from "react";
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import logo from '../assets/Logo1024.png';


const AuthWindow = () => {
    const [selected, setSelected] = useState('LogIn');


    return (
        <div className='AuthWindow'>
            <figure><img src={logo} width="256" height="256" alt="Logo"></img></figure>
            <button type="button" id='log' 
                className={selected === 'LogIn' ? 'active' : ''} 
                onClick={() => setSelected('LogIn')}>Log in</button>
            <button type="button" id='sign'
                className={selected === 'SignUp' ? 'active' : ''} 
                onClick={() => setSelected("SignUp")}>Sign up</button>

            <div className='FormContainer'>
                {selected === 'LogIn' && <LoginForm/>}
                {selected === 'SignUp' && <SignupForm/>}
            </div>  
        </div>
    );
};

export default AuthWindow;
