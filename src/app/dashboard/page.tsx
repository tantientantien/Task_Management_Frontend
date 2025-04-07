// src/app/dashboard/page.tsx
// import { SignedIn, SignedOut } from '@clerk/nextjs';

// export default function DashboardPage() {
//   return (
//     <div>
//       <SignedIn>
//         <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
//         <p>This is the dashboard content area for signed-in users.</p>
//       </SignedIn>
//       <SignedOut>
//         <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
//         <p>You need to sign in to access the dashboard.</p>
//       </SignedOut>
//     </div>
//   );
// }

import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../../apis/handler/get-query-client";
import TaskList from "../../components/tasks/task-list";
import { fetchTasks } from "@/src/apis/funcs/tasks";

const Dashboard: React.FC = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskList />
    </HydrationBoundary>
  );
};

export default Dashboard;
