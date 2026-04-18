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
   const [analyzingStage, setAnalyzingStage] = useState(0);
   const [showResults, setShowResults] = useState(false);
   const [aiPerspective, setAiPerspective] = useState('analyst');

   const stages = [
      "Weighting contributions...",
      "Simulating bidirectional regret...",
      "Calculating confidence levels...",
      "Structuring expert report..."
   ];

   const analysisMetrics = useMemo(() => {
      const { factors, options } = activeComparison;
      if (!factors.length || !options.length) return null;

      const totalWeight = factors.reduce((sum, f) => sum + (f.weight || 1), 0);
      const results = options.map(opt => {
         let totalWeightedRating = 0;
         const contributions = factors.map(f => {
            const weightedRating = (opt.ratings[f.id] || 0) * (f.weight || 1);
            totalWeightedRating += weightedRating;
            return { ...f, contribution: weightedRating };
         }).sort((a, b) => b.contribution - a.contribution);

         const score = Math.round((totalWeightedRating / (totalWeight * 10)) * 100);
         const ratings = Object.values(opt.ratings);
         const avg = ratings.reduce((a, b) => a + b, 0) / Math.max(ratings.length, 1);
         const variance = ratings.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / Math.max(ratings.length, 1);

         return { ...opt, score, contributions, variance };
      }).sort((a, b) => b.score - a.score);

      const winner = results[0];
      const runnerUp = results[1];
      const scoreGap = runnerUp ? winner.score - runnerUp.score : 100;

      let confidenceLevel = "High";
      let confidenceReason = "Strong score lead and consistent factor performance.";
      if (scoreGap < 5) {
         confidenceLevel = "Low";
         confidenceReason = "Scores are critically close; the winner is statistically insignificant.";
      } else if (scoreGap < 15) {
         confidenceLevel = "Medium";
         confidenceReason = "Clear lead, but minor priority shifts could change the outcome.";
      }
      if (winner.variance > 8) {
         confidenceLevel = "Medium";
         confidenceReason = "Winner has high rating variance, suggesting potential instability.";
      }

      return { results, winner, runnerUp, scoreGap, confidenceLevel, confidenceReason };
   }, [activeComparison]);

   const getResults = useMemo(() => analysisMetrics?.results || [], [analysisMetrics]);

   const report = useMemo(() => {
      if (!analysisMetrics) return null;
      const { winner, runnerUp, scoreGap, confidenceLevel, confidenceReason } = analysisMetrics;
      const factors = activeComparison.factors;
      const topDrivers = winner.contributions.slice(0, 2);

      const sections = {
         bestChoice: {
            name: winner.name,
            reasons: [
               `Dominated in ${topDrivers[0].name} (${topDrivers[0].contribution} pts contribution)`,
               `Strong weighted performance across ${factors.filter(f => f.weight >= 4).length} priority factors.`
            ]
         },
         scores: getResults.map(res => ({
            name: res.name, score: res.score,
            justification: res.variance > 8 ? "Higher volatility in factor ratings." : "Stable performance profile."
         })),
         summary: runnerUp ?
            `"${winner.name}" leads by ${scoreGap} pts. Primary tradeoff is ${winner.contributions[0].name} lead over ${runnerUp.contributions[0].name}.` :
            "Winner is uncontested in the current setup.",
         risks: [],
         regret: {
            ifWinner: runnerUp ? `Missing "${runnerUp.contributions[0].name}" excellence of ${runnerUp.name}.` : "Minimal relative regret profile.",
            ifRunnerUp: `Sacrificing the ${topDrivers[0].name} strength of "${winner.name}".`
         },
         smartInsight: "Decision audit complete.",
         confidence: { level: confidenceLevel, reason: confidenceReason }
      };

      if (winner.variance > 8) sections.risks.push(`Fragility: "${winner.name}" depends on a few extreme factor ratings.`);
      const criticalBottleneck = factors.find(f => (winner.ratings[f.id] || 0) < 5 && (f.weight || 1) >= 4);
      if (criticalBottleneck) sections.risks.push(`Vulnerability: Below-average performance in "${criticalBottleneck.name}".`);

      if (scoreGap < 5) sections.smartInsight = "Tie-Breaker: Scores are close. Flip a coin to detect your subconscious pull.";
      else if (winner.contributions[0].contribution > (winner.score / 2)) sections.smartInsight = "Over-Optimization: Total score is heavily dependent on ONE factor.";
      else if (factors.length < 3) sections.smartInsight = "Under-Defined: Add more factors to reach a reliable conclusion.";

      if (aiPerspective === 'guardian') {
         sections.bestChoice.reasons[0] = "Minimizes potential downside in core sectors.";
         sections.smartInsight = "Perspective: Guardian prioritize stability over peak utility.";
      } else if (aiPerspective === 'visionary') {
         sections.bestChoice.reasons[0] = "Maximizes explosive upside and growth potential.";
         sections.smartInsight = "Perspective: Visionary ignore minor comfort for long-term impact.";
      }

      return sections;
   }, [analysisMetrics, aiPerspective, activeComparison, getResults]);

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
      setAnalyzingStage(0);
      const timer = setInterval(() => {
         setAnalyzingStage(prev => {
            if (prev >= stages.length - 1) {
               clearInterval(timer);
               setAnalyzing(false);
               setShowResults(true);
               return prev;
            }
            return prev + 1;
         });
      }, 600);
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
               className={`px-12 py-5 bg-black dark:bg-orange-500 text-white rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-all flex flex-col items-center gap-1 ${analyzing ? 'opacity-70' : ''}`}
            >
               <div className="flex items-center gap-3">
                  {analyzing ? stages[analyzingStage] : 'Analyze Decision'}
                  <Zap className={`w-6 h-6 fill-current ${analyzing ? 'animate-spin' : ''}`} />
               </div>
               {analyzing && (
                  <div className="w-full h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                     <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(analyzingStage + 1) * 25}%` }}
                        className="h-full bg-white"
                     />
                  </div>
               )}
            </button>
            <p className="text-xs text-gray-400 max-w-sm text-center">Our expert analyst will calculate weighted contributions and simulate regret logic.</p>
         </div>

         {/* Step 5: RESULTS */}
         <AnimatePresence>
            {showResults && report && (
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12 mt-12 pt-12 border-t-2 border-dashed border-gray-200 dark:border-gray-800"
               >
                  <div className="flex flex-col items-center gap-4 text-center">
                     <h2 className={`text-5xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Intelligence Report</h2>
                     <div className={`px-6 py-2 rounded-2xl border flex items-center gap-3 transition-colors ${report.confidence.level === 'High' ? 'bg-green-100 text-green-700 border-green-200' : report.confidence.level === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        <div className={`w-3 h-3 rounded-full animate-pulse ${report.confidence.level === 'High' ? 'bg-green-500' : report.confidence.level === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-black uppercase tracking-widest">{report.confidence.level} Confidence Analyst Match</span>
                     </div>
                     <p className="text-xs text-gray-400 italic max-w-md">{report.confidence.reason}</p>
                  </div>

                  {/* PERSPECTIVE SELECTOR */}
                  <div className="flex justify-center flex-wrap gap-2">
                     {['analyst', 'guardian', 'visionary'].map(p => (
                        <button
                           key={p}
                           onClick={() => setAiPerspective(p)}
                           className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${aiPerspective === p ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200'}`}
                        >
                           The {p}
                        </button>
                     ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                     {/* 1. BEST CHOICE */}
                     <div className="lg:col-span-2 space-y-6">
                        <section className={cardBase + " p-8 border-l-8 border-l-green-500"}>
                           <div className="flex items-center gap-3 mb-6">
                              <div className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-500/20">
                                 <Zap className="w-8 h-8 fill-current" />
                              </div>
                              <div>
                                 <h4 className="text-xs font-black uppercase tracking-tighter text-gray-400">Section 1: 🏆 Best Choice</h4>
                                 <h3 className="text-4xl font-black uppercase">{report.bestChoice.name}</h3>
                              </div>
                           </div>
                           <div className="space-y-3">
                              {report.bestChoice.reasons.map((r, i) => (
                                 <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                    <p className="text-sm font-bold opacity-80">{r}</p>
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* 3. COMPARISON SUMMARY */}
                        <section className={cardBase + " p-8 border-l-8 border-l-blue-500"}>
                           <div className="flex items-center gap-3 mb-4">
                              <Radar className="w-6 h-6 text-blue-500" />
                              <h4 className="text-xs font-black uppercase tracking-widest leading-none">Section 3: ⚖️ Comparison Summary</h4>
                           </div>
                           <p className="font-bold text-lg leading-relaxed mb-6">{report.summary}</p>
                           <FactorRadarChart factors={activeComparison.factors} options={getResults} darkMode={darkMode} />
                        </section>
                     </div>

                     <div className="space-y-8">
                        {/* 2. OPTION SCORES */}
                        <section className={cardBase + " p-6"}>
                           <h4 className="text-xs font-black uppercase tracking-widest mb-6">Section 2: 📊 Option Scores</h4>
                           <div className="space-y-6">
                              {report.scores.map((s, i) => (
                                 <div key={i}>
                                    <div className="flex justify-between items-end mb-1">
                                       <span className="text-sm font-black uppercase">{s.name}</span>
                                       <span className="text-2xl font-black">{s.score}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                       <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} className={`h-full ${i === 0 ? 'bg-green-500' : 'bg-orange-500'}`} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{s.justification}</p>
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* 4. HIDDEN RISKS */}
                        <section className={cardBase + " p-6 border-t-4 border-t-red-500"}>
                           <div className="flex items-center gap-2 mb-4 text-red-500">
                              <Shield className="w-5 h-5" />
                              <h4 className="text-xs font-black uppercase tracking-widest">Section 4: ⚠️ Hidden Risks</h4>
                           </div>
                           <div className="space-y-3">
                              {report.risks.length > 0 ? report.risks.map((r, i) => (
                                 <div key={i} className="text-sm font-bold text-red-500/80 p-3 bg-red-50 dark:bg-red-950/20 rounded-xl flex gap-2">
                                    <span>•</span> {r}
                                 </div>
                              )) : <p className="text-sm text-gray-400 italic">No critical vulnerabilities detected.</p>}
                           </div>
                        </section>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     {/* 5. REGRET ANALYSIS */}
                     <section className={cardBase + " p-8 border-l-8 border-l-purple-500"}>
                        <div className="flex items-center gap-3 mb-6">
                           <Info className="w-6 h-6 text-purple-500" />
                           <h4 className="text-xs font-black uppercase tracking-widest">Section 5: 🤯 Regret Analysis</h4>
                        </div>
                        <div className="grid gap-4">
                           <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                              <span className="text-[10px] font-black uppercase text-purple-500 block mb-1">If you choose Winner</span>
                              <p className="text-sm font-bold opacity-80">{report.regret.ifWinner}</p>
                           </div>
                           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                              <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">If you choose Runner-up</span>
                              <p className="text-sm font-bold opacity-80">{report.regret.ifRunnerUp}</p>
                           </div>
                        </div>
                     </section>

                     {/* 6. SMART INSIGHT */}
                     <section className={cardBase + " p-8 border-r-8 border-r-orange-500 text-right"}>
                        <div className="flex items-center gap-3 mb-4 justify-end">
                           <h4 className="text-xs font-black uppercase tracking-widest text-orange-500">Section 6: 💡 Smart Insight</h4>
                           <Target className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-2xl font-black italic mb-4 leading-tight">"{report.smartInsight}"</p>
                        <p className="text-xs text-gray-400 max-w-[300px] ml-auto">Expert audit derived from {aiPerspective} perspective logic.</p>
                     </section>
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