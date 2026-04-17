// src/dashboard/TemplateData.js
export const templates = [
  {
    id: 'job-switch',
    title: 'Should I Switch Jobs?',
    icon: '💼',
    color: 'blue',
    factors: [
      { id: 'f1', name: 'Salary & Equity', weight: 5 },
      { id: 'f2', name: 'Work-Life Balance', weight: 4 },
      { id: 'f3', name: 'Growth Potential', weight: 5 },
      { id: 'f4', name: 'Team Culture', weight: 3 },
      { id: 'f5', name: 'Commute/Remote', weight: 2 },
    ],
    options: [
      { name: 'Current Job', ratings: { 'f1': 6, 'f2': 7, 'f3': 4, 'f4': 8, 'f5': 9 } },
      { name: 'New Offer', ratings: { 'f1': 9, 'f2': 5, 'f3': 9, 'f4': 6, 'f5': 5 } },
    ]
  },
  {
    id: 'laptop-buy',
    title: 'Which Laptop to Buy?',
    icon: '💻',
    color: 'orange',
    factors: [
      { id: 'f1', name: 'Performance', weight: 5 },
      { id: 'f2', name: 'Portability', weight: 3 },
      { id: 'f3', name: 'Battery Life', weight: 4 },
      { id: 'f4', name: 'Price', weight: 5 },
      { id: 'f5', name: 'Display Quality', weight: 3 },
    ],
    options: [
      { name: 'MacBook Air', ratings: { 'f1': 8, 'f2': 10, 'f3': 9, 'f4': 7, 'f5': 8 } },
      { name: 'Dell XPS 13', ratings: { 'f1': 7, 'f2': 9, 'f3': 7, 'f4': 6, 'f5': 9 } },
    ]
  },
  {
    id: 'university',
    title: 'College Selection',
    icon: '🎓',
    color: 'purple',
    factors: [
      { id: 'f1', name: 'Prestige/Ranking', weight: 4 },
      { id: 'f2', name: 'Cost of Living', weight: 5 },
      { id: 'f3', name: 'Course Quality', weight: 5 },
      { id: 'f4', name: 'Job Placement', weight: 5 },
      { id: 'f5', name: 'Campus Life', weight: 2 },
    ],
    options: [
      { name: 'University A', ratings: { 'f1': 9, 'f2': 3, 'f3': 8, 'f4': 9, 'f5': 7 } },
      { name: 'University B', ratings: { 'f1': 6, 'f2': 8, 'f3': 7, 'f4': 7, 'f5': 9 } },
    ]
  }
];
