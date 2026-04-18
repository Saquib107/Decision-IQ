import React, { useState } from "react"
import { SuccessTrendChart, CategoryPieChart } from "./AnalyticsCharts"
import { templates } from "./TemplateData"
import { motion } from "framer-motion"
import { TrendingUp, Clock, Award } from "lucide-react"

export default function HomeSection({
  darkMode,
  decisions,
  successRate,
  showToast,
  onUseTemplate,
  onStartBlank
}) {
  const [aiPrompt, setAiPrompt] = useState("")

  const avgHappiness =
    decisions.filter((d) => d.outcome).reduce(
      (sum, d) => sum + (d.outcome.happiness || 0),
      0
    ) / Math.max(decisions.filter((d) => d.outcome).length, 1) || 0

  const generateAIResponse = () => {
    if (!aiPrompt) return
    const responses = [
      `Based on your past decisions, you tend to succeed when you take calculated risks with proper planning.`,
      `You perform best when consulting others before making big choices.`,
      `Your history shows higher satisfaction when decisions align with long-term goals.`,
    ]
    const random = responses[Math.floor(Math.random() * responses.length)]
    showToast(random, "info")
  }

  return (
    <div className="pb-10">
      <h1
        className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"
          }`}
      >
        Welcome to Your Decision Intelligence Hub
      </h1>
      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
        "Stop overthinking. Make smarter decisions with AI."
      </p>

      {/* Quick Start Section */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <button
          onClick={onStartBlank}
          className={`p-6 rounded-2xl border-2 border-dashed ${darkMode ? 'border-gray-700 hover:border-orange-500 bg-gray-800/50' : 'border-orange-200 hover:border-orange-500 bg-orange-50/30'} transition-all flex items-center justify-between group`}
        >
          <div className="text-left">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Start Blank Decision</h3>
            <p className="text-sm text-gray-400">Build your own comparison matrix from scratch.</p>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </button>
        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border border-transparent`}>
          <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Ready to Analyze</h3>
          <p className="text-sm text-gray-400">Fill in the data and a 1-click analysis will appear.</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">System Standing By</span>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Decision Templates</h2>
          <span className="text-xs text-orange-500 font-bold uppercase tracking-widest px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded">Speed Utility</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <motion.button
              key={tpl.id}
              whileHover={{ y: -5 }}
              onClick={() => onUseTemplate(tpl)}
              className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-100'} text-left group`}
            >
              <div className={`text-3xl mb-3`}>{tpl.icon}</div>
              <h4 className={`font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tpl.title}</h4>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">{tpl.factors.length} Factors Included</span>
                <div className="p-1 px-2 rounded-lg bg-orange-50 dark:bg-gray-700 text-orange-600 text-[10px] font-black group-hover:bg-orange-500 group-hover:text-white transition-colors">USE</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>


      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Success IQ Trend</h3>
            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase">Learning Curve</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Your decision success rate progression based on logged outcomes.</p>
          <SuccessTrendChart decisions={decisions} darkMode={darkMode} />
        </div>

        <div className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Category Breakdown</h3>
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">Life Areas</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Distribution of your decisions across different life domains.</p>
          <CategoryPieChart decisions={decisions} darkMode={darkMode} />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatCard
          darkMode={darkMode}
          color="orange"
          Icon={Clock}
          label="Total Decisions"
          value={decisions.length}
        />
        <StatCard
          darkMode={darkMode}
          color="green"
          Icon={Award}
          label="Success Rate"
          value={`${successRate.toFixed(0)}%`}
        />
        <StatCard
          darkMode={darkMode}
          color="purple"
          Icon={TrendingUp}
          label="Avg Happiness"
          value={avgHappiness.toFixed(1)}
        />
      </div>
    </div>
  )
}

function StatCard({ darkMode, color, Icon, label, value }) {
  const bgMap = {
    orange: darkMode
      ? "bg-gradient-to-br from-orange-500 to-amber-500"
      : "bg-gradient-to-br from-orange-400 to-amber-400",
    green: darkMode
      ? "bg-gradient-to-br from-green-500 to-emerald-500"
      : "bg-gradient-to-br from-green-400 to-emerald-400",
    purple: darkMode
      ? "bg-gradient-to-br from-purple-500 to-pink-500"
      : "bg-gradient-to-br from-purple-400 to-pink-400",
  }

  return (
    <div className={`p-6 rounded-2xl ${bgMap[color]} text-white`}>
      {/* Icon is passed as a prop and rendered as a component */}
      <Icon className="w-10 h-10 mb-3" />
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-white/80">{label}</p>
    </div>
  )
}