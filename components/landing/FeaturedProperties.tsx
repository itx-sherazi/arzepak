const properties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    tag: "FOR SALE",
    tagColor: "bg-green-600",
    price: "PKR 2.5 Crore",
    title: "Modern 5 Marla House",
    location: "DHA Phase 6, Lahore",
    beds: 4,
    baths: 3,
    area: "5 Marla",
    type: "House",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
    tag: "FOR RENT",
    tagColor: "bg-blue-600",
    price: "PKR 80,000/mo",
    title: "Luxury 3-Bed Apartment",
    location: "Gulberg III, Lahore",
    beds: 3,
    baths: 2,
    area: "1800 sqft",
    type: "Apartment",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80",
    tag: "FOR SALE",
    tagColor: "bg-green-600",
    price: "PKR 4.8 Crore",
    title: "Elegant 10 Marla Bungalow",
    location: "Bahria Town, Rawalpindi",
    beds: 5,
    baths: 4,
    area: "10 Marla",
    type: "House",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    tag: "NEW PROJECT",
    tagColor: "bg-orange-500",
    price: "PKR 1.2 Crore",
    title: "Studio Apartment – City View",
    location: "Clifton, Karachi",
    beds: 1,
    baths: 1,
    area: "650 sqft",
    type: "Apartment",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    tag: "FOR SALE",
    tagColor: "bg-green-600",
    price: "PKR 7.5 Crore",
    title: "1 Kanal Farmhouse with Pool",
    location: "Bedian Road, Lahore",
    beds: 6,
    baths: 5,
    area: "1 Kanal",
    type: "Farmhouse",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&q=80",
    tag: "FOR RENT",
    tagColor: "bg-blue-600",
    price: "PKR 45,000/mo",
    title: "2-Bedroom Flat in F-10",
    location: "F-10 Markaz, Islamabad",
    beds: 2,
    baths: 2,
    area: "1200 sqft",
    type: "Apartment",
  },
];

function PropertyCard({ property }: { property: (typeof properties)[0] }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative overflow-hidden h-52">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className={`absolute top-3 left-3 ${property.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
          {property.tag}
        </span>
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow transition-colors">
          <svg className="w-4 h-4 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <div className="text-green-600 font-bold text-lg mb-1">{property.price}</div>
        <h3 className="text-gray-800 font-semibold text-base mb-1 truncate">{property.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-500 text-xs pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            {property.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProperties() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Featured Properties</h2>
            <p className="text-gray-500 mt-1 text-sm">Hand-picked listings for you</p>
          </div>
          <a href="#" className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 transition-colors">
            View All <span>→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
