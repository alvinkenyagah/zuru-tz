import images from "../assets/images";

export const tours = [
    {
      id: "skydiving-nungwi",
      name: "Skydiving in Nungwi",
      category: "Adventure",
      location: "Nungwi/Kendwa (Northern Part)",
      description: "Experience the thrill of skydiving over the beautiful coast of Zanzibar. This adrenaline-packed activity gives you a bird's eye view of the stunning Nungwi coastline.",
      price: {
        base: 445,
        children: {
          upTo5: "Not allowed",
          upTo12: "Not allowed"
        }
      },
      duration: "Half day",
      image: images.skydivingnungwi, 
      featured: true
    },
    {
      id: "deep-sea-fishing-nungwi",
      name: "Deep Sea Fishing - Nungwi",
      category: "Water Activities",
      location: "Nungwi/Kendwa (Northern Part)",
      description: "Enjoy deep sea fishing in the pristine waters off Nungwi. Choose from different boats and durations for an unforgettable fishing experience.",
      options: [
        { name: "SuliSuli boat HALF DAY", price: 500 },
        { name: "SuliSuli boat FULL DAY", price: 700 },
        { name: "Ocean Spirit HALF DAY", price: 650 },
        { name: "Ocean Spirit FULL DAY", price: 900 },
        { name: "Baloo HALF DAY", price: 800 },
        { name: "Baloo FULL DAY", price: 1000 },
        { name: "Pelegic One HALF DAY", price: 650 },
        { name: "Pelegic One FULL DAY", price: 950 }
      ],
      image: images.deepseafishingnungwi,
      note: "Prices are per boat (1 - 5 persons)"
    },
    {
      id: "quad-adventures",
      name: "Quad Adventures Tour",
      category: "Adventure",
      location: "Multiple locations",
      description: "Explore Zanzibar's landscapes on a thrilling quad bike adventure tour. The tour takes 3 hours and includes mineral water, fruits, drone video and a guide.",
      options: [
        { name: "From Town (Transfer Return)", price: 90 },
        { name: "From Pwani Mchangani/Matemwe", price: 60 },
        { name: "From South (Transfer Return)", price: 120 },
        { name: "From Nungwi/Kendwa", price: "Free" }
      ],
      pricing: "One Quad - $110 (1 person)/ One Quad $130 (2 persons)",
      duration: "3 hours",
      image: images.quadadventures
    },
    {
      id: "sunset-cruise",
      name: "Sunset Cruise",
      category: "Water Activities",
      location: "Multiple locations",
      description: "Experience the beauty of a Zanzibar sunset from the water. This peaceful cruise offers breathtaking views as the sun dips below the horizon.",
      price: {
        fromTown: [90, 75, 60, 50, 40, 30],
        fromResort: [130, 95, 80, 70, 60, 50],
        children: {
          upTo5: 5,
          upTo12: 10
        }
      },
      duration: "2 hours",
      image: images.sunsetcruise,
      featured: true
    },
    {
      id: "natural-aquarium",
      name: "Natural Aquarium (Swimming with Sea Turtles)",
      category: "Water Activities",
      location: "Northern Part",
      description: "Swim with sea turtles in their natural habitat at the turtle conservation aquarium. An amazing experience for all ages.",
      price: {
        fromTown: [100, 55, 40, 33, 28, 25],
        children: {
          upTo5: 5,
          upTo12: 10
        }
      },
      duration: "Half day",
      image: images.naturalaquarium,
    },
    {
      id: "mnemba-snorkeling",
      name: "Mnemba Snorkeling",
      category: "Water Activities",
      location: "Multiple locations",
      description: "Snorkel in the crystal-clear waters around Mnemba Island, known for its vibrant coral reefs and diverse marine life.",
      price: {
        fromTown: [125, 81, 70, 61, 56, 50],
        fromPwaniMatemwe: [113, 75, 66, 58, 54, 40],
        fromMichamvi: [145, 91, 76, 66, 60, 55],
        fromNungwi: [125, 81, 70, 61, 56, 52],
        children: {
          upTo5: 8,
          upTo12: 27
        }
      },
      duration: "Half day",
      image: images.mnembasnorkeling,
    },
    {
      id: "jozani-forest",
      name: "Jozani Forest",
      category: "Nature",
      location: "Southern Part",
      description: "Explore the Jozani Forest, home to the rare Red Colobus monkeys and other wildlife. Walk through the mangrove boardwalk and enjoy the natural scenery.",
      price: {
        fromTown: [88, 55, 45, 39, 36, 34],
        fromNungwiMatemwe: [120, 70, 55, 47, 42, 39],
        fromPajeJambiani: [76, 50, 41, 37, 34, 32],
        fromPwaniKiwengwa: [88, 55, 45, 39, 36, 34],
        children: {
          upTo5: 0,
          upTo12: 15
        }
      },
      duration: "Half day",
      image: images.jozaniforest,
    },
    {
      id: "butterfly-center",
      name: "Butterfly Center",
      category: "Nature",
      location: "Southern Part",
      description: "Visit the Zanzibar Butterfly Centre and marvel at the colorful butterflies native to the island. A perfect activity for nature lovers and families.",
      price: {
        fromTown: [100, 57, 42, 35, 30, 27],
        fromNungwiMatemwe: [120, 70, 55, 47, 42, 39],
        fromPajeJambiani: [76, 50, 41, 37, 34, 32],
        fromPwaniKiwengwa: [88, 55, 45, 39, 36, 34],
        children: {
          upTo5: 0,
          upTo12: 12
        }
      },
      duration: "Half day",
      image: images.butterflycenter,
    },
    {
      id: "stone-town-tour",
      name: "Stone Town City Tour",
      category: "Cultural",
      location: "Western Part",
      description: "Discover the rich history and culture of Zanzibar's Stone Town, a UNESCO World Heritage site with fascinating architecture and stories.",
      price: {
        fromTown: [45, 35, 31, 30, 29, 28],
        fromResort: [100, 80, 65, 55, 50, 45],
        children: {
          upTo5: 0,
          upTo12: 10
        },
        group10plus: 25
      },
      duration: "3-4 hours",
      image: images.stonetowntour,
      featured: true
    },
    {
      id: "prison-island",
      name: "Prison Island Tour",
      category: "Cultural",
      location: "Western Part",
      description: "Visit the historic Prison Island, home to giant tortoises and beautiful beaches. Learn about its history and enjoy swimming and snorkeling.",
      price: {
        fromTown: [75, 51, 46, 41, 39, 36],
        fromResort: [115, 71, 60, 51, 47, 45],
        children: {
          upTo5: 0,
          upTo12: 14
        },
        group10plus: 30
      },
      duration: "Half day",
      image: images.prisonisland
    },
    {
      id: "nakupenda-sandbank",
      name: "Nakupenda Sandbank Tour",
      category: "Water Activities",
      location: "Western Part",
      description: "Visit the pristine Nakupenda sandbank that appears during low tide. Swim in the crystal clear waters and enjoy a seafood lunch on the beach.",
      price: {
        fromTown: [88, 60, 55, 50, 45, 40],
        fromResort: [128, 75, 65, 60, 55, 50],
        children: {
          upTo5: 0,
          upTo12: 20
        }
      },
      duration: "Full day",
      image: images.nakupendasandbank,
      featured: true
    },
    {
      id: "spice-tour",
      name: "Spice Tour",
      category: "Cultural",
      location: "Western Part",
      description: "Discover why Zanzibar is known as the 'Spice Island' with a tour of local spice farms. Learn about and taste various spices and tropical fruits.",
      price: {
        fromTown: [65, 50, 45, 40, 35, 25],
        fromTownWithCooking: [75, 60, 55, 50, 45, 35],
        fromResort: [100, 60, 55, 45, 35, 30],
        fromResortWithCooking: [110, 70, 65, 55, 45, 40],
        children: {
          upTo5: 0,
          upTo12: 10
        },
        group10plus: 20
      },
      duration: "Half day",
      image: images.spicetour
    },
    {
      id: "safari-blue",
      name: "Safari Blue (Original with Alcohol)",
      category: "Water Activities",
      location: "Western Part",
      description: "The most popular boat trip in Zanzibar, offering snorkeling, sandbank visits, and a seafood beach lunch with alcoholic beverages.",
      price: {
        fromTown: [100, 78, 70, 65, 60, 55],
        fromResort: [140, 100, 85, 80, 75, 70],
        children: {
          upTo5: 5,
          upTo12: 25
        },
        group10plus: 50
      },
      duration: "Full day",
      image: images.safariblue,
      featured: true
    },
    {
      id: "sea-safari-local",
      name: "Sea Safari Local Shared Boat",
      category: "Water Activities",
      location: "Western Part",
      description: "Explore the beautiful waters around Zanzibar on a local shared boat. Enjoy snorkeling, sandbank visits, and local cuisine.",
      price: {
        fromTown: [70, 60, 50, 48, 40, 40],
        fromResort: [115, 75, 65, 55, 50, 45],
        children: {
          upTo5: 5,
          upTo12: 10
        },
        group10plus: 35
      },
      duration: "Full day",
      image: images.seasafarilocal
    },
    {
      id: "luxury-sea-safari",
      name: "Luxury Sea Safari Private By Tales",
      category: "Water Activities",
      location: "Western Part",
      description: "Experience the ultimate luxury sea safari with a private boat tour. Premium service, gourmet food, and exclusive locations.",
      price: {
        fromTown: [156, 102, 84, 83, 75, 80],
        fromResort: [201, 124, 99, 94, 84, 87],
        children: {
          upTo5: 5,
          upTo12: 20
        },
        group10plus: 70
      },
      duration: "Full day",
      image: images.luxuryseasafari
    }
  ];
  
  // Tour categories for filtering
  export const categories = [
    "Adventure",
    "Water Activities",
    "Nature",
    "Cultural"
  ];
  
  // Locations for filtering
  export const locations = [
    "Nungwi/Kendwa (Northern Part)",
    "Southern Part",
    "Western Part",
    "Multiple locations"
  ];
  
  // Extract featured tours
  export const featuredTours = tours.filter(tour => tour.featured);
  
  // Helper function to get tour by ID
  export const getTourById = (id) => {
    return tours.find(tour => tour.id === id);
  };