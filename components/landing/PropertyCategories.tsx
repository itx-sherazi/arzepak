import { Home, Building2, LandPlot, Store, Trees, Bed } from "lucide-react";

const categories = [
  {
    icon: <Home className="w-8 h-8 md:w-10 md:h-10" />,
    label: "Houses",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: <Building2 className="w-8 h-8 md:w-10 md:h-10" />,
    label: "Apartments",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: <LandPlot className="w-8 h-8 md:w-10 md:h-10" />,
    label: "Plots",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: <Store className="w-8 h-8 md:w-10 md:h-10" />,
    label: "Commercial",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: <Trees className="w-8 h-8 md:w-10 md:h-10" />,
    label: "Farmhouse",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: <Bed className="w-8 h-8 md:w-10 md:h-10" />,
    label: "Rooms",
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
];

export default function PropertyCategories() {
  return (
    <section className="py-10 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase mb-4">
            Explore Categories
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight text-center">
            Browse by Property Type
          </h2>
          <div className="w-20 h-1.5 bg-green-500 mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={`/properties?type=${cat.label.toUpperCase()}`}
              className="group flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`p-5 rounded-2xl ${cat.bgColor} ${cat.color} group-hover:scale-110 transition-transform duration-500 mb-6 shadow-sm group-hover:shadow-md`}>
                {cat.icon}
              </div>
              <div className="font-extrabold text-gray-800 text-base md:text-lg tracking-tight group-hover:text-green-600 transition-colors">
                {cat.label}
              </div>
              <div className="w-0 h-1 bg-green-500 group-hover:w-12 mt-2 transition-all duration-500 rounded-full" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
