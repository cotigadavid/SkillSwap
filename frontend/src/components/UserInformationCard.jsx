import came from '../assets/came.jpeg';

const UserInformationCard = ({ user }) => {

    return (
        <div>
            <div>
                <h3>Your information</h3>
                <p>Phone Number: {user.phone_number}</p>
                <p>Age: {user.age}</p>
                <p>Your city: {user.residing_city}</p>
                <p>Your county: {user.residing_county}</p>
            </div>
            <div>
                <h3>Skills</h3>
                <ul> {user.skills && user.skills.map(skill => (
                    <div>
                    <li key={skill.id}> <img src={came} width="50" height="50" alt="skill"/> {skill.title} {skill.difficulty}</li>
                    </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserInformationCard;