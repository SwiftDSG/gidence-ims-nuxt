import type { VendorResponse } from "~/types/vendor";

export function useVendor() {
  const { $fetch } = useNuxtApp();
  const { public: { api } } = useRuntimeConfig();

  const vendors = useState<VendorResponse[]>("vendors", () => []);
  const vendorNames = useState<Record<string, string>>("vendorNames", () => ({}));

  const getVendors = async () => {
    try {
      const response = await $fetch(`${api}/vendors`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      vendors.value = result;
    } catch {
      vendors.value = []
    }
  }
  const getVendor = async (id: string): Promise<VendorResponse | null> => {
    try {
      const response = await $fetch(`${api}/vendors/${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      vendors.value.push(result);

      return result
    } catch {
      return null
    }
  }
  const getVendorName = async (id: string): Promise<string> => {
    if (vendorNames.value[id]) return vendorNames.value[id];

    const vendor = await getVendor(id);

    if (!vendor) return id;

    vendorNames.value[id] = vendor.name;
    return vendor.name;
  }


  return { vendors, getVendors, getVendor, getVendorName };
}