
import { fetchUsers } from "@/src/apis/funcs/users";
import { getQueryClient } from "@/src/apis/handler/get-query-client";
import Team from "@/src/components/dashboard/team";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

const TeamPage: React.FC = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: fetchUsers
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Team />
    </HydrationBoundary>
  )
}

export default TeamPage;