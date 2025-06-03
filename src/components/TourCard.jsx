import { Link } from 'react-router-dom';

const TourCard = ({ tour }) => {
  // Helper function to get the base price
  const getBasePrice = () => {
    if (tour.price?.base) {
      return tour.price.base;
    } else if (tour.options && tour.options.length > 0) {
      return tour.options[0].price;
    } else if (tour.price?.fromTown && tour.price.fromTown.length > 0) {
      return tour.price.fromTown[0];
    } else {
      return 'Contact for price';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48">
        <img 
          src={tour.image || "/src/assets/images/tour-placeholder.jpg"} 
          alt={tour.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/src/assets/images/tour-placeholder.jpg";
          }}
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
          {tour.category}
        </div>
        {tour.featured && (
          <div className="absolute top-0 left-0 bg-yellow-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">{tour.name}</h3>
        
        <div className="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-gray-700">{tour.location}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-700">{tour.duration || "Variable"}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <p className="text-blue-600 font-bold text-lg">
              ${typeof getBasePrice() === 'number' ? getBasePrice().toFixed(2) : getBasePrice()}
            </p>
          </div>
          
          <Link
            to={`/tours/${tour.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;