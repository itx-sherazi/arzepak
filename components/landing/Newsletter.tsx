"use client";
import { useState } from "react";
import { Bell, TrendingUp, Home, Shield, CheckCircle2, ArrowRight } from "lucide-react";

const PERKS = [
  { icon: Home,       text: "New listings in your preferred area" },
  { icon: TrendingUp, text: "Price drops & market trend updates" },
  { icon: Bell,       text: "Instant alerts for matching properties" },
  { icon: Shield,     text: "No spam — unsubscribe anytime" },
];

export default function Newsletter() {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-gradient-to-br from-gray-50 via-white to-green-50">

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M0 0h40v1H0zM0 0v40H1V0z'/%3E%3C/g%3E%3C/svg%3E\")" }} />

          {/* Green accent bar top */}
          <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-green-600 to-green-400" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-0">

            {/* Left — copy */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-5">
                <Bell size={12} className="animate-bounce" />
                Property Alerts
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                Never Miss Your<br />
                <span className="text-green-600">Dream Property</span>
              </h2>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                Join <strong className="text-gray-700">12,000+</strong> Pakistanis who get personalised property alerts straight to their inbox — before listings go viral.
              </p>

              <ul className="space-y-3">
                {PERKS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-green-600" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="p-10 lg:p-14 flex flex-col justify-center lg:border-l border-gray-100">
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-5 py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re all set!</h3>
                    <p className="text-gray-500 text-sm">
                      Welcome aboard. We&apos;ll send you the best matching properties as soon as they&apos;re listed.
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    {["Lahore", "Karachi", "Islamabad", "Rawalpindi"].map(city => (
                      <span key={city} className="bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {city}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Alerts for top cities are active. You can unsubscribe anytime.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Subscribe for Free</h3>
                    <p className="text-sm text-gray-400">Get alerts tailored to your search.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Your Name</label>
                      <input
                        type="text"
                        placeholder="Ali Hassan"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Preferred City</label>
                      <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hover:bg-white transition-colors text-gray-700">
                        <option value="">All Cities</option>
                        {["Lahore","Karachi","Islamabad","Rawalpindi","Peshawar","Multan","Quetta","Faisalabad"].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Get Free Alerts <ArrowRight size={16} /></>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <Shield size={11} /> 100% free · No credit card · Unsubscribe anytime
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>

      
      </div>
    </section>
  );
}
