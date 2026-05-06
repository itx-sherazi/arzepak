import { Send, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  "Properties": [
    { label: "Houses for Sale", href: "/properties?purpose=SALE&type=HOUSE" },
    { label: "Plots for Sale", href: "/properties?purpose=SALE&type=PLOT" },
    { label: "Commercial Properties", href: "/properties?purpose=SALE&type=COMMERCIAL" },
    { label: "Properties for Rent", href: "/properties?purpose=RENT" },
    { label: "New Projects", href: "/new-projects" },
  ],
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Dealer Login", href: "/login" },
    { label: "Join as Dealer", href: "/dealer/register" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 pt-20 pb-10 border-t border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/logo.png" 
                alt="ArzePak Logo" 
                className="h-12 w-auto object-contain" 
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              Pakistan&apos;s leading real estate marketplace. We provide a platform for buying, renting and selling properties with complete transparency and trust.
            </p>
            
           
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="lg:col-span-1">
              <h4 className="text-gray-900 font-bold text-sm mb-6 uppercase tracking-widest">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-500 hover:text-[#16a34a] text-sm transition-all flex items-center group">
                      <span className="w-0 group-hover:w-2 h-[2px] bg-[#16a34a] mr-0 group-hover:mr-2 transition-all"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social & Contact Info */}
        <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex flex-wrap items-center justify-center gap-8">
             <div className="flex items-center gap-2 text-sm text-gray-600">
               <Phone size={16} className="text-[#16a34a]" />
               <span>+92 327 8699997</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-600">
               <Mail size={16} className="text-[#16a34a]" />
               <span>support@arzepak.com</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-600">
               <MapPin size={16} className="text-[#16a34a]" />
               <span>DHA Phase 6, Lahore</span>
             </div>
          </div>

          <div className="flex gap-4">
            {[
              { 
                icon: (props: any) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                ), 
                color: "hover:bg-blue-600",
                href: "https://www.facebook.com/arzepakprop"
              },
              { 
                icon: (props: any) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                ), 
                color: "hover:bg-pink-600",
                href: "https://www.instagram.com/arzepakprop"
              },
              { 
                icon: (props: any) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                ), 
                color: "hover:bg-blue-700",
                href: "#"
              },
              { 
                icon: (props: any) => (
                  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                  </svg>
                ), 
                color: "hover:bg-red-600",
                href: "#"
              },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 text-gray-500 hover:text-white ${social.color} hover:scale-110 shadow-sm`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} ArzePak. Built with passion for Pakistan&apos;s real estate.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-500 text-[10px] font-bold uppercase tracking-tighter">Live Support Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
