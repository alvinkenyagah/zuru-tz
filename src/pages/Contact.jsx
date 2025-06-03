import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tours, getTourById } from '../data/tours';

const TourCard = ({ tour }) => {
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img 
          src={tour.image || "/src/assets/images/tour-placeholder.jpg"} 
          alt={tour.name} 
          className="w-full h-full object-cover"
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
        
        <p className="text-gray-600 text-sm mb-4">
          {tour.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">From</span>
            <p className="text-blue-600 font-bold text-lg">
              ${typeof getBasePrice() === 'number' ? getBasePrice().toFixed(2) : getBasePrice()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingPage = () => {

      useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const { tourId } = useParams();
  const navigate = useNavigate();
  const [selectedTour, setSelectedTour] = useState(null);
  const [formData, setFormData] = useState({
    tour: '',
    option: '',
    pickup: '',
    fullName: '',
    email: '',
    phone: '',
    date: '',
    adults: 1,
    children5: 0,
    children12: 0,
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    if (tourId) {
      const tour = getTourById(tourId);
      if (tour) {
        setSelectedTour(tour);
        setFormData(prev => ({ ...prev, tour: tour.id }));
      }
    }
  }, [tourId]);

  const calculatePrice = () => {
    if (!selectedTour) return 0;

    const adults = parseInt(formData.adults) || 1;
    const children5 = parseInt(formData.children5) || 0;
    const children12 = parseInt(formData.children12) || 0;
    let basePrice = 0;
    let childPrice5 = 0;
    let childPrice12 = 0;

    // Calculate base price based on tour structure
    if (selectedTour.price?.base) {
      basePrice = selectedTour.price.base * adults;
    } else if (selectedTour.options && formData.option) {
      const selectedOption = selectedTour.options.find(opt => opt.name === formData.option);
      if (selectedOption) {
        basePrice = selectedOption.price;
      }
    } else if (selectedTour.price?.fromTown) {
      const priceIndex = Math.min(adults - 1, selectedTour.price.fromTown.length - 1);
      basePrice = selectedTour.price.fromTown[priceIndex] * adults;
    }

    // Add children prices
    if (selectedTour.price?.children) {
      if (selectedTour.price.children.upTo5 && selectedTour.price.children.upTo5 !== "Not allowed") {
        childPrice5 = selectedTour.price.children.upTo5 * children5;
      }
      if (selectedTour.price.children.upTo12 && selectedTour.price.children.upTo12 !== "Not allowed") {
        childPrice12 = selectedTour.price.children.upTo12 * children12;
      }
    }

    return basePrice + childPrice5 + childPrice12;
  };

  useEffect(() => {
    setCalculatedPrice(calculatePrice());
  }, [selectedTour, formData.adults, formData.children5, formData.children12, formData.option]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTourChange = (e) => {
    const tourId = e.target.value;
    const tour = getTourById(tourId);
    setSelectedTour(tour);
    setFormData(prev => ({
      ...prev,
      tour: tourId,
      option: '',
      pickup: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const tourDetails = selectedTour ? selectedTour.name : 'Not selected';
    const totalPrice = calculatedPrice;

    const submissionData = {
      access_key: "YOUR_WEB3FORMS_ACCESS_KEY", // Replace with your actual Web3Forms access key
      subject: `Tour Booking Request - ${tourDetails}`,
      tour_name: tourDetails,
      tour_option: formData.option || 'Standard',
      pickup_location: formData.pickup,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      adults: formData.adults,
      children_5: formData.children5,
      children_12: formData.children12,
      total_price: `$${totalPrice.toFixed(2)}`,
      special_requests: formData.specialRequests,
      booking_time: new Date().toISOString()
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          tour: '',
          option: '',
          pickup: '',
          fullName: '',
          email: '',
          phone: '',
          date: '',
          adults: 1,
          children5: 0,
          children12: 0,
          specialRequests: ''
        });
        setSelectedTour(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Adventure</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to explore Zanzibar? Fill out the form below to book your perfect tour experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800">Your booking request has been submitted successfully! We'll contact you soon.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-800">There was an error submitting your booking. Please try again.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tour Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Tour *
                    </label>
                    <select
                      name="tour"
                      value={formData.tour}
                      onChange={handleTourChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a tour...</option>
                      {tours.map(tour => (
                        <option key={tour.id} value={tour.id}>
                          {tour.name} - {tour.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTour?.options && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tour Option *
                      </label>
                      <select
                        name="option"
                        value={formData.option}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select option...</option>
                        {selectedTour.options.map((option, index) => (
                          <option key={index} value={option.name}>
                            {option.name} - ${option.price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedTour?.price?.fromTown && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location *
                      </label>
                      <select
                        name="pickup"
                        value={formData.pickup}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select pickup location...</option>
                        <option value="town">From Town</option>
                        {selectedTour.price.fromResort && <option value="resort">From Resort</option>}
                        {selectedTour.price.fromPwaniMatemwe && <option value="pwani">From Pwani/Matemwe</option>}
                        {selectedTour.price.fromMichamvi && <option value="michamvi">From Michamvi</option>}
                        {selectedTour.price.fromNungwi && <option value="nungwi">From Nungwi</option>}
                        {selectedTour.price.fromPajeJambiani && <option value="paje">From Paje/Jambiani</option>}
                        {selectedTour.price.fromPwaniKiwengwa && <option value="kiwengwa">From Pwani/Kiwengwa</option>}
                        {selectedTour.price.fromNungwiMatemwe && <option value="nungwimatemwe">From Nungwi/Matemwe</option>}
                      </select>
                    </div>
                  )}
                </div>

                {/* Personal Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Group Size */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Size</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adults *
                      </label>
                      <input
                        type="number"
                        name="adults"
                        value={formData.adults}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Children (0-5)
                      </label>
                      <input
                        type="number"
                        name="children5"
                        value={formData.children5}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        disabled={selectedTour?.price?.children?.upTo5 === "Not allowed"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Children (6-12)
                      </label>
                      <input
                        type="number"
                        name="children12"
                        value={formData.children12}
                        onChange={handleInputChange}
                        min="0"
                        max="10"
                        disabled={selectedTour?.price?.children?.upTo12 === "Not allowed"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests or Notes
                  </label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedTour}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Tour Preview */}
            {selectedTour && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Tour</h3>
                <TourCard tour={selectedTour} />
              </div>
            )}

            {/* Price Summary */}
            {selectedTour && calculatedPrice > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Adults ({formData.adults})</span>
                    <span>${(calculatedPrice - (selectedTour.price?.children?.upTo5 || 0) * formData.children5 - (selectedTour.price?.children?.upTo12 || 0) * formData.children12).toFixed(2)}</span>
                  </div>
                  {formData.children5 > 0 && (
                    <div className="flex justify-between">
                      <span>Children 0-5 ({formData.children5})</span>
                      <span>${((selectedTour.price?.children?.upTo5 || 0) * formData.children5).toFixed(2)}</span>
                    </div>
                  )}
                  {formData.children12 > 0 && (
                    <div className="flex justify-between">
                      <span>Children 6-12 ({formData.children12})</span>
                      <span>${((selectedTour.price?.children?.upTo12 || 0) * formData.children12).toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${calculatedPrice.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  * Final price may vary based on specific requirements and availability
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">+255 XXX XXX XXX</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">info@yourtours.com</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Our team is available 24/7 to help you plan your perfect Zanzibar adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;