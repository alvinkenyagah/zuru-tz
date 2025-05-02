import { useState, useEffect } from 'react';
import { Search, MapPin, Compass, Info, List } from 'lucide-react';
import './App.css'

// Tailwind color classes based on your color scheme
const colors = {
  primary: 'bg-amber-700', // Earthy tone (#A68A64)
  primaryText: 'text-amber-700',
  secondary: {
    green: 'bg-green-800', // Green (#38761D)
    blue: 'bg-blue-500',   // Blue (#4682B4)
  },
  secondaryText: {
    green: 'text-green-800',
    blue: 'text-blue-500',
  },
  accent: 'bg-orange-500',  // Orange (#FF8C00)
  accentText: 'text-orange-500',
  accentHover: 'hover:bg-orange-600',
};

// Mock API for tourist destinations with actual coordinates
const mockDestinations = [
  {
    id: 1,
    name: "Serengeti National Park",
    description: "Famous for its annual migration of wildebeest and exceptional game viewing opportunities. Home to the 'big five' and over 500 bird species.",
    coordinates: {
      lat: -2.3333,
      lng: 34.8333
    },
    type: "Nature",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 2,
    name: "Mount Kilimanjaro",
    description: "Africa's highest peak and one of the world's most accessible high summits. A challenging trek with incredible views and diverse ecosystems along the way.",
    coordinates: {
      lat: -3.0674,
      lng: 37.3556
    },
    type: "Adventure",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 3,
    name: "Zanzibar Beaches",
    description: "Pristine white sand beaches with crystal clear turquoise waters. Perfect for relaxation, water sports, and experiencing the unique Swahili culture.",
    coordinates: {
      lat: -6.1659,
      lng: 39.3621
    },
    type: "Beach",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 4,
    name: "Stone Town",
    description: "UNESCO World Heritage site with a fascinating maze of narrow alleyways, historic buildings, and vibrant markets reflecting Arabic, Persian, Indian and European influences.",
    coordinates: {
      lat: -6.1652,
      lng: 39.1886
    },
    type: "Cultural",
    imageUrl: "/api/placeholder/400/250"
  },
  {
    id: 5,
    name: "Ngorongoro Conservation Area",
    description: "Home to the spectacular Ngorongoro Crater, a collapsed volcano forming a natural enclosure for a wide variety of wildlife including lions, elephants, and rhinos.",
    coordinates: {
      lat: -3.2000,
      lng: 35.5000
    },
    type: "Nature",
    imageUrl: "/api/placeholder/400/250"
  }
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  // Convert to radians
  const toRad = value => value * Math.PI / 180;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Mock Gemini API response generation with real location context
const generateDescription = (destination, currentLocation) => {
  let distanceText = "in Tanzania";
  let directionText = "";
  
  if (currentLocation && destination.distance !== undefined) {
    distanceText = destination.distance < 1 ? 
      "right where you are now" : 
      `approximately ${destination.distance}km from your current location`;
      
    // Calculate if destination is north/south/east/west of user
    if (currentLocation.lat && currentLocation.lng && destination.coordinates) {
      const latDiff = destination.coordinates.lat - currentLocation.lat;
      const lngDiff = destination.coordinates.lng - currentLocation.lng;
      
      let direction = "";
      if (Math.abs(latDiff) > Math.abs(lngDiff)) {
        direction = latDiff > 0 ? "north" : "south";
      } else {
        direction = lngDiff > 0 ? "east" : "west";
      }
      
      directionText = ` to the ${direction} of your position`;
    }
  }
  
  let additionalText = "";
  switch(destination.type) {
    case "Nature":
      additionalText = "This is an excellent opportunity to experience Tanzania's incredible wildlife and natural beauty.";
      break;
    case "Adventure":
      additionalText = "Be sure to prepare adequately for the physical challenges and bring proper equipment for a safe and enjoyable experience.";
      break;
    case "Beach":
      additionalText = "Don't forget to pack sunscreen, swimming attire, and consider booking local water activities in advance.";
      break;
    case "Cultural":
      additionalText = "Consider hiring a local guide to fully appreciate the historical and cultural significance of this location.";
      break;
    default:
      additionalText = "Research the specific attractions before your visit to make the most of your experience.";
  }
  
  return `${destination.name} is a spectacular destination located ${distanceText}${directionText}. It's renowned for its ${destination.type.toLowerCase()} attractions and is highly recommended for visitors exploring Tanzania. ${additionalText}`;
};

// Get address from coordinates using OSM
const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'TanzaniaTravelsApp'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get address information');
    }
    
    const data = await response.json();
    return {
      fullAddress: data.display_name,
      street: data.address.road || null,
      houseNumber: data.address.house_number || null,
      city: data.address.city || data.address.town || data.address.village || null,
      state: data.address.state || null,
      country: data.address.country || null,
      postcode: data.address.postcode || null
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Main App Component
export default function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(50);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const maxRadius = 100; // Define the maximum radius value

  // Automatically get location on mount
  useEffect(() => {
    let isMounted = true;
    
    const geoSuccess = async (position) => {
      if (!isMounted) return;
      
      const { latitude, longitude } = position.coords;
      
      try {
        // Get address details from coordinates
        const addressInfo = await getAddressFromCoords(latitude, longitude);
        
        // Update location state with coordinates and address
        const locationData = {
          lat: latitude,
          lng: longitude,
          name: addressInfo ? 
            (addressInfo.street ? 
              `${addressInfo.street}${addressInfo.houseNumber ? ' ' + addressInfo.houseNumber : ''}, ${addressInfo.city || ''}` 
              : addressInfo.fullAddress) 
            : "Unknown location"
        };
        
        setCurrentLocation(locationData);
        setIsLoadingLocation(false);
        
        // Optionally update search query with the location name
        if (addressInfo) {
          setSearchQuery(locationData.name);
        }
      } catch (error) {
        console.error('Error processing location:', error);
        setCurrentLocation({
          lat: latitude,
          lng: longitude,
          name: "Location found, but address details unavailable"
        });
        setIsLoadingLocation(false);
      }
    };
  
    const geoError = (error) => {
      if (!isMounted) return;
      
      console.error('Geolocation error:', error);
      
      // Fallback to default location
      setCurrentLocation({
        lat: -6.369,
        lng: 34.888,
        name: "Dodoma, Tanzania (Default - actual location unavailable)"
      });
      setIsLoadingLocation(false);
    };
  
    // Check if geolocation is supported
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        geoSuccess,
        geoError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      setCurrentLocation({
        lat: -6.369,
        lng: 34.888,
        name: "Dodoma, Tanzania (Default - geolocation not supported)"
      });
    }
  
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to get current location using geolocation API
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const addressInfo = await getAddressFromCoords(latitude, longitude);
            
            resolve({
              lat: latitude,
              lng: longitude,
              name: addressInfo ? 
                (addressInfo.street ? 
                  `${addressInfo.street}${addressInfo.houseNumber ? ' ' + addressInfo.houseNumber : ''}, ${addressInfo.city || ''}` 
                  : addressInfo.fullAddress) 
                : "Unknown location"
            });
          } catch (error) {
            console.error('Error getting address:', error);
            resolve({
              lat: latitude,
              lng: longitude,
              name: "Location found, but address details unavailable"
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  // Simulate fetching destinations
  const fetchDestinations = (location) => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        // Calculate distances for all destinations
        const destinationsWithDistance = mockDestinations.map(dest => {
          let distance = null;
          
          if (location && location.lat && location.lng) {
            distance = calculateDistance(
              location.lat, 
              location.lng, 
              dest.coordinates.lat, 
              dest.coordinates.lng
            );
          } else {
            // If no location, set a placeholder distance from Tanzania's center
            distance = calculateDistance(
              -6.369, // Approximate center of Tanzania
              34.888,
              dest.coordinates.lat, 
              dest.coordinates.lng
            );
          }
          
          return {
            ...dest,
            distance
          };
        });
        
        // Sort by distance (closest first)
        destinationsWithDistance.sort((a, b) => a.distance - b.distance);
        
        // If radius is max or showAllDestinations is true, show all destinations regardless of location
        if (radius === maxRadius || showAllDestinations) {
          setDestinations(destinationsWithDistance);
        } else if (!location) {
          // No location and not showing all - show error or empty
          setError("No location set. Please enter a location, use your current location, or set radius to maximum to see all destinations.");
          setDestinations([]);
        } else {
          // Filter based on radius
          const filtered = destinationsWithDistance.filter(dest => dest.distance <= radius);
          setDestinations(filtered);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to fetch destinations. Please try again.");
        setLoading(false);
      }
    }, 1000);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, we would geocode the search query
      const searchLocation = { 
        lat: -6.369, 
        lng: 34.888, 
        name: searchQuery 
      };
      setCurrentLocation(searchLocation);
      setShowAllDestinations(false);
      fetchDestinations(searchLocation);
    }
  };

  // Handle getting current location
  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setSearchQuery(location.name);
      setShowAllDestinations(false);
      fetchDestinations(location);
      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Failed to get location:', error);
      setError("Unable to access your location. Please check your device permissions.");
      setIsLoadingLocation(false);
      
      // Fallback to default
      const defaultLocation = { 
        lat: -6.369, 
        lng: 34.888, 
        name: "Dodoma, Tanzania (Default)" 
      };
      setCurrentLocation(defaultLocation);
      setSearchQuery(defaultLocation.name);
    }
  };

  // Handle showing all destinations
  const handleShowAllDestinations = () => {
    setShowAllDestinations(true);
    fetchDestinations(currentLocation);
  };

  // Handle selecting a destination
  const handleSelectDestination = (destination) => {
    setSelectedDestination(destination);
    // Generate description based on the destination and current location
    const description = generateDescription(destination, currentLocation);
    setGeneratedDescription(description);
  };

  // Check if radius is at maximum
  const isRadiusMax = radius === maxRadius;

  // Effect to update show all destinations when radius changes to max
  useEffect(() => {
    if (radius === maxRadius) {
      setShowAllDestinations(true);
    }
  }, [radius, maxRadius]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className={`${colors.primary} text-white p-4 shadow-md`}>
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Compass className="mr-2" /> Tanzania Travels
          </h1>
          <div className="text-sm">
            {currentLocation ? (
              <div className="flex items-center">
                <MapPin className="mr-1" size={16} />
                <span>{currentLocation.name}</span>
              </div>
            ) : (
              <span>Location not set</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Search Section */}
        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Find Tourist Destinations</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button
                  onClick={handleSearch}
                  className={`${colors.accent} text-white p-3 rounded-r-lg ${colors.accentHover} transition duration-200`}
                >
                  <Search size={20} />
                </button>
              </div>
            </div>
            
            {/* Current Location Button */}
            <button
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className={`${colors.secondary.blue} text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center`}
            >
              {isLoadingLocation ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2" size={20} /> Use My Location
                </>
              )}
            </button>
          </div>
          
          {/* Radius Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Radius: {radius} km {isRadiusMax && "(Maximum - All Destinations Shown)"}
            </label>
            <input
              type="range"
              min="10"
              max={maxRadius}
              step="5"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10km</span>
              <span>50km</span>
              <span>{maxRadius}km</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Action Button */}
            <button
              onClick={() => fetchDestinations(currentLocation)}
              className={`${colors.accent} text-white py-3 px-6 rounded-lg ${colors.accentHover} transition duration-200 flex-1`}
            >
              Find Destinations
            </button>
            
            {/* Show All Destinations button (visible when no location or radius not at max) */}
            {(!currentLocation || !isRadiusMax) && (
              <button
                onClick={handleShowAllDestinations}
                className={`${colors.secondary.green} text-white py-3 px-6 rounded-lg hover:bg-green-900 transition duration-200 flex items-center justify-center`}
              >
                <List className="mr-2" size={20} /> Show All Destinations
              </button>
            )}
          </div>
          
          {!currentLocation && showAllDestinations && (
            <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded">
              <p className="text-sm">Showing all destinations sorted by distance from central Tanzania.</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Destinations List */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Tourist Destinations
              {destinations.length > 0 && ` (${destinations.length})`}
              {showAllDestinations && !currentLocation && " - Sorted by Location"}
            </h2>
            
            {loading && (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {!loading && !error && destinations.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-8 rounded text-center">
                <Info className="mx-auto mb-2" size={32} />
                <p>No destinations found. Try adjusting your search radius or location.</p>
                <button
                  onClick={handleShowAllDestinations}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                >
                  Show All Available Destinations
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destinations.map(destination => (
                <div 
                  key={destination.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${destination.id === selectedDestination?.id ? 'border-orange-500' : 'border-transparent'} cursor-pointer hover:shadow-lg transition duration-200`}
                  onClick={() => handleSelectDestination(destination)}
                >
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{destination.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${destination.type === 'Nature' ? 'bg-green-100 text-green-800' : destination.type === 'Beach' ? 'bg-blue-100 text-blue-800' : destination.type === 'Cultural' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                        {destination.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{destination.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center text-sm text-gray-500">
                        <MapPin size={16} className="mr-1" /> 
                        {destination.distance !== null 
                          ? `${destination.distance} km away` 
                          : "Distance unknown"}
                      </span>
                      <button 
                        className={`${colors.accentText} text-sm font-medium hover:underline`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDestination(destination);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Details Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Destination Details</h2>
            
            {selectedDestination ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={selectedDestination.imageUrl} 
                  alt={selectedDestination.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{selectedDestination.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDestination.type === 'Nature' ? 'bg-green-100 text-green-800' : selectedDestination.type === 'Beach' ? 'bg-blue-100 text-blue-800' : selectedDestination.type === 'Cultural' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                      {selectedDestination.type}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <MapPin size={14} className="mr-1" /> 
                      {selectedDestination.distance !== null 
                        ? `${selectedDestination.distance} km away` 
                        : "Distance unknown"}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-2">Description</h4>
                    <p className="text-gray-700">{selectedDestination.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">AI Generated Information</h4>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{generatedDescription}</p>
                      <p className="text-xs text-gray-500 mt-2">Generated by AI</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-8 rounded text-center h-64 flex flex-col items-center justify-center">
                <Info className="mb-2" size={32} />
                <p>Select a destination to view details and AI-generated description</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${colors.primary} text-white p-4 mt-8`}>
        <div className="container mx-auto text-center">
          <p>© 2025 Zuru Tanzania - Discover the beauty of Tanzania</p>
        </div>
      </footer>
    </div>
  );
}