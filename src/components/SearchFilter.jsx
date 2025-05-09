import { useState, useEffect } from 'react';
import { useToursContext } from '../context/ToursContext';

const SearchFilter = () => {
  const { categories, locations, filters, applyFilters, resetFilters } = useToursContext();
  
  const [localFilters, setLocalFilters] = useState({
    category: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000,
    search: ''
  });

  // Sync with context filters when initializing
  useEffect(() => {
    setLocalFilters(filters);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters(localFilters);
  };

  const handleReset = (e) => {
    e.preventDefault();
    resetFilters();
    setLocalFilters({
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 1000,
      search: ''
    });
  };

  const formatPrice = (price) => {
    return '$' + price;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Search & Filter</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Search Input */}
        <div className="mb-4">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              name="search"
              value={localFilters.search}
              onChange={handleInputChange}
              placeholder="Search tours..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute right-3 top-2.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={localFilters.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Location Filter */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            id="location"
            name="location"
            value={localFilters.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        {/* Price Range */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label htmlFor="price-range" className="block text-sm font-medium text-gray-700">Price Range</label>
            <span className="text-sm text-gray-500">
              {formatPrice(localFilters.minPrice)} - {formatPrice(localFilters.maxPrice)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-xs text-gray-500 mb-1">Min Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                min="0"
                max={localFilters.maxPrice}
                value={localFilters.minPrice}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs text-gray-500 mb-1">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min={localFilters.minPrice}
                value={localFilters.maxPrice}
                onChange={handlePriceChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;