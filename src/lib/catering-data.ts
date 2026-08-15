import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image_key: string;
  is_available: boolean;
  sort_order: number;
};

export type Package = {
  id: string;
  name: string;
  price_label: string;
  price_per_person: number | null;
  description: string;
  features: string[];
  is_recommended: boolean;
  sort_order: number;
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review: string;
  event_type: string;
  is_published: boolean;
};

export const MENU_CATEGORIES = [
  "Starters",
  "Vegetarian",
  "Non-Vegetarian",
  "Biryani",
  "Main Course",
  "Indian Breads",
  "Desserts",
  "Beverages",
] as const;

export function useMenuItems() {
  return useQuery({
    queryKey: ["menu_items"],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MenuItem[];
    },
  });
}

export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async (): Promise<Package[]> => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Package[];
    },
  });
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews", "published"],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });
}
