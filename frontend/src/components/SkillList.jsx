import { useState, useEffect } from "react";
import SkillAdvertisement from "./SkillAdvertisement";
import { Link } from 'react-router-dom';
import secureAxios from "../secureAxios";

function SkillList() {
    const [query, setQuery] = useState('');
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [showFilters, setShowFilters] = useState(false);
    const [minRating, setMinRating] = useState(3);
    const [easyChecked, setEasyChecked] = useState(true);
    const [mediumChecked, setMediumChecked] = useState(true);
    const [hardChecked, setHardChecked] = useState(true);
    const [seriousChecked, setSeriousChecked] = useState(true);
    const [page, setPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const pageSize = 20;  
    const totalPages = Math.ceil(totalCount / pageSize);

    const handleSearch = async () => {
        setLoading(true); 
        try {
            const response = await secureAxios.get(`/skills_search/`, {
                params: { query, page }
            });

            setSkills(response.data.results);
            setNextPage(response.data.next !== null);
            setPrevPage(response.data.previous !== null);
            setTotalCount(response.data.count);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        handleSearch();
    }, [page]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setPage(1);
            handleSearch();
        }
    };

    const renderPageButtons = () => {
        const buttons = [];
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(totalPages, page + 2);

        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => setPage(1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
                );
            }
        }

        for (let p = startPage; p <= endPage; p++) {
            buttons.push(
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        p === page ? 'bg-teal-500 text-white' : 'text-gray-700 hover:text-teal-600'
                    }`}
                >
                    {p}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => setPage(totalPages)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors"
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Search & Filters */}
            <div className="bg-white rounded-[6px] p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                    <button
                        onClick={() => {
                            setPage(1);
                            handleSearch();
                        }}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-[6px] font-medium transition-all duration-200"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-white hover:bg-gray-50 text-teal-500 hover:text-teal-600 border border-teal-500 hover:border-teal-600 px-6 py-3 rounded-[6px] font-medium transition-all duration-200"
                    >
                        Filter
                    </button>
                </div>

                {showFilters && (
                    <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
                        <fieldset className="mb-4">
                            <legend className="text-base font-medium mb-3 text-gray-900">Filter by difficulty</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'Easy', checked: easyChecked, setter: setEasyChecked },
                                    { label: 'Medium', checked: mediumChecked, setter: setMediumChecked },
                                    { label: 'Hard', checked: hardChecked, setter: setHardChecked },
                                    { label: 'Serious', checked: seriousChecked, setter: setSeriousChecked },
                                ].map(({ label, checked, setter }) => (
                                    <label
                                        key={label}
                                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-800"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() => setter(!checked)}
                                            className="w-4 h-4 accent-teal-500 text-teal-500 border-gray-300 rounded focus:ring-teal-400"
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2 text-gray-900">
                                Minimum rating: {minRating} ⭐
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                step="1"
                                value={minRating}
                                onChange={(e) => setMinRating(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-300 rounded appearance-none cursor-pointer accent-teal-500"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Skill List */}
            <div className="bg-white rounded-[6px] p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Skill Advertisements</h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-[6px]">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-500 border-solid mb-4"></div>
                        <p className="text-center text-gray-600">Loading skills...</p>
                    </div>
                ) : skills.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border border-gray-200 rounded-[6px]">
                        <p className="text-center text-gray-500 text-lg">No skills matched your search.</p>
                    </div>
                ) : (
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
                                    <div className="border border-gray-200 rounded-sm p-4 hover:border-gray-400 bg-white transition-colors duration-200">
                                        <SkillAdvertisement skill={item} />
                                    </div>
                                </Link>
                            ))}
                    </div>
                )}

                {/* Pagination */}
                {skills.length > 0 && (
                    <div className="flex items-center justify-center mt-8 gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={!prevPage}
                            className={`p-2 w-10 h-10 rounded-full font-medium transition-all duration-200 ${
                                prevPage 
                                    ? 'bg-teal-500 text-white hover:bg-teal-600' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            ←
                        </button>

                        {renderPageButtons()}

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={!nextPage}
                            className={`p-2 w-10 h-10 rounded-full font-medium transition-all duration-200 ${
                                nextPage 
                                    ? 'bg-teal-500 text-white hover:bg-teal-600' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SkillList;
