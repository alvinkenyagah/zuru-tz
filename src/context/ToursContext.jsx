import { createContext, useState, useContext } from 'react';
import { tours, categories, locations } from '../data/tours';

const ToursContext = createContext();

export const useToursContext = () => {
  return useContext(ToursContext);
};

export const ToursProvider = ({ children }) => {
  const [filteredTours, setFilteredTours] = useState(tours);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: 0,
    maxPrice: 1000,
    search: ''
  });

  const applyFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Apply filters to tours
    let result = [...tours];
    
    // Filter by category
    if (updatedFilters.category) {
      result = result.filter(tour => tour.category === updatedFilters.category);
    }
    
    // Filter by location
    if (updatedFilters.location) {
      result = result.filter(tour => tour.location === updatedFilters.location);
    }
    
    // Filter by price range
    result = result.filter(tour => {
      // Check base price if available
      if (tour.price && tour.price.base) {
        return tour.price.base >= updatedFilters.minPrice && tour.price.base <= updatedFilters.maxPrice;
      }
      
      // Check first option price if options available
      if (tour.options && tour.options.length > 0) {
        return tour.options[0].price >= updatedFilters.minPrice && tour.options[0].price <= updatedFilters.maxPrice;
      }
      
      // Check fromTown price if available
      if (tour.price && tour.price.fromTown && tour.price.fromTown.length > 0) {
        return tour.price.fromTown[0] >= updatedFilters.minPrice && tour.price.fromTown[0] <= updatedFilters.maxPrice;
      }
      
      return true;
    });
    
    // Filter by search text
    if (updatedFilters.search) {
      const searchLower = updatedFilters.search.toLowerCase();
      result = result.filter(tour => 
        tour.name.toLowerCase().includes(searchLower) || 
        tour.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTours(result);
  };

  const resetFilters = () => {
    const resetFiltersObj = {
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 1000,
      search: ''
    };
    setFilters(resetFiltersObj);
    setFilteredTours(tours);
  };

  const value = {
    allTours: tours,
    filteredTours,
    categories,
    locations,
    filters,
    applyFilters,
    resetFilters
  };

  return (
    <ToursContext.Provider value={value}>
      {children}
    </ToursContext.Provider>
  );
};