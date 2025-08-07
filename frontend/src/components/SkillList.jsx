import { useState, useEffect } from "react";
import SkillAdvertisement from "./SkillAdvertisement";
import { Link } from 'react-router-dom';
//import '../styling/SkillList.css';
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
    <div className="max-w-3xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <input
            type="text"
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
            onClick={handleSearch}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-md transition-colors"
        >
            Search
        </button>
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors"
        >
            Filter
        </button>
        </div>

        {showFilters && (
        <div className="bg-gray-100 p-4 rounded-md mb-6 shadow-sm">
            <fieldset className="mb-4">
            <legend className="text-lg font-medium mb-2">Filter by difficulty</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label className="inline-flex items-center gap-2">
                <input
                    type="checkbox"
                    id="Easy"
                    name="Easy"
                    checked={easyChecked}
                    onChange={() => setEasyChecked(!easyChecked)}
                />
                <span>Easy</span>
                </label>
                <label className="inline-flex items-center gap-2">
                <input
                    type="checkbox"
                    id="Medium"
                    name="Medium"
                    checked={mediumChecked}
                    onChange={() => setMediumChecked(!mediumChecked)}
                />
                <span>Medium</span>
                </label>
                <label className="inline-flex items-center gap-2">
                <input
                    type="checkbox"
                    id="Hard"
                    name="Hard"
                    checked={hardChecked}
                    onChange={() => setHardChecked(!hardChecked)}
                />
                <span>Hard</span>
                </label>
                <label className="inline-flex items-center gap-2">
                <input
                    type="checkbox"
                    id="Serious"
                    name="Serious"
                    checked={seriousChecked}
                    onChange={() => setSeriousChecked(!seriousChecked)}
                />
                <span>Serious</span>
                </label>
            </div>
            </fieldset>

            <div>
            <label className="block font-medium mb-1">Minimum rating: {minRating} ⭐</label>
            <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                className="w-full"
            />
            </div>
        </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Skill Advertisements:</h2>
        <div className="space-y-4">
        {skills
            .filter(item => {
            const diff = item.difficulty;
            const rating = item.reviews.rating;
            return (
                (rating >= minRating || item.reviews.count === 0) &&
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
                <SkillAdvertisement skill={item} />
            </Link>
            ))}
        </div>
    </div>
    );

};

export default SkillList;