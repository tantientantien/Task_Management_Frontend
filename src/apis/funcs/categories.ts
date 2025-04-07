import { Categories } from "@/src/types/categories";

export const fetchCategories = async (): Promise<Categories[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_DOMAIN}/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch categories");

  const result = await res.json();
  return result.data;
};
