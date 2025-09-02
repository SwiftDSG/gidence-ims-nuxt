import type { ItemResponse } from "~/types/item";

export function useItem() {
  const { $fetch } = useNuxtApp();
  const { public: { api } } = useRuntimeConfig();

  const items = useState<ItemResponse[]>("items", () => []);

  const getItems = async () => {
    try {
      const response = await $fetch(`${api}/items`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      items.value = result;
    } catch {
      items.value = []
    }
  }
  const getItemByCode = async (code: string): Promise<ItemResponse | null> => {
    try {
      const response = await $fetch(`${api}/items/${code}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result
    } catch {
      return null
    }
  }
  const getItemsExpired = async (id: string) => {
    try {
      const response = await $fetch(`${api}/items/expired/${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      items.value = result;
    } catch {
      items.value = []
    }
  }
  const getItemsByCommodity = async (id: string) => {
    try {
      const response = await $fetch(`${api}/items?commodity_id=${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      items.value = result;
    } catch {
      items.value = []
    }
  }

  return { items, getItems, getItemsExpired, getItemsByCommodity, getItemByCode };
}