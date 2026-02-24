const FRAMEWORKS = [
  {
    id: 'aida',
    name: 'AIDA',
    expansion: 'Attention, Interest, Desire, Action',
    bestFor: 'Landing pages, ads, sales pages',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    id: 'pas',
    name: 'PAS',
    expansion: 'Problem, Agitate, Solution',
    bestFor: 'Email marketing, blog intros, social ads',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  {
    id: 'fab',
    name: 'FAB',
    expansion: 'Features, Advantages, Benefits',
    bestFor: 'Product pages, comparison pages, specs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
      </svg>
    ),
  },
]

export default function FrameworkSelector({ selected, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {FRAMEWORKS.map((fw) => {
        const isSelected = selected === fw.id
        return (
          <button
            key={fw.id}
            onClick={() => onChange(fw.id)}
            className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss ${
              isSelected
                ? 'border-azure card-gradient shadow-[0_0_20px_rgba(0,115,236,0.15)]'
                : 'border-metal/20 card-gradient hover:border-metal/40'
            }`}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-azure">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            <div className={`mb-3 ${isSelected ? 'text-azure' : 'text-cloudy group-hover:text-azure'} transition-colors`}>
              {fw.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{fw.name}</h3>
            <p className="text-sm text-cloudy mb-2">{fw.expansion}</p>
            <p className="text-xs text-galactic">Best for: {fw.bestFor}</p>
          </button>
        )
      })}
    </div>
  )
}
