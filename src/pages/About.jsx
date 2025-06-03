import { useEffect } from 'react';
import { Globe, HeartHandshake, Leaf, Star } from "lucide-react";
import images from '../assets/images';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Core values
  const coreValues = [
    {
      icon: <Globe className="h-12 w-12 text-blue-600" />,
      title: 'Authenticity',
      description: `We offer real, immersive experiences that celebrate Zanzibar's culture, history, and people.`,
    },
    {
      icon: <Star className="h-12 w-12 text-blue-600" />,
      title: 'Excellence',
      description: 'We are committed to delivering high-quality service and unforgettable moments on every journey.',
    },
    {
      icon: <HeartHandshake className="h-12 w-12 text-blue-600" />,
      title: 'Community Empowerment',
      description: 'We uplift local guides, artisans, and businesses to ensure tourism benefits everyone.',
    },
    {
      icon: <Leaf className="h-12 w-12 text-blue-600" />,
      title: 'Sustainability',
      description: 'We operate with care for the environment and local heritage, promoting responsible travel.',
    }
  ];

  return (
    <>

          {/* Hero Section */}
      <section className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img className="w-full h-full object-cover opacity-40" src={images.naturalaquarium} alt="Zanzibar Beach" loading="lazy" />
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="text-xl">Learn more about us.</p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        {/* Our Story Section */}
        <div id="our-story" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-8 border-l-4 border-blue-600">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To create unforgettable travel experiences that connect people with the beauty, culture, and spirit of Zanzibar and beyond—through safe, personalized, and sustainable tours that inspire wonder and respect for local communities
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-8 border-l-4 border-indigo-600">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be the leading tour company in East Africa, renowned for authentic adventures, exceptional service, and a positive impact on travelers, locals, and the environment.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These principles guide our work, shape our culture, and drive our interactions with clients, partners, and communities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {coreValues.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                  <div className="flex justify-center mb-6">
                    <div className="bg-blue-50 p-4 rounded-full">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 text-center mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-center">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;