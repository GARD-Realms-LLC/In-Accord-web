"use client";

import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsDarkMode, setIsSidebarCollapsed} from '@/state';
import { Bell, Menu, Moon, Settings, Sun } from 'lucide-react';
import Link from 'next/link';

  const Navbar = () => {
    const dispatch = useAppDispatch();
      const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
      );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const toggleSidebar = () => {
      dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };
    
    const toggleDarkMode = () => {
      console.log('Dark mode toggle clicked. Current isDarkMode state:', isDarkMode);
      const newState = !isDarkMode;
      console.log('Dispatching new state:', newState);
      dispatch(setIsDarkMode(newState));
    };

    return (
  <div 
    className="flex justify-between items-center w-full mb-7 px-4 py-3 rounded-lg"
    style={{
      backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
      color: isDarkMode ? '#f3f4f6' : '#111827'
    }}
  >
         
     {/*left side */} 
      <div className="flex justify-between items-center gap-5">
      <div className="hidden md:flex justify-between items-center gap-5">
      </div>  
      <button 
        className="px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600" 
        onClick={toggleSidebar}
        >
         <Menu className="w-4 h-4 dark:text-gray-300" />
        </button>
      </div>
      <div className='relative'>
        <input 
          type="search" 
          placeholder="Start typing  to search" 
          className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-blue-500"
          />
        <div className='absolute inset-y-0 left-0 pl- flex items-center pointer-events-none'>
          <Bell className="text-gray-500 dark:text-gray-400" size={20} />
        </div>
       </div> 

      {/*Right Side */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
        </div>  
           <button 
             onClick={toggleDarkMode}
             className="px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-gray-600 z-50"
             type="button"
           >
            {isDarkMode ? (
              <Sun className="cursor-pointer text-gray-500 dark:text-yellow-400" size={24} />
            ): (
              <Moon className="cursor-pointer text-gray-500 dark:text-gray-300" size={24} />
            )}
           </button>
           <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center 
            px-[0.4rem] py-1 text-xs leading-none text-red-100 bg-red-600 rounded-full">
              3
            </span>
          </div>
           <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-3" />
           <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9">
              image</div>
              <span className="font-semibold">DocRST</span>
            </div>  
           </div>
           <Link href="/settings">
           <Settings className="cursor-pointer text-gray-500" size={24} />
           </Link>
         </div> 
    );
  };
export default Navbar;
