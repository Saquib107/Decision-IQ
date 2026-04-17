// src/dashboard/LogDecisionSection.jsx
import React, { useState, useMemo } from "react"
import { Plus, Trash2, Shield, Target, Calendar, Info, Zap, ChevronRight, BarChart3, Radar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ComparisonBarChart, FactorRadarChart } from "./AnalyticsCharts"

export default function LogDecisionSection({
   darkMode,
   activeComparison,
   setActiveComparison,
   saveDecision,
}) {
   const [analyzing, setAnalyzing] = useState(false);
   const [showResults, setShowResults] = useState(false);

   // Scoring Logic
   const getResults = useMemo(() => {
      const { factors, options } = activeComparison;
      const totalPossibleWeight = factors.reduce((sum, f) => sum + (f.weight || 1), 0) * 10;

      return options.map(opt => {
         let rawScore = 0;
         factors.forEach(f => {
            rawScore += (opt.ratings[f.id] || 0) * (f.weight || 1);
         });
         const finalScore = Math.round((rawScore / totalPossibleWeight) * 100) || 0;
         return { ...opt, score: finalScore };
      }).sort((a, b) => b.score - a.score);
   }, [activeComparison]);

   const addOption = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const newOpt = { id, name: `Option ${activeComparison.options.length + 1}`, ratings: {} };
      activeComparison.factors.forEach(f => newOpt.ratings[f.id] = 5);
      setActiveComparison({ ...activeComparison, options: [...activeComparison.options, newOpt] });
   };

   const removeOption = (id) => {
      if (activeComparison.options.length <= 1) return;
      setActiveComparison({ ...activeComparison, options: activeComparison.options.filter(o => o.id !== id) });
   };

   const addFactor = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const newFactor = { id, name: 'New Factor', weight: 3 };
      setActiveComparison({
         ...activeComparison,
         factors: [...activeComparison.factors, newFactor],
         options: activeComparison.options.map(o => ({ ...o, ratings: { ...o.ratings, [id]: 5 } }))
      });
   };

   const removeFactor = (id) => {
      if (activeComparison.factors.length <= 1) return;
      setActiveComparison({
         ...activeComparison,
         factors: activeComparison.factors.filter(f => f.id !== id)
      });
   };

   const updateRating = (optId, factorId, val) => {
      setActiveComparison({
         ...activeComparison,
         options: activeComparison.options.map(o =>
            o.id === optId ? { ...o, ratings: { ...o.ratings, [factorId]: val } } : o
         )
      });
   };

   const handleAnalyze = () => {
      setAnalyzing(true);
      setTimeout(() => {
         setAnalyzing(false);
         setShowResults(true);
         window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 1500);
   };

   const cardBase = `rounded-2xl border ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"} shadow-sm`;

   return (
      <div className="w-full space-y-8 pb-32 max-w-5xl mx-auto">
         <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-black ${darkMode ? "text-white" : "text-gray-900"}`}>Compare Options</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full animate-pulse">
               <Zap className="w-4 h-4 fill-current" />
               <span className="text-[10px] font-black uppercase tracking-widest">AI Ready to Analyze</span>
            </div>
         </div>

         {/* Step 1: TITLE */}
         <div className={cardBase + " p-6"}>
            <label className="text-[10px] font-black uppercase tracking-tighter text-orange-500 mb-2 block">The Big Question</label>
            <input
               value={activeComparison.title}
               onChange={(e) => setActiveComparison({ ...activeComparison, title: e.target.value })}
               placeholder="e.g. Which city should I move to?"
               className={`w-full text-2xl font-bold bg-transparent border-none outline-none ${darkMode ? 'text-white placeholder:text-gray-700' : 'text-gray-900 placeholder:text-gray-200'}`}
            />
         </div>

         {/* Step 2 & 3: THE MATRIX */}
         <div className={cardBase + " overflow-hidden"}>
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr className={darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}>
                        <th className="p-4 text-left border-r border-gray-200 dark:border-gray-700 min-w-[200px]">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-widest text-gray-500">Factors (Weight)</span>
                              <button onClick={addFactor} className="p-1 hover:bg-orange-500 hover:text-white rounded transition-colors"><Plus className="w-4 h-4" /></button>
                           </div>
                        </th>
                        {activeComparison.options.map((opt, i) => (
                           <th key={opt.id} className="p-4 min-w-[180px] border-r border-gray-200 dark:border-gray-700 last:border-r-0 group">
                              <div className="flex items-center justify-between gap-2">
                                 <input
                                    value={opt.name}
                                    onChange={(e) => setActiveComparison({
                                       ...activeComparison,
                                       options: activeComparison.options.map(o => o.id === opt.id ? { ...o, name: e.target.value } : o)
                                    })}
                                    className="bg-transparent border-none outline-none font-bold text-sm w-full focus:text-orange-500"
                                 />
                                 <button onClick={() => removeOption(opt.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                           </th>
                        ))}
                        <th className="p-4 w-[60px]">
                           <button onClick={addOption} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:scale-110 transition-transform"><Plus className="w-5 h-5" /></button>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {activeComparison.factors.map((factor, fi) => (
                        <tr key={factor.id} className="border-t border-gray-200 dark:border-gray-700 group">
                           <td className="p-4 border-r border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                 <input
                                    value={factor.name}
                                    onChange={(e) => setActiveComparison({
                                       ...activeComparison,
                                       factors: activeComparison.factors.map(f => f.id === factor.id ? { ...f, name: e.target.value } : f)
                                    })}
                                    className="bg-transparent border-none outline-none text-xs font-semibold w-full"
                                 />
                                 <button onClick={() => removeFactor(factor.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                              <div className="flex items-center gap-1">
                                 <span className="text-[8px] font-bold text-gray-400 uppercase">Weight:</span>
                                 <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(w => (
                                       <button
                                          key={w}
                                          onClick={() => setActiveComparison({
                                             ...activeComparison,
                                             factors: activeComparison.factors.map(f => f.id === factor.id ? { ...f, weight: w } : f)
                                          })}
                                          className={`w-3.5 h-3.5 rounded-sm text-[8px] font-black flex items-center justify-center transition-all ${factor.weight === w ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
                                       >
                                          {w}
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           </td>
                           {activeComparison.options.map(opt => (
                              <td key={opt.id} className="p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-center">
                                 <div className="flex flex-col items-center gap-1">
                                    <span className={`text-lg font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{opt.ratings[factor.id] || 0}</span>
                                    <input
                                       type="range" min="0" max="10" step="1"
                                       value={opt.ratings[factor.id] || 5}
                                       onChange={(e) => updateRating(opt.id, factor.id, parseInt(e.target.value))}
                                       className="w-full accent-orange-500"
                                    />
                                 </div>
                              </td>
                           ))}
                           <td></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Step 4: ANALYZE */}
         <div className="flex flex-col items-center gap-6">
            <button
               onClick={handleAnalyze}
               disabled={analyzing}
               className={`px-12 py-5 bg-black dark:bg-orange-500 text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 ${analyzing ? 'opacity-70 animate-pulse' : ''}`}
            >
               {analyzing ? 'Crunching Decision IQ...' : 'Analyze Decision'}
               <Zap className="w-6 h-6 fill-current" />
            </button>
            <p className="text-xs text-gray-400 max-w-sm text-center">Our algorithm will weight your factors and generate a comparative intelligence report (Step 5).</p>
         </div>

         {/* Step 5: RESULTS */}
         <AnimatePresence>
            {showResults && (
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 mt-12 pt-12 border-t-2 border-dashed border-gray-200 dark:border-gray-800"
               >
                  <h2 className={`text-4xl font-black text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>The Intelligence Report</h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {getResults.map((res, i) => (
                        <div key={res.id} className={`${cardBase} p-6 relative overflow-hidden group border-2 ${i === 0 ? 'border-green-500 bg-green-50/5' : 'border-transparent'}`}>
                           {i === 0 && (
                              <div className="absolute top-0 right-0 p-2 bg-green-500 text-white rounded-bl-xl text-[10px] font-black uppercase">🔥 Best Choice</div>
                           )}
                           <span className="text-xs font-bold text-gray-400">Rank #{i + 1}</span>
                           <h4 className="text-xl font-black mb-4 group-hover:text-orange-500 transition-colors uppercase truncate">{res.name}</h4>
                           <div className="flex items-end gap-1">
                              <span className="text-5xl font-black">{res.score}</span>
                              <span className="text-xl font-bold text-gray-400 mb-1">/100</span>
                           </div>
                           <div className="mt-4 w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${res.score}%` }}
                                 className={`h-full ${i === 0 ? 'bg-green-500' : 'bg-orange-500'}`}
                              />
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* CHARTS SECTION */}
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className={cardBase + " p-6"}>
                        <div className="flex items-center gap-2 mb-4">
                           <BarChart3 className="w-5 h-5 text-orange-500" />
                           <h4 className="font-bold text-sm uppercase tracking-widest">Score Comparison</h4>
                        </div>
                        <ComparisonBarChart data={getResults} darkMode={darkMode} />
                     </div>
                     <div className={cardBase + " p-6"}>
                        <div className="flex items-center gap-2 mb-4">
                           <Radar className="w-5 h-5 text-green-500" />
                           <h4 className="font-bold text-sm uppercase tracking-widest">Factor breakdown (Top 2)</h4>
                        </div>
                        <FactorRadarChart factors={activeComparison.factors} options={getResults} darkMode={darkMode} />
                     </div>
                  </div>

                  {/* AI INSIGHTS GRID */}
                  <div className="grid md:grid-cols-2 gap-6">
                     <InsightCard
                        icon={Shield} title="Hidden Risks" color="red"
                        content={getResults[0].ratings[activeComparison.factors.find(f => f.weight >= 4)?.id] < 5
                           ? `Caution: Your top pick "${getResults[0].name}" has a low rating in a high-priority factor (${activeComparison.factors.find(f => f.weight >= 4)?.name}). This might lead to long-term frustration.`
                           : "No major trade-off risks detected in high-weight categories. Your top pick is well-balanced."}
                     />
                     <InsightCard
                        icon={Target} title="Regret Analysis" color="purple"
                        content={activeComparison.factors.length < 3
                           ? "Limited data. We recommend adding more factors (like long-term happiness or financial impact) to minimize eventual regret."
                           : `Based on your weights, "${getResults[0].name}" offers the highest utility. If you choose "${getResults[1]?.name || 'any other'}", you're trading off ${getResults[0].score - (getResults[1]?.score || 0)}% of perceived value.`}
                     />
                  </div>

                  <div className="flex justify-center pt-8">
                     <button onClick={saveDecision} className="px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-3xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                        Finalize & Save to Vault
                        <ChevronRight className="w-6 h-6" />
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}

function InsightCard({ icon: Icon, title, content, color }) {
   const colors = {
      red: 'text-red-500 bg-red-50 dark:bg-red-900/10',
      green: 'text-green-500 bg-green-50 dark:bg-green-900/10',
      purple: 'text-purple-500 bg-purple-50 dark:bg-purple-900/10',
      orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/10',
   }
   return (
      <div className={`p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex gap-4 ${colors[color]}`}>
         <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 shadow-sm h-fit">
            <Icon className="w-6 h-6" />
         </div>
         <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] mb-1">{title}</h4>
            <p className="text-sm font-medium leading-relaxed opacity-80">{content}</p>
         </div>
      </div>
   )
}