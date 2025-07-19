import '../styling/LoginForm.css'
import eye from '../assets/eye.png';
import eye_closed from '../assets/eye_closed.png';

const PasswordInput = ({ value, onChange, showPassword, toggleShowPassword }) => (
    <div className='passCont'>
        <input
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            required
        />
        <button type='button' id='eye' onClick={toggleShowPassword}>
            <img src={showPassword ? eye_closed : eye} width='20' height='20' alt="Toggle visibility"/>
        </button>
    </div>
);

export default PasswordInput;