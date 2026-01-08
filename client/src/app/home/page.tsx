const Home = (props: Props) => {
    return (
      <div className="flex flex-col justify-between items-center h-full gap-6 pb-6">
        <div className="flex flex-col justify-center items-center gap-6 flex-1">
          <h1 className="text-6xl font-bold">In-Accord</h1>
          <h2 className="text-2xl font-bold">The Premier Discord Customization an Management App.</h2>
          <h3 className="text-1xl font-bold">A standalone program which automates the installation, removal and miantenance of InAccord 
            a Discord Client Customisation App</h3>
          <h3 className="text-1xl font-bold">This project is cerated and Matained by all Adults! - In-Accord is based off the last avalable branch of GooseMod.</h3>
        </div>


        <img 
          src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/In-Accord%20working.png" 
          alt="In-Accord" 
          className="w-200 h-200 object-contain"
        />


        <footer className="text-center text-xs text-red-500 dark:text-red-400">
          &copy; 2026 In-Accord | A GARD Realms LLC Company | Managed by: Doc Cowles.
        </footer>
      </div>
    )
}

export default Home

