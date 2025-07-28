export function BlogHeader() {
  return (
    <header className="page-header mb-12">
      <h1 className="text-5xl font-bold text-white mb-4 flex items-center gap-4">
        <span className="text-green-400">Dev</span>Blog
        <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
          3+ Years Experience
        </span>
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl">
        Production-tested insights from architecting and scaling systems that serve millions of users. 
        Real-world solutions, battle-tested patterns, and hard-earned lessons from the trenches.
      </p>
    </header>
  )
}