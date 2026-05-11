"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Database } from "lucide-react";

const CTASidebar = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#0F1C36] p-7 text-white shadow-sm overflow-hidden relative">
      {/* Subtle decoration */}
      <div className="absolute top-0 right-0 -mr-10 -mt-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-36 w-36 rounded-full bg-white/5 blur-3xl" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
          <Database className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-semibold mb-3 leading-tight">
          Get verified MSP & VAR data
        </h3>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Share your target criteria and we’ll help you shortlist the right
          partners and provide a relevant sample.
        </p>
        
        <Link 
          href="/contact" 
          className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all group/btn"
        >
          Get free sample
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CTASidebar;
