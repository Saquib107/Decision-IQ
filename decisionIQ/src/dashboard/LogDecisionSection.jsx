// src/dashboard/LogDecisionSection.jsx
import React, { useState } from "react"
import { Plus, Trash2, Shield, AlertTriangle, Scale, Target, Calendar } from "lucide-react"

const constraintOptions = {
  time: [
    { value: "low", label: "Low pressure", icon: "🟢" },
    { value: "medium", label: "Some urgency", icon: "🟡" },
    { value: "high", label: "Time sensitive", icon: "🔴" },
  ],
  risk: [
    { value: "low", label: "Low risk", icon: "🛡️" },
    { value: "medium", label: "Moderate risk", icon: "⚖️" },
    { value: "high", label: "High risk", icon: "⚠️" },
  ],
  emotion: [
    { value: "calm", label: "Calm", icon: "😌" },
    { value: "neutral", label: "Neutral", icon: "😐" },
    { value: "anxious", label: "Anxious", icon: "😰" },
    { value: "excited", label: "Excited", icon: "😊" },
  ],
}

const categoryOptions = ["Career", "Health", "Finance", "Social", "Personal", "Other"]

export default function LogDecisionSection({
  darkMode,
  newDecision,
  setNewDecision,
  saveDecision,
}) {
  const cardBase = `rounded-2xl border ${
    darkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-orange-100"
  }`

  const labelBase = `text-sm font-semibold ${
    darkMode ? "text-gray-200" : "text-gray-800"
  }`

  const sectionTitle = `text-base font-semibold ${
    darkMode ? "text-gray-100" : "text-gray-900"
  }`

  const inputBase = `w-full px-4 py-3 rounded-xl ${
    darkMode ? "bg-gray-900 text-white" : "bg-orange-50"
  } border border-transparent focus:border-orange-400 outline-none text-sm`

  const addProCon = (type) => {
    const fresh = { id: Date.now(), text: "", weight: 3, type }
    setNewDecision({ ...newDecision, prosCons: [...newDecision.prosCons, fresh] })
  }

  const updateProCon = (id, field, value) => {
    setNewDecision({
      ...newDecision,
      prosCons: newDecision.prosCons.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  const removeProCon = (id) => {
    setNewDecision({
      ...newDecision,
      prosCons: newDecision.prosCons.filter((item) => item.id !== id),
    })
  }

  return (
    <div className="w-full space-y-6 pb-20">
      <h1
        className={`text-2xl font-bold mb-2 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Log Decision
      </h1>

      {/* Categorization & Reflection Date */}
      <div className={cardBase + " p-5 grid md:grid-cols-2 gap-6"}>
        <div className="space-y-3">
          <p className={sectionTitle}>Category</p>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setNewDecision({ ...newDecision, category: cat })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  newDecision.category === cat
                    ? "bg-orange-500 text-white"
                    : darkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-orange-50 text-orange-800 hover:bg-orange-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {newDecision.category === "Other" && (
            <input
              value={newDecision.customCategory}
              onChange={(e) => setNewDecision({ ...newDecision, customCategory: e.target.value })}
              placeholder="Enter custom category..."
              className={inputBase}
            />
          )}
        </div>

        <div className="space-y-3">
          <p className={sectionTitle + " flex items-center gap-2"}>
             <Calendar className="w-4 h-4" /> Reflection Date
          </p>
          <input
            type="date"
            value={newDecision.reflectionDate}
            onChange={(e) => setNewDecision({ ...newDecision, reflectionDate: e.target.value })}
            className={inputBase}
          />
          <p className="text-[10px] text-gray-400">When will you check the outcome of this decision?</p>
        </div>
      </div>

      {/* Situation & Goal */}
      <div className={cardBase + " p-5 space-y-4"}>
        <div>
          <p className={sectionTitle}>Situation</p>
          <p className={darkMode ? "text-gray-400" : "text-gray-500 text-sm"}>
            Describe the decision you are facing right now.
          </p>
          <textarea
            value={newDecision.situation}
            onChange={(e) =>
              setNewDecision({ ...newDecision, situation: e.target.value })
            }
            placeholder="E.g. Should I accept a new job offer at a smaller startup?"
            className={inputBase + " mt-3"}
            rows={3}
          />
        </div>

        <div>
          <p className={sectionTitle}>Goal</p>
          <p className={darkMode ? "text-gray-400" : "text-gray-500 text-sm"}>
            What are you trying to optimize for?
          </p>
          <input
            value={newDecision.intent}
            onChange={(e) =>
              setNewDecision({ ...newDecision, intent: e.target.value })
            }
            placeholder="E.g. Better work‑life balance, more growth, higher income"
            className={inputBase + " mt-3"}
          />
        </div>
      </div>

      {/* Decision Toolkits */}
      <div className={cardBase + " p-5 space-y-4"}>
        <div className="flex items-center justify-between">
          <p className={sectionTitle}>Decision Toolkit</p>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
             {['none', 'proscons', 'swot'].map(f => (
               <button
                key={f}
                onClick={() => setNewDecision({...newDecision, framework: f})}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  newDecision.framework === f 
                  ? "bg-white dark:bg-gray-700 text-orange-600 shadow-sm" 
                  : "text-gray-500"
                }`}
               >
                 {f === 'none' ? 'General' : f}
               </button>
             ))}
          </div>
        </div>

        {newDecision.framework === "proscons" && (
          <div className="space-y-4">
             <div className="grid md:grid-cols-2 gap-4">
               {/* Pros */}
               <div className="space-y-2">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Shield className="w-3 h-3" /> PROS</span>
                    <button onClick={() => addProCon('pro')} className="p-1 rounded-md hover:bg-green-50 text-green-600"><Plus className="w-4 h-4" /></button>
                 </div>
                 {newDecision.prosCons.filter(i => i.type === 'pro').map(item => (
                   <div key={item.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 transition-all">
                      <input 
                        value={item.text} 
                        onChange={(e) => updateProCon(item.id, 'text', e.target.value)}
                        placeholder="Importance..." 
                        className={inputBase + " !py-2 !px-3 font-medium"} 
                      />
                      <select 
                        value={item.weight} 
                        onChange={(e) => updateProCon(item.id, 'weight', parseInt(e.target.value))}
                        className="bg-green-50 text-green-800 rounded-lg text-xs px-2 py-2 outline-none border-none"
                      >
                         {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <button onClick={() => removeProCon(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                   </div>
                 ))}
               </div>
               {/* Cons */}
               <div className="space-y-2">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> CONS</span>
                    <button onClick={() => addProCon('con')} className="p-1 rounded-md hover:bg-red-50 text-red-600"><Plus className="w-4 h-4" /></button>
                 </div>
                 {newDecision.prosCons.filter(i => i.type === 'con').map(item => (
                   <div key={item.id} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 transition-all">
                      <input 
                        value={item.text} 
                        onChange={(e) => updateProCon(item.id, 'text', e.target.value)}
                        placeholder="Risk..." 
                        className={inputBase + " !py-2 !px-3 font-medium"} 
                      />
                      <select 
                        value={item.weight} 
                        onChange={(e) => updateProCon(item.id, 'weight', parseInt(e.target.value))}
                        className="bg-red-50 text-red-800 rounded-lg text-xs px-2 py-2 outline-none border-none"
                      >
                         {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <button onClick={() => removeProCon(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {newDecision.framework === "swot" && (
          <div className="grid grid-cols-2 gap-3 p-2 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
             <SwotTile 
              label="Strengths" color="green" 
              value={newDecision.swot.s} 
              onChange={(val) => setNewDecision({...newDecision, swot: {...newDecision.swot, s: val}})} 
              darkMode={darkMode}
            />
             <SwotTile 
              label="Weaknesses" color="red" 
              value={newDecision.swot.w} 
              onChange={(val) => setNewDecision({...newDecision, swot: {...newDecision.swot, w: val}})} 
              darkMode={darkMode}
            />
             <SwotTile 
              label="Opportunities" color="blue" 
              value={newDecision.swot.o} 
              onChange={(val) => setNewDecision({...newDecision, swot: {...newDecision.swot, o: val}})} 
              darkMode={darkMode}
            />
             <SwotTile 
              label="Threats" color="orange" 
              value={newDecision.swot.t} 
              onChange={(val) => setNewDecision({...newDecision, swot: {...newDecision.swot, t: val}})} 
              darkMode={darkMode}
            />
          </div>
        )}
      </div>

      {/* Constraints & Context */}
      <div className={cardBase + " p-5 space-y-5"}>
        <p className={sectionTitle}>Constraints &amp; Context</p>

        {/* Time Pressure */}
        <div className="space-y-2">
          <span className={labelBase}>Time Pressure</span>
          <div className="flex flex-wrap gap-3">
            {constraintOptions.time.map((opt) => (
              <PillOption
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                active={newDecision.timePressure === opt.value}
                onClick={() =>
                  setNewDecision({ ...newDecision, timePressure: opt.value })
                }
              />
            ))}
          </div>
        </div>

        {/* Risk Level */}
        <div className="space-y-2">
          <span className={labelBase}>Risk Level</span>
          <div className="flex flex-wrap gap-3">
            {constraintOptions.risk.map((opt) => (
              <PillOption
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                active={newDecision.riskLevel === opt.value}
                onClick={() =>
                  setNewDecision({ ...newDecision, riskLevel: opt.value })
                }
              />
            ))}
          </div>
        </div>

        {/* Emotional State */}
        <div className="space-y-2">
          <span className={labelBase}>Emotional State</span>
          <div className="flex flex-wrap gap-3">
            {constraintOptions.emotion.map((opt) => (
              <PillOption
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                active={newDecision.emotion === opt.value}
                onClick={() =>
                  setNewDecision({ ...newDecision, emotion: opt.value })
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      <div className={cardBase + " p-5 space-y-4"}>
        <p className={sectionTitle}>Alternatives Considered</p>
        <input
          value={newDecision.alternatives || ""}
          onChange={(e) =>
            setNewDecision({ ...newDecision, alternatives: e.target.value })
          }
          placeholder="Option 1, Option 2, Option 3..."
          className={inputBase}
        />
      </div>

      {/* Final Decision & Reasoning */}
      <div className={cardBase + " p-5 space-y-4 mb-4"}>
        <div>
          <p className={sectionTitle}>Final Decision</p>
          <input
            value={newDecision.decision}
            onChange={(e) =>
              setNewDecision({ ...newDecision, decision: e.target.value })
            }
            placeholder="What did you decide to do?"
            className={inputBase + " mt-2"}
          />
        </div>

        <div>
          <p className={sectionTitle}>Reasoning</p>
          <p className={darkMode ? "text-gray-400" : "text-gray-500 text-sm"}>
            Why does this option feel right given your constraints?
          </p>
          <textarea
            value={newDecision.reasoning}
            onChange={(e) =>
              setNewDecision({ ...newDecision, reasoning: e.target.value })
            }
            placeholder="Summarize how you weighed trade‑offs and why you prefer this path."
            className={inputBase + " mt-2"}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-center flex-col items-center gap-4">
        <button
          onClick={saveDecision}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-orange-200 dark:hover:shadow-none hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2"
        >
          <Target className="w-5 h-5" /> Save Decision IQ
        </button>
        <p className="text-xs text-gray-400">Your decision will be encrypted and saved to your personal vault.</p>
      </div>
    </div>
  )
}

function PillOption({ label, icon, active, onClick }) {
  const base =
    "px-4 py-2 rounded-full text-sm font-medium inline-flex items-center justify-center cursor-pointer transition-all"
  const activeClasses = "bg-orange-500 text-white shadow-sm"
  const inactiveClasses = "bg-orange-50 text-orange-800 hover:bg-orange-100"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? activeClasses : inactiveClasses}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}

function SwotTile({ label, color, value, onChange, darkMode }) {
  const colors = {
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50"
  }
  return (
    <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-100'} shadow-sm`}>
       <p className={`text-[10px] font-black uppercase tracking-tighter mb-2 ${colors[color]} px-2 py-0.5 rounded-md w-fit`}>{label}</p>
       <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="w-full bg-transparent border-none outline-none text-xs resize-none"
          rows={3}
       />
    </div>
  )
}