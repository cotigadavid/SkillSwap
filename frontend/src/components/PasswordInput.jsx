//import '../styling/LoginForm.css'
import eye from '../assets/eye.png';
import eye_closed from '../assets/eye_closed.png';

const PasswordInput = ({ value, onChange, showPassword, toggleShowPassword }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
        className="flex-1 px-4 py-2 focus:outline-none"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="px-4 py-2 bg-transparent hover:bg-gray-100"
      >
        <img
          src={showPassword ? eye_closed : eye}
          width="20"
          height="20"
          alt="Toggle visibility"
        />
      </button>
    </div>
  );
};


export default PasswordInput;