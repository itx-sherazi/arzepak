const cities = [
  {
    name: "Lahore",
    listings: "420,000+",
    image: "https://images.unsplash.com/photo-1609012230000-a5b534e89f8f?w=500&q=80",
  },
  {
    name: "Karachi",
    listings: "380,000+",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&q=80",
  },
  {
    name: "Islamabad",
    listings: "220,000+",
    image: "https://images.unsplash.com/photo-1620573851934-b3b3a2d1fdc0?w=500&q=80",
  },
  {
    name: "Rawalpindi",
    listings: "175,000+",
    image: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=500&q=80",
  },
];

export default function PopularCities() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Popular Cities</h2>
          <p className="text-gray-500 mt-2 text-sm">Explore properties in top cities of Pakistan</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cities.map((city) => (
            <a
              key={city.name}
              href="#"
              className="group relative rounded-2xl overflow-hidden h-56 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-bold">{city.name}</h3>
                <p className="text-green-300 text-sm font-medium">{city.listings} listings</p>
              </div>
              <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
