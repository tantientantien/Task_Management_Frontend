// src/app/dashboard/layout.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useUserStore } from "@/src/hooks/use-user-store";
import { AppSidebar } from "@/src/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { Bell, ChatBubbleQuestion } from "iconoir-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isSignedIn } = useUser();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10);
  });

  useEffect(() => {
    if (isSignedIn && user) {
      useUserStore.getState().setUser({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
      });
    }
  }, [isSignedIn, user]);

  return (
    <SidebarProvider>
      <AppSidebar/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`h-20 flex items-center px-4 justify-between bg-white border-gray-200 border-b transition-colors duration-300 ${
            scrolled ? "shadow-lg" : "shadow-sm"
          }`}
        >
          <SidebarTrigger />
          <div className="flex items-center border w-[50%] pr-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
            <input
              className="w-full h-full pl-5 outline-none placeholder-gray-500 text-sm"
              placeholder="Search"
              type="text"
            />
            <svg
              fill="#6B7280"
              viewBox="0 0 30 30"
              height="22"
              width="22"
              y="0px"
              x="0px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
            </svg>
            <div className="h-6 w-px bg-gray-500/50"></div>
            <svg
              fill="#6B7280"
              // xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 32.00 32.00"
              width="20px"
            >
              <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
              <g
                strokeWidth="0.064"
                stroke="#CCCCCC"
                strokeLinejoin="round"
                strokeLinecap="round"
                id="SVGRepo_tracerCarrier"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <title>microphone</title>
                <desc>Created with Sketch Beta.</desc>
                <defs></defs>
                <g
                  fillRule="evenodd"
                  fill="none"
                  strokeWidth="0.00032"
                  id="Page-1"
                >
                  <g
                    fill="#6B7280"
                    transform="translate(-105.000000, -307.000000)"
                    id="Icon-Set"
                  >
                    <path
                      id="microphone"
                      d="M111,314 C111,311.238 113.239,309 116,309 C118.761,309 121,311.238 121,314 L121,324 C121,326.762 118.761,329 116,329 C113.239,329 111,326.762 111,324 L111,314 L111,314 Z M116,331 C119.866,331 123,327.866 123,324 L123,314 C123,310.134 119.866,307 116,307 C112.134,307 109,310.134 109,314 L109,324 C109,327.866 112.134,331 116,331 L116,331 Z M127,326 L125,326 C124.089,330.007 120.282,333 116,333 C111.718,333 107.911,330.007 107,326 L105,326 C105.883,330.799 110.063,334.51 115,334.955 L115,337 L114,337 C113.448,337 113,337.448 113,338 C113,338.553 113.448,339 114,339 L118,339 C118.552,339 119,338.553 119,338 C119,337.448 118.552,337 118,337 L117,337 L117,334.955 C121.937,334.51 126.117,330.799 127,326 L127,326 Z"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div className="flex gap-2 mr-3">
            <ChatBubbleQuestion width={18} />
            <Bell width={18} />
          </div>
        </motion.header>

        <main className={`flex-1 p-6 overflow-auto bg-gray-50 text-black`}>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

// <div className="flex h-screen bg-gray-50">
//       <Sidebar
//         isOpen={isSidebarOpen}
// toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
// user={user}
//       />

// <div className="flex-1 flex flex-col overflow-hidden">
//   <motion.header
//     initial={{ y: -50, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     transition={{ duration: 0.5 }}
//     className={`h-20 flex items-center justify-between bg-white border-gray-200 border-b transition-colors duration-300 ${
//       scrolled ? "shadow-lg" : "shadow-sm"
//     }`}
//   >
//     <div className="w-full flex justify-between items-center px-6">
//       <h1 className="text-xl font-bold text-black">Task Management</h1>
//     </div>
//   </motion.header>

//   <main className={`flex-1 p-6 overflow-auto bg-gray-50 text-black ${isSidebarOpen ? 'overflow-x-scroll' : 'overflow-x-hidden'}`}>
//     {children}
//   </main>
// </div>
//     </div>
