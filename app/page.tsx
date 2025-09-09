import React from 'react';
import SmartDashboard from './dashboard/page';
import "./globals.css"

export default function SmartHomeDashboard() {
  return (
    // <div className="flex bg-blue-50 min-h-screen w-full">
    //   {/* Sidebar */}
    //   <div className="bg-white rounded-lg p-6 flex flex-col justify-between m-4 shadow-sm w-64 hidden md:flex">
    //     {/* Profile Section */}
    //     <div>
    //       <div className="flex items-center gap-3 mb-8">
    //         <div className="w-12 h-12 rounded-full overflow-hidden">
    //           <img src="/api/placeholder/50/50" alt="Profile" className="w-full h-full object-cover" />
    //         </div>
    //         <div>
    //           <p className="text-sm text-gray-600">Hello 👋</p>
    //           <p className="font-semibold text-gray-800">Famuagun OLumuyiwa</p>
    //         </div>
    //       </div>

    //       {/* Menu Section */}
    //       <p className="text-gray-500 mb-4">Menu</p>
    //       <nav className="flex flex-col gap-4">
    //         <a href="#" className="flex items-center gap-3 text-blue-500 font-medium">
    //           <Home size={20} />
    //           <span>Home</span>
    //         </a>
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <BarChart2 size={20} />
    //           <span>Analytics & Report</span>
    //         </a>
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <MessageSquare size={20} />
    //           <span>Control Features</span>
    //         </a>
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <MessageSquare size={20} />
    //           <span>Notifications (2)</span>
    //         </a>
    //       </nav>

    //       {/* Settings Section */}
    //       <p className="text-gray-500 mt-8 mb-4">Settings</p>
    //       <nav className="flex flex-col gap-4">
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <User size={20} />
    //           <span>Profile</span>
    //         </a>
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <HelpCircle size={20} />
    //           <span>FAQ's</span>
    //         </a>
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <Phone size={20} />
    //           <span>Contact us</span>
    //         </a>
    //         <a href="#" className="flex items-center gap-3 text-gray-500">
    //           <LogOut size={20} />
    //           <span>Logout</span>
    //         </a>
    //       </nav>
    //     </div>
    //   </div>

    //   {/* Main Content */}
    //   <div className="flex-1 p-4 overflow-auto">
    //     {/* Header */}
    //     <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
    //       <h1 className="text-2xl font-semibold text-gray-800">Real time Monitoring</h1>
          
    //       <div className="relative flex-grow max-w-xl">
    //         <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
    //           <Search size={18} className="text-gray-400" />
    //         </div>
    //         <input 
    //           type="text" 
    //           placeholder="Search Anything Here..." 
    //           className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none"
    //         />
    //       </div>
          
    //       <div className="flex items-center gap-3">
    //         <div className="flex items-center">
    //           <div className="w-12 h-6 rounded-full bg-gray-200 flex items-center px-1 relative">
    //             <div className="w-4 h-4 rounded-full bg-red-500 absolute right-1"></div>
    //           </div>
    //         </div>
    //         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
    //           <Bell size={18} />
    //         </div>
    //         <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
    //           <HelpCircle size={18} />
    //         </div>
    //       </div>
    //     </div>

    //     {/* Room Cards */}
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    //       <div className="bg-blue-500 rounded-xl p-6 text-white">
    //         <div className="bg-blue-600 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
    //           <img src="/volt.svg" alt="Kitchen Icon" />
    //         </div>
    //         <h3 className="text-xl font-medium mb-1">Voltage Reading</h3>
    //         <p className="text-blue-100">0V</p>
    //       </div>

    //       <div className="bg-white rounded-xl p-6">
    //         <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
    //           <img src="/amp.svg" alt="Living Room Icon" />
    //         </div>
    //         <h3 className="text-xl font-medium mb-1 text-gray-800">Current Reading</h3>
    //         <p className="text-gray-500">0A</p>
    //       </div>

    //       <div className="bg-white rounded-xl p-6">
    //         <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
    //           <img src="/peak.svg" alt="Bedroom Icon" />
    //         </div>
    //         <h3 className="text-xl font-medium mb-1 text-gray-800">Peak usage times</h3>
    //         <p className="text-gray-500">0</p>
    //       </div>

    //       <div className="bg-white rounded-xl p-6">
    //         <div className="bg-blue-100 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
    //           <img src="/electric_meter_24dp.svg" alt="Bathroom Icon" />
    //         </div>
    //         <h3 className="text-xl font-medium mb-1 text-gray-800">Real-time cost calculation </h3>
    //         <p className="text-gray-500">N 0</p>
    //       </div>
    //     </div>

    //     {/* Levels Section */}
    //     <div className="flex justify-between items-center mb-4">
    //       <h2 className="text-xl font-semibold text-gray-800">Levels</h2>
    //       <button className="text-blue-500">
    //         <ChevronRight size={24} />
    //       </button>
    //     </div>

    //     {/* Charts */}
    //     <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-8">
    //       {/* Humidity Chart */}

    //       {/* Energy Chart */}
    //       <div className="bg-white rounded-xl p-6">
    //         <div className="flex justify-between items-center mb-6">
    //           <div className="flex items-center gap-3">
    //             <div className="bg-purple-500 rounded-lg w-10 h-10 flex items-center justify-center">
    //               <img src="/energy.svg" alt="Energy Icon" />
    //             </div>
    //             <h3 className="text-xl font-medium text-gray-700">Energy</h3>
    //           </div>
    //           <div className="flex items-center gap-2">
    //             <span className="text-gray-600">Week</span>
    //             <ChevronRight size={16} className="text-gray-600" />
    //           </div>
    //         </div>
    //         <div className="h-48 flex items-end justify-between">
    //           {/* Bar chart representation */}
    //           <div className="flex items-end justify-between w-full gap-2">
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-16 bg-blue-100 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Sun</p>
    //             </div>
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-12 bg-blue-100 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Mon</p>
    //             </div>
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-24 bg-blue-100 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Tue</p>
    //             </div>
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-14 bg-blue-100 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Wed</p>
    //             </div>
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-20 bg-blue-100 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Thu</p>
    //             </div>
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-32 bg-blue-500 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Fri</p>
    //             </div>
    //             <div className="flex flex-col items-center">
    //               <div className="w-8 h-10 bg-blue-100 rounded-sm"></div>
    //               <p className="mt-2 text-sm text-gray-500">Sat</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Devices Section */}
    //     <div className="flex justify-between items-center mb-4">
    //       <h2 className="text-xl font-semibold text-gray-800">Devices</h2>
    //       <button className="text-blue-500">
    //         <ChevronRight size={24} />
    //       </button>
    //     </div>

    //     {/* Device Controls */}
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    //       <div className="bg-white rounded-xl p-6">
    //         <div className="flex justify-between items-center mb-6">
    //           <p className="text-gray-500 font-medium">Off</p>
    //           <div className="w-12 h-6 bg-gray-200 rounded-full relative flex items-center">
    //             <div className="w-5 h-5 rounded-full bg-gray-400 absolute left-1"></div>
    //           </div>
    //         </div>
    //         <div className="bg-blue-500 rounded-lg w-12 h-12 flex items-center justify-center mb-2">
    //           <img src="/api/placeholder/24/24" alt="AC Icon" />
    //         </div>
    //         <p className="text-gray-700 font-medium">Air Conditioner</p>
    //       </div>

    //       <div className="bg-blue-100 rounded-xl p-6">
    //         <div className="flex justify-between items-center mb-6">
    //           <p className="text-gray-500 font-medium">On</p>
    //           <div className="w-12 h-6 bg-blue-500 rounded-full relative flex items-center">
    //             <div className="w-5 h-5 rounded-full bg-white absolute right-1"></div>
    //           </div>
    //         </div>
    //         <div className="bg-blue-500 rounded-lg w-12 h-12 flex items-center justify-center mb-2">
    //           <img src="/api/placeholder/24/24" alt="TV Icon" />
    //         </div>
    //         <p className="text-gray-700 font-medium">Smart TV</p>
    //       </div>

    //       <div className="bg-white rounded-xl p-6">
    //         <div className="flex justify-between items-center mb-6">
    //           <p className="text-gray-500 font-medium">Off</p>
    //           <div className="w-12 h-6 bg-gray-200 rounded-full relative flex items-center">
    //             <div className="w-5 h-5 rounded-full bg-gray-400 absolute left-1"></div>
    //           </div>
    //         </div>
    //         <div className="bg-blue-500 rounded-lg w-12 h-12 flex items-center justify-center mb-2">
    //           <img src="/api/placeholder/24/24" alt="Coffee Icon" />
    //         </div>
    //         <p className="text-gray-700 font-medium">Coffee Machine</p>
    //       </div>

    //       <div className="bg-blue-100 rounded-xl p-6">
    //         <div className="flex justify-between items-center mb-6">
    //           <p className="text-gray-500 font-medium">On</p>
    //           <div className="w-12 h-6 bg-blue-500 rounded-full relative flex items-center">
    //             <div className="w-5 h-5 rounded-full bg-white absolute right-1"></div>
    //           </div>
    //         </div>
    //         <div className="bg-blue-500 rounded-lg w-12 h-12 flex items-center justify-center mb-2">
    //           <img src="/api/placeholder/24/24" alt="Refrigerator Icon" />
    //         </div>
    //         <p className="text-gray-700 font-medium">Refrigerator</p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Right Sidebar */}
    //   <div className="bg-white rounded-lg p-6 m-4 shadow-sm w-80 hidden lg:block">
    //     {/* Members Section */}
    //     <div className="mb-8">
    //       <div className="flex justify-between items-center mb-4">
    //         <h2 className="text-xl font-semibold text-gray-800">User Activity Log</h2>
    //         <a href="#" className="text-blue-500 text-sm">View all</a>
    //       </div>
          
    //       <div className="space-y-4">
    //         <div className="flex items-center gap-3">
    //           <div className="w-10 h-10 rounded-full overflow-hidden">
    //             <img src="/api/placeholder/40/40" alt="Member" className="w-full h-full object-cover" />
    //           </div>
    //           <div>
    //             <p className="font-medium text-gray-800">date & time</p>
    //             <p className="text-sm text-gray-500">Updated Proile</p>
    //           </div>
    //         </div>
            
    //         <div className="flex items-center gap-3">
    //           <div className="w-10 h-10 rounded-full overflow-hidden">
    //             <img src="/api/placeholder/40/40" alt="Member" className="w-full h-full object-cover" />
    //           </div>
    //           <div>
    //             <p className="font-medium text-gray-800">date & time</p>
    //             <p className="text-sm text-gray-500">Checked Homepage</p>
    //           </div>
    //         </div>
            
    //         <div className="flex items-center gap-3">
    //           <div className="w-10 h-10 rounded-full overflow-hidden">
    //             <img src="/api/placeholder/40/40" alt="Member" className="w-full h-full object-cover" />
    //           </div>
    //           <div>
    //             <p className="font-medium text-gray-800">date & time</p>
    //             <p className="text-sm text-gray-500">Logged in</p>
    //           </div>
    //         </div>
    //       </div>
          
    //       <button className="w-full mt-4 bg-blue-100 text-blue-500 py-3 rounded-xl font-medium">
    //         Edit
    //       </button>
    //     </div>
        
    //     {/* History Section */}
    //     <div>
    //       <div className="flex justify-between items-center mb-4">
    //         <h2 className="text-xl font-semibold text-gray-800">History</h2>
    //         <a href="#" className="text-blue-500 text-sm">View all</a>
    //       </div>
          
    //       <div className="space-y-4">
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-start gap-3">
    //             <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
    //             <div>
    //               <p className="font-medium text-gray-800">Today</p>
    //               <p className="text-sm text-gray-500">5% consumed • peak: 19W</p>
    //             </div>
    //           </div>
    //           <p className="text-gray-600">03:20</p>
    //         </div>
            
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-start gap-3">
    //             <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
    //             <div>
    //               <p className="font-medium text-gray-800">Yesterday</p>
    //               <p className="text-sm text-gray-500">5% consumed • peak: 19W</p>
    //             </div>
    //           </div>
    //           <p className="text-gray-600">01:48</p>
    //         </div>
            
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-start gap-3">
    //             <div className="mt-1 w-2 h-2 rounded-full bg-red-500"></div>
    //             <div>
    //               <p className="font-medium text-gray-800">12/03/2025</p>
    //               <p className="text-sm text-gray-500">5% consumed • peak: 19W</p>
    //             </div>
    //           </div>
    //           <p className="text-gray-600">11:36</p>
    //         </div>
            
    //         <div className="flex items-center justify-between">
    //           <div className="flex items-start gap-3">
    //             <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
    //             <div>
    //               <p className="font-medium text-gray-800">11/03/2025</p>
    //               <p className="text-sm text-gray-500">5% consumed • peak: 19W</p>
    //             </div>
    //           </div>
    //           <p className="text-gray-600">09:15</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div>
      <SmartDashboard />
    </div>
  );
}