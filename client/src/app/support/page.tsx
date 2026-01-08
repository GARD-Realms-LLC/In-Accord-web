const Support = (props: Props) => {
    return (
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-6 p-6">
          <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Section 1</h2>
            <p className="text-gray-600 dark:text-gray-400">Content for section 1</p>
          </div>
          
          <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Section 2</h2>
            <p className="text-gray-600 dark:text-gray-400">Content for section 2</p>
          </div>
          
          <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Section 3</h2>
            <p className="text-gray-600 dark:text-gray-400">Content for section 3</p>
          </div>
          
          <div className="w-full h-[250px] bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Section 4</h2>
            <p className="text-gray-600 dark:text-gray-400">Content for section 4</p>
          </div>
        </div>
        
        <footer className="text-center text-xs text-red-500 dark:text-red-400 pb-6">
          &copy; 2026 In-Accord | A GARD Realms LLC Company | Managed by: Doc Cowles.
        </footer>
      </div>
    )
}

export default Support