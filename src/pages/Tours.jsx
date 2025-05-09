import { useEffect } from 'react';
import { useToursContext } from '../context/ToursContext';
import TourCard from '../components/TourCard';
import SearchFilter from '../components/SearchFilter';

const Tours = () => {
  const { filteredTours, resetFilters } = useToursContext();
  
  // Reset filters when component mounts
  useEffect(() => {
    resetFilters();
  }, []);
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800">Explore Our Tours</h1>
          <p className="text-gray-600 mt-2">Discover the best activities and experiences in Zanzibar</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <SearchFilter />
          </div>
          
          {/* Tour listings */}
          <div className="lg:col-span-3">
            {filteredTours.length > 0 ? (
              <>
                <p className="text-gray-600 mb-4">{filteredTours.length} tours found</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map(tour => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No tours found</h3>
                <p className="text-gray-600 mb-4">Please try different search criteria or reset the filters.</p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;