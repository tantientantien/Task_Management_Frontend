import { User } from "@/src/types/user";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  const result = await res.json();
  return result.data;
};
