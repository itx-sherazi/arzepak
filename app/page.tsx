import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PropertyCategories from "@/components/landing/PropertyCategories";
import FeaturedProperties from "@/components/landing/FeaturedProperties";
// import PopularCities from "@/components/landing/PopularCities";
import NewProjects from "@/components/landing/NewProjects";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "arzepak - Pakistan's #1 Real Estate Portal",
  description: "Search properties for sale and rent across Pakistan. Find houses, apartments, plots, and commercial properties.",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <Hero />
      <PropertyCategories />
      <FeaturedProperties />
      {/* <PopularCities /> */}
      <NewProjects />
      <WhyChooseUs />
      <Newsletter />
     
    </main>
  );
}
