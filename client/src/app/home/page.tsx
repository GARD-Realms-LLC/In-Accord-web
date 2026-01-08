const Home = (props: Props) => {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-6">
        <h1 className="text-6xl font-bold">In-Accord HOME</h1>
        <h2 className="text-2xl font-bold">The Premier Discord Customization an Management App.</h2>
        <h3 className="text-1xl font-bold">discription.</h3>
        <img 
          src="https://pub-7d4119dd86a04c7bbdbcc230a9d161e7.r2.dev/Images/In-Accord%20working.png" 
          alt="In-Accord" 
          className="w-256 h-256 object-contain"
        />
      </div>
    )
}

export default Home

