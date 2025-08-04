import { useState, useEffect } from "react";
import SkillAdvertisement from "./SkillAdvertisement";
import { Link } from 'react-router-dom';
import profilePic from '../assets/profile.jpg';
import '../styling/SkillList.css';
import secureAxios from "../secureAxios";


function SkillList() {
    const [query, setQuery] = useState('');
    const [skills, setSkills] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [minRating, setMinRating] = useState(3);
    const [easyChecked, setEasyChecked] = useState(true);
    const [mediumChecked, setMediumChecked] = useState(true);
    const [hardChecked, setHardChecked] = useState(true);
    const [seriousChecked, setSeriousChecked] = useState(true);

    const handleSearch = async () => {
        console.log(query);
        try {
            const response = await secureAxios.get(`/skills_search/`, {
                params: { query }
            });
            setSkills(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Search failed", error);
        }
    };
    
    useEffect(() => {
        handleSearch();
    }, []);
    

    return (
        <div>
            <input
                type="text"
                placeholder="Search skills..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={() => setShowFilters(!showFilters)}>Filter</button>
            {showFilters && (
                    <div>
                        <fieldset>
                            <legend>Filter</legend>
                            <div>
                                <input type="checkbox" id="Easy" name="Easy" checked={easyChecked} onChange={() => setEasyChecked(!easyChecked)} />
                                <label for="Easy">Easy</label>
                            </div>
                            <div>
                                <input type="checkbox" id="Medium" name="Medium" checked={mediumChecked} onChange={() => setMediumChecked(!mediumChecked)}/>
                                <label for="Medium">Medium</label>
                            </div>
                            <div>
                                <input type="checkbox" id="Hard" name="Hard" checked={hardChecked} onChange={() => setHardChecked(!hardChecked)}/>
                                <label for="Hard">Hard</label>
                            </div>
                            <div>
                                <input type="checkbox" id="Serious" name="Serious" checked={seriousChecked} onChange={() => setSeriousChecked(!seriousChecked)}/>
                                <label for="Serious">Serious</label>
                            </div>
                        </fieldset>
                        <div>
                        <label>
                            Minimum rating: {minRating} ⭐
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={minRating}
                            onChange={(e) => setMinRating(parseInt(e.target.value))}
                        />
                        </div>
                    </div>
                    )}
            <h2>Lista anunturi:</h2>
                {skills.filter(item => {
                        const diff = item.difficulty;
                        const rating = item.reviews.rating;
                        return (
                            (rating >= minRating || item.reviews.count == 0) &&
                            (
                                (diff === "easy" && easyChecked) ||
                                (diff === "medium" && mediumChecked) ||
                                (diff === "hard" && hardChecked) ||
                                (diff === "serious" && seriousChecked)
                            )
                        );
                    })
                    .map(item => (
                            <Link key={item.id} to={`/skills/${item.id}`}>
                                <SkillAdvertisement
                                    skill={item}
                                />
                            </Link>
                    ))}
            
        </div>
    );
};

export default SkillList;