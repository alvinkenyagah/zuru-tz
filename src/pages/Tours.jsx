import { useEffect, useState, useCallback } from 'react';
import { useToursContext } from '../context/ToursContext';
import TourCard from '../components/TourCard';
import SearchFilter from '../components/SearchFilter';

const Tours = () => {
  const { filteredTours, resetFilters } = useToursContext();
  
  // Responsive viewport state
  const [isMobile, setIsMobile] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [toursPerPage, setToursPerPage] = useState(6);
  
  // Check if mobile view and update state
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
    setToursPerPage(window.innerWidth < 768 ? 3 : 6);
  }, []);
  
  // Reset filters and pagination when component mounts, and setup responsive listener
  useEffect(() => {
    resetFilters();
    setCurrentPage(1);
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, [checkMobile]);
  
  // Get current tours
  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Next and previous page functions
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full md:w-auto">
                    <p className="text-gray-600 mb-2 md:mb-0">{filteredTours.length} tours found</p>
                    <p className="text-gray-600 md:ml-4">
                      Showing {indexOfFirstTour + 1}-{Math.min(indexOfLastTour, filteredTours.length)} of {filteredTours.length}
                    </p>
                  </div>
                  
                  {/* Mobile pagination at top */}
                  {isMobile && totalPages > 1 && (
                    <div className="flex justify-center w-full mt-3 mb-4">
                      <nav className="inline-flex rounded-md shadow">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Prev
                        </button>
                        
                        {/* Mobile pagination (just shows current/total) */}
                        <span className="relative inline-flex items-center px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          {currentPage} / {totalPages}
                        </span>
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentTours.map(tour => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
                
                {/* Desktop pagination at bottom */}
                {(!isMobile && totalPages > 1) && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      <div className="flex">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(num => 
                            num === 1 || 
                            num === totalPages || 
                            (num >= currentPage - 1 && num <= currentPage + 1)
                          )
                          .map((number, index, array) => {
                            // Add ellipsis where needed
                            if (index > 0 && array[index - 1] !== number - 1) {
                              return (
                                <span key={`ellipsis-${number}`}>
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                  <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                      currentPage === number
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {number}
                                  </button>
                                </span>
                              );
                            }
                            return (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                  currentPage === number
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {number}
                              </button>
                            );
                          })}
                      </div>
                      
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No tours found</h3>
                <p className="text-gray-600 mb-4">Please try different search criteria or reset the filters.</p>
                <button
                  onClick={() => {
                    resetFilters();
                    setCurrentPage(1);
                  }}
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