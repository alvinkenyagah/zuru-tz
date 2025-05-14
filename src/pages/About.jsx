import React from 'react';
import { Shield, Award, Users, Clock, Map, Target } from 'lucide-react';

const AboutUsPage = () => {

  // Company milestones
  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Zuru TZ began with three passionate entrepreneurs in a small office in Dar es Salaam.'
    },
    {
      year: '2020',
      title: 'First Major Partnership',
      description: 'Secured our first partnership with a major telecommunications provider in Tanzania.'
    },
    {
      year: '2022',
      title: 'Expanded Nationwide',
      description: 'Opened offices in Mwanza, Arusha, and Dodoma to serve clients across Tanzania.'
    },
    {
      year: '2023',
      title: 'Innovation Award',
      description: 'Recognized with the Tanzania Digital Innovation Award for our contributions to the tech ecosystem.'
    },
    {
      year: '2024',
      title: 'International Expansion',
      description: 'Begin serving clients in neighboring countries while maintaining our Tanzanian roots.'
    }
  ];

  // Core values
  const coreValues = [
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      title: 'Integrity',
      description: 'We operate with transparency and honesty in all our business dealings.'
    },
    {
      icon: <Award className="h-12 w-12 text-blue-600" />,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we create and deliver.'
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: 'Community',
      description: 'We believe in building and supporting strong communities across Tanzania.'
    },
    {
      icon: <Target className="h-12 w-12 text-blue-600" />,
      title: 'Innovation',
      description: 'We continuously seek new ways to solve problems and create value.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center md:text-left md:max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Zuru TZ</h1>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div id="our-story" className="max-w-6xl mx-auto px-4 py-16 md:py-24">


        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <div className="bg-blue-50 rounded-lg p-8 border-l-4 border-blue-600">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To provide innovative digital solutions that empower businesses and individuals in Tanzania to thrive in the digital age, contributing to the country's economic and social development.
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-8 border-l-4 border-indigo-600">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To be the leading technology partner for businesses in East Africa, recognized for excellence, innovation, and positive impact on communities.
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

      {/* Our Journey Timeline */}
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden md:block"></div>
          
          <div className="space-y-12 relative">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-8 items-center md:items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                  <div className={`bg-white p-6 rounded-lg shadow-md relative md:max-w-md ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="absolute top-6 -right-4 w-8 h-8 bg-blue-600 rounded-full border-4 border-white hidden md:block"></div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">{milestone.year}</h3>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-full md:w-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUsPage;