import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTourById, tours } from '../data/tours';
import { useToursContext } from '../context/ToursContext';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useToursContext();
  
  // Fetch tour data when component mounts
  useEffect(() => {
    // Simulate API call with short timeout
    const fetchTour = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const tourData = getTourById(id);
          if (tourData) {
            setTour(tourData);
            // Set default option if tour has options
            if (tourData.options && tourData.options.length > 0) {
              setSelectedOption(tourData.options[0]);
            }
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error fetching tour data:', error);
        setLoading(false);
      }
    };
    
    fetchTour();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };
  
  const handleAddToCart = () => {
    if (tour) {
      const cartItem = {
        id: tour.id,
        name: tour.name,
        image: tour.image,
        quantity,
        option: selectedOption,
        price: selectedOption ? selectedOption.price : tour.price.base
      };
      
      addToCart(cartItem);
      // Show confirmation toast or message here
      alert('Tour added to cart!'); // Replace with a proper toast notification
    }
  };
  
  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price}` : price;
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Tour not found
  if (!tour) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">Sorry, the tour you are looking for does not exist.</p>
          <Link to="/tours" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-gray-600 text-sm">
          <Link to="/" className="hover:text-blue-600 transition-colors duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/tours" className="hover:text-blue-600 transition-colors duration-300">Tours</Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-800">{tour.name}</span>
        </nav>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tour Header */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={tour.image} 
              alt={tour.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-600 text-xs font-bold px-2 py-1 rounded-full mr-2">{tour.category}</span>
                  <span className="text-xs font-medium">{tour.location}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">{tour.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tour.duration}</span>
                  </div>
                  {tour.featured && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span>Featured</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tour Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tour Details */}
              <div className="lg:col-span-2">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Description</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">{tour.description}</p>
                  
                  {/* Tour Highlights */}
                  <div className="bg-blue-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Tour Highlights</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Explore {tour.location}</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Duration: {tour.duration}</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Category: {tour.category}</span>
                      </li>
                      {tour.note && (
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-600">{tour.note}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* What's Included */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">What's Included</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Professional guide</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Transportation</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Entrance fees</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Water</span>
                      </li>
                      {tour.category === "Water Activities" && (
                        <li className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">Snorkeling equipment</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* What to Bring */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">What to Bring</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Sun protection</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Comfortable clothing</span>
                      </li>
                      {tour.category === "Water Activities" && (
                        <>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600">Swimming clothes</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600">Towel</span>
                          </li>
                        </>
                      )}
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">Camera</span>
                      </li>
                    </ul>
                  </div>
                </section>
                
                {/* Tour Location */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Location</h2>
                  <div className="bg-gray-200 rounded-lg overflow-hidden h-64">
                    {/* Map would go here - showing placeholder */}
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-gray-600">{tour.location}</p>
                      </div>
                    </div>
                  </div>
                </section>
              
              </div>
              
              {/* Booking Section */}

            </div>
          </div>
        </div>
        
        {/* Similar Tours Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* We'll show other tours from the same category, limited to 3 */}
            {tours
              .filter(relatedTour => relatedTour.category === tour.category && relatedTour.id !== tour.id)
              .slice(0, 3)
              .map(relatedTour => (
                <div key={relatedTour.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/tours/${relatedTour.id}`}>
                    <div className="relative h-48">
                      <img 
                        src={relatedTour.image} 
                        alt={relatedTour.name} 
                        className="w-full h-full object-cover"
                      />
                      {relatedTour.featured && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {relatedTour.location}
                    </div>
                    
                    <Link to={`/tours/${relatedTour.id}`} className="block">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-300">{relatedTour.name}</h3>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">{relatedTour.duration}</span>
                      </div>
                      
                      <div className="font-bold text-blue-600">
                        {relatedTour.options ? 
                          `From ${Math.min(...relatedTour.options.map(option => option.price))}` : 
                          `${relatedTour.price.base}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TourDetail;