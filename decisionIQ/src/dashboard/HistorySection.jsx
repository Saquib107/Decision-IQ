// dashboard/HistorySection.jsx
import React from "react"
import OutcomeSummary from "./OutcomeSummary"

export default function HistorySection({
  darkMode,
  SearchIcon,
  TrashIcon,
  decisions,
  filteredDecisions,
  searchQuery,
  setSearchQuery,
  deleteDecision,
  successRate,
}) {
  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Decision History
      </h1>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } shadow-lg border-2 border-transparent focus:border-orange-500 outline-none`}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDecisions.map((decision) => (
          <HistoryCard
            key={decision.id}
            darkMode={darkMode}
            TrashIcon={TrashIcon}
            decision={decision}
            deleteDecision={deleteDecision}
          />
        ))}
      </div>

      {decisions.length > 0 && (
        <div
          className={`mt-8 p-6 rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              : "bg-gradient-to-r from-purple-100 to-pink-100"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            🧠 Behavioral Insights
          </h3>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
            Based on your {decisions.length} decisions, you tend to perform
            better when decisions are planned and discussed with others. Your
            success rate is {successRate.toFixed(0)}%, which shows strong
            decision-making capabilities.
          </p>
        </div>
      )}
    </div>
  )
}

function HistoryCard({ darkMode, TrashIcon, decision, deleteDecision }) {
  const isPastReflection = decision.reflectionDate && new Date(decision.reflectionDate) < new Date() && !decision.outcome;

  return (
    <div
      className={`p-6 rounded-2xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg hover:shadow-xl transition-all border-l-4 ${isPastReflection ? 'border-orange-500' : 'border-transparent'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {decision.situation}
            </h3>
            {decision.category && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                darkMode ? 'bg-gray-700 text-orange-400' : 'bg-orange-100 text-orange-600'
              }`}>
                {decision.category === 'Other' ? decision.customCategory : decision.category}
              </span>
            )}
            {isPastReflection && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600 animate-pulse">
                Review Due
              </span>
            )}
          </div>
          <p className={darkMode ? "text-gray-400" : "text-gray-600 text-xs"}>
             Logged on {decision.date || 'unknown'} • Review by {decision.reflectionDate || 'N/A'}
          </p>
        </div>
        <button
          onClick={() => deleteDecision(decision.id)}
          className={`p-2 rounded-lg ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-all`}
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div
        className={`grid md:grid-cols-2 gap-4 mb-4 text-sm ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <div className="space-y-2">
          <p>
            <span className="font-bold text-[10px] uppercase text-gray-400 block">The Decision</span> 
            {decision.decision}
          </p>
          <p>
            <span className="font-bold text-[10px] uppercase text-gray-400 block">Reasoning</span>{" "}
            {decision.reasoning}
          </p>
        </div>
        
        <div className="space-y-2">
          {decision.framework === 'proscons' && decision.prosCons?.length > 0 && (
            <div>
              <span className="font-bold text-[10px] uppercase text-gray-400 block mb-1">Analysis (Pros/Cons)</span>
              <div className="flex flex-wrap gap-1">
                {decision.prosCons.map(item => (
                  <span key={item.id} className={`px-2 py-0.5 rounded-md text-[10px] ${item.type === 'pro' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {item.text} ({item.weight})
                  </span>
                ))}
              </div>
            </div>
          )}
          {decision.framework === 'swot' && (
            <div>
              <span className="font-bold text-[10px] uppercase text-gray-400 block">SWOT Analysis</span>
              <p className="text-[10px] italic">Insights captured in record.</p>
            </div>
          )}
          {decision.constraints && (
            <p>
              <span className="font-bold text-[10px] uppercase text-gray-400 block">Context</span>{" "}
              {decision.constraints}
            </p>
          )}
        </div>
      </div>

      {decision.outcome && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
           <OutcomeSummary darkMode={darkMode} outcome={decision.outcome} />
           {decision.outcome.lessonsLearned && (
             <div className="mt-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-xs italic">
                <span className="font-bold not-italic block mb-1 uppercase text-[10px] text-orange-600">Lessons Learned:</span>
                "{decision.outcome.lessonsLearned}"
             </div>
           )}
        </div>
      )}
    </div>
  )
}