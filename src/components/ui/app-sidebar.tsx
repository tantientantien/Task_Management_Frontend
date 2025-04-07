"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { Folder, Group, Settings } from "iconoir-react";
import { ChartArea, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartArea,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: Folder,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Group,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <Sidebar >
      <SidebarHeader className="flex">
        <div className="flex items-center justify-between">
          <Image
            src="/images/logo.png"
            width={60}
            height={60}
            alt="Picture of the author"
          />
          <p className="ml-2 font-medium text-violet-700 text-[1.1rem]">Task Management</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "text-gray-500 hover:!bg-gray-200 hover:!text-gray-500",
                        isActive && "hover:!bg-violet-200 hover:!text-violet-500 bg-violet-100 text-violet-500 animate-fade-in"
                      )}
                    >
                      <Link href={item.url} className="!text-[0.9rem] !h-12 font-medium">
                        <item.icon className="mr-2 !w-5 !h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex mb-3">
        <div className="flex">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "2.5rem",
                  height: "2.5rem",
                },
              },
            }}
          />
          <div className="text-foreground ml-3">
            <p className="text-sm font-medium">
              {(user as { firstName?: string; lastName?: string })?.firstName}{" "}
              {(user as { firstName?: string; lastName?: string })?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {
                (user as { primaryEmailAddress?: { emailAddress: string } })
                  ?.primaryEmailAddress?.emailAddress
              }
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

// import { UserButton } from "@clerk/nextjs";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   CandlestickChart,
//   Folder,
//   Group,
//   HomeSimpleDoor,
//   NavArrowLeft,
//   NavArrowRight,
//   Settings,
// } from "iconoir-react";

// import {
//   Sidebar as ShadcnSidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarTrigger,
// } from "@/src/components/ui/sidebar";
// import { cn } from "@/lib/utils";

// export function AppSidebar({
//   isOpen,
//   toggleOpen,
//   user,
// }: {
//   isOpen: boolean;
//   toggleOpen: () => void;
//   user: unknown;
// }) {
//   const pathname = usePathname();

//   const navItems = [
//     { name: "Home", icon: HomeSimpleDoor, href: "/dashboard" },
//     { name: "Analytics", icon: CandlestickChart, href: "/dashboard/analytics" },
//     { name: "Projects", icon: Folder, href: "/dashboard/projects" },
//     { name: "Team", icon: Group, href: "/dashboard/team" },
//     { name: "Settings", icon: Settings, href: "/dashboard/settings" },
//   ];

//   return (
//     <ShadcnSidebar
//       collapsible="icon"
//       className={cn("h-full border-r border-border", isOpen ? "w-64" : "w-20")}
//     >
//       {/* Profile Section */}
//       <SidebarHeader className="flex items-center justify-center h-16 gap-3 pb-6 mb-6 mt-1.5">
//         <div className={cn("mt-1", isOpen ? "" : "mx-auto")}>
//           <UserButton
//             appearance={{
//               elements: {
//                 userButtonAvatarBox: {
//                   width: "2.5rem",
//                   height: "2.5rem",
//                 },
//               },
//             }}
//           />
//         </div>
//         {isOpen && (
//           <div className="text-foreground">
//             <p className="text-sm font-medium">
//               {(user as { firstName?: string; lastName?: string })?.firstName}{" "}
//               {(user as { firstName?: string; lastName?: string })?.lastName}
//             </p>
//             <p className="text-xs text-muted-foreground">
//               {
//                 (user as { primaryEmailAddress?: { emailAddress: string } })
//                   ?.primaryEmailAddress?.emailAddress
//               }
//             </p>
//           </div>
//         )}
//       </SidebarHeader>

//       {/* Navigation Items */}
//       <SidebarContent>
//         <SidebarMenu>
//           {navItems.map((item) => {
//             const isActive =
//               pathname === item.href ||
//               (item.name === "Home" && pathname === "/dashboard");
//             return (
//               <SidebarMenuItem key={item.name}>
//                 <Link href={item.href}>
//                   <SidebarMenuButton
//                     asChild
//                     className={cn(
//                       "group flex items-center p-3 rounded-lg transition-all duration-200 mb-3",
//                       isActive
//                         ? "bg-primary text-primary-foreground"
//                         : "hover:bg-accent"
//                     )}
//                   >
//                     <div>
//                       <item.icon
//                         className={cn(
//                           "h-6 w-6",
//                           isOpen ? "mr-3" : "mx-auto",
//                           isActive
//                             ? "text-primary-foreground"
//                             : "text-muted-foreground group-hover:text-primary"
//                         )}
//                       />
//                       {isOpen && (
//                         <span
//                           className={cn(
//                             "text-sm",
//                             isActive
//                               ? "text-primary-foreground"
//                               : "text-muted-foreground group-hover:text-primary"
//                           )}
//                         >
//                           {item.name}
//                         </span>
//                       )}
//                     </div>
//                   </SidebarMenuButton>
//                 </Link>
//               </SidebarMenuItem>
//             );
//           })}
//         </SidebarMenu>
//       </SidebarContent>

//       {/* Toggle Button */}
// <SidebarFooter>
//   <SidebarTrigger />
// </SidebarFooter>
//     </ShadcnSidebar>
//   );
// }
