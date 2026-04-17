import React from "react"
import { Brain, Sun, Moon, PlusCircle, TrendingUp, Target, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage({ darkMode, setDarkMode, goToAuth }) {
  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-950 text-white"
          : "bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900"
      } font-sans transition-colors duration-500`}
    >
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">DecisionIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-2xl ${
              darkMode ? "bg-gray-900 text-yellow-400" : "bg-white text-gray-600 shadow-sm"
            } transition-all`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
             onClick={goToAuth}
             className="hidden md:block px-6 py-2.5 bg-black dark:bg-white dark:text-black text-white rounded-xl font-bold text-sm hover:scale-105 transition-all"
          >
             Login
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-16 pb-32 flex flex-col items-center text-center relative">
        {/* Background blobs */}
        <div className="absolute top-0 -left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-20 -right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="max-w-4xl relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest mb-8 border border-orange-200 dark:border-orange-900/50">
             <Zap className="w-3 h-3 fill-current" />
             AI-Powered Comparison Engine
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
             Stop overthinking. <br/>
             <span className="text-orange-500">Make smarter decisions</span> with AI.
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 ${darkMode ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto leading-relaxed`}>
             Compare alternatives, score choices, and visualize risks. The first decision-making platform that scores your IQ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goToAuth}
              className="w-full sm:w-auto px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-500/40 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
            >
              Start Your First Audit
              <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
            <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 ${darkMode ? 'border-gray-950 bg-gray-800' : 'border-white bg-gray-100'} flex items-center justify-center text-[10px] font-bold`}>
                     U{i}
                  </div>
               ))}
               <div className="pl-4 text-xs font-bold text-gray-500 flex items-center">Joined by 2,000+ thinkers</div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-40 w-full">
           <FeatureCard 
              darkMode={darkMode}
              icon={Target} 
              title="Weighted Matrix" 
              desc="Rate options against custom weighted factors for mathematical clarity."
           />
           <FeatureCard 
              darkMode={darkMode}
              icon={Shield} 
              title="Risk Analysis" 
              desc="AI identifies blind spots and long-term trade-offs before you decide."
           />
           <FeatureCard 
              darkMode={darkMode}
              icon={TrendingUp} 
              title="Intelligence Score" 
              desc="Every path gets a Decision IQ from 0-100 based on your priorities."
           />
        </div>

        {/* Dynamic Image/Mockup Placeholder */}
        <div className={`mt-32 w-full max-w-5xl aspect-video rounded-3xl border ${darkMode ? 'bg-gray-900 border-gray-800 shadow-2xl shadow-orange-500/5' : 'bg-white border-gray-100 shadow-2xl'} flex items-center justify-center overflow-hidden relative group`}>
           <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
           <div className="z-10 text-center">
              <div className="mb-4 inline-block p-4 rounded-full bg-orange-500/20 text-orange-500">
                 <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-black mb-2 uppercase">The Comparison Hub</h3>
              <p className="opacity-50 text-sm">Real-time intelligence dashboard</p>
           </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-gray-100 dark:border-gray-900 text-center opacity-50 text-sm font-medium">
         © 2026 DecisionIQ Intelligence Engine. Build for clarify.
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, darkMode }) {
   return (
      <div className={`p-8 rounded-3xl text-left border transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800 hover:border-orange-500/30' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'}`}>
         <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
            <Icon className="w-6 h-6" />
         </div>
         <h4 className="text-xl font-bold mb-2 tracking-tight">{title}</h4>
         <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
      </div>
   )
}