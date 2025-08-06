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
    <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <input
            type="text"
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-gray-400 bg-white"
        />
        <button
            onClick={handleSearch}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded font-medium"
        >
            Search
        </button>
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded font-medium"
        >
            Filter
        </button>
        </div>

        {showFilters && (
        <div className="bg-gray-50 p-6 rounded border border-gray-300 mb-8">
            <fieldset className="mb-6">
            <legend className="text-lg font-semibold mb-4 text-gray-800">Filter by difficulty</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    id="Easy"
                    name="Easy"
                    checked={easyChecked}
                    onChange={() => setEasyChecked(!easyChecked)}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-400"
                />
                <span className="text-gray-700">Easy</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    id="Medium"
                    name="Medium"
                    checked={mediumChecked}
                    onChange={() => setMediumChecked(!mediumChecked)}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-400"
                />
                <span className="text-gray-700">Medium</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    id="Hard"
                    name="Hard"
                    checked={hardChecked}
                    onChange={() => setHardChecked(!hardChecked)}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-400"
                />
                <span className="text-gray-700">Hard</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    id="Serious"
                    name="Serious"
                    checked={seriousChecked}
                    onChange={() => setSeriousChecked(!seriousChecked)}
                    className="w-4 h-4 text-gray-600 focus:ring-gray-400"
                />
                <span className="text-gray-700">Serious</span>
                </label>
            </div>
            </fieldset>

            <div>
            <label className="block font-semibold mb-2 text-gray-800">Minimum rating: {minRating} ⭐</label>
            <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={minRating}
                onChange={(e) => setMinRating(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded appearance-none cursor-pointer"
            />
            </div>
        </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Skill Advertisements</h2>
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
            <Link key={item.id} to={`/skills/${item.id}`} className="block">
                <div className="border border-gray-300 rounded p-4 hover:border-gray-400 bg-white">
                    <SkillAdvertisement skill={item} />
                </div>
            </Link>
            ))}
        </div>
    </div>
    );

};

export default SkillList;