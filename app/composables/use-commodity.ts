import type { CommodityResponse } from "~/types/commodity";

export function useCommodity() {
  const { $fetch } = useNuxtApp()
  const { public: { api } } = useRuntimeConfig()

  const commodities = useState<CommodityResponse[]>("commodities", () => []);
  const commodityNames = useState<Record<string, string>>("commodityNames", () => ({}));

  const getCommodities = async () => {
    try {
      const response = await $fetch(`${api}/commodities`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      commodities.value = result;
    } catch {
      commodities.value = []
    }
  }
  const getCommodity = async (id: string): Promise<CommodityResponse | null> => {
    try {
      const response = await $fetch(`${api}/commodities/${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      commodities.value.push(result);

      return result
    } catch {
      return null
    }
  }
  const getCommodityName = async (id: string): Promise<string> => {
    if (commodityNames.value[id]) return commodityNames.value[id];

    const commodity = await getCommodity(id);

    if (!commodity) return id;

    commodityNames.value[id] = commodity.name;
    return commodity.name;
  }

  return { commodities, getCommodities, getCommodity, getCommodityName };
}