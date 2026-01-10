const Home = (props: Props) => {
    return (
      <div className="flex flex-col items-center h-full pb-6">
        <div className="flex flex-col justify-center items-center gap-6 flex-1">
          <h1 className="text-6xl font-bold">In-Accord</h1>
          <h2 className="text-2xl font-bold">The Premier Discord Customization an Management App.</h2>
          <h3 className="text-1xl font-bold">A standalone program which automates the installation, removal and miantenance of InAccord 
            a Discord Client Customisation App</h3>
          <h3 className="text-1xl font-bold">This project is cerated and Matained by all Adults! - In-Accord is based off the last avalable branch of GooseMod.</h3>
          
          <img 
            src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/In-Accord%20working.png" 
            alt="In-Accord" 
            className="w-200 h-200 object-contain"
          />
        </div>

        {/* Sidebar Footer */}
        <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center gap-3 mb-3">
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#5865F2]">
                <path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.19.335-.41.78-.563 1.137a18.27 18.27 0 0 0-4.01 0A8.84 8.84 0 0 0 11.422 3c-1.33.242-2.63.62-3.86 1.137C4.913 6.354 3.924 8.62 4.13 12.02c1.4 1.05 2.75 1.69 4.08 2.1.33-.46.62-.95.87-1.46-.48-.18-.94-.4-1.38-.66.12-.09.24-.18.36-.28 2.64 1.23 5.49 1.23 8.09 0 .12.1.24.19.36.28-.44.26-.9.48-1.38.66.25.51.54 1 .87 1.46 1.33-.41 2.68-1.05 4.08-2.1.33-5.22-.92-7.46-2.74-7.651ZM9.68 11.21c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.44-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Zm4.64 0c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.43-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Z" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0A66C2]">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black dark:text-white">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">&copy; 2026 In-Accord</span>
            <span className="mx-1">|</span>
            <span>GARD Realms LLC</span>
          </p>
        </div>
      </div>
    )
}

export default Home

