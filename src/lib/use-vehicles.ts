import { useQuery } from "@tanstack/react-query";
import { getVehiclesByIds } from "@/lib/inventory.functions";

/** Fetch only the vehicles a visitor saved or is comparing. */
export function useVehiclesByIds(ids: number[]) {
  return useQuery({
    queryKey: ["vehicles-by-ids", ids],
    queryFn: () => getVehiclesByIds({ data: ids }),
    enabled: ids.length > 0,
    placeholderData: (prev) => prev,
  });
}
