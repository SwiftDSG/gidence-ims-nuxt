import type { CategoryRequest, CategoryResponse } from "~/types/category";

export function useCategory() {
  const { $fetch } = useNuxtApp();
  const { public: { api } } = useRuntimeConfig();
  const { setError } = useAlert();

  const categories = useState<CategoryResponse[]>("categories", () => []);
  const categoryNames = useState<Record<string, string>>("categoryNames", () => ({}));

  const getCategories = async () => {
    try {
      const response = await $fetch(`${api}/categories`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      categories.value = result;
    } catch {
      categories.value = []
    }
  }
  const getCategory = async (id: string): Promise<CategoryResponse | null> => {
    try {
      const response = await $fetch(`${api}/categories/${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      categories.value.push(result);

      return result
    } catch {
      return null
    }
  }
  const getCategoryName = async (id: string): Promise<string> => {
    if (categoryNames.value[id]) return categoryNames.value[id];

    const category = await getCategory(id);

    if (!category) return id;

    categoryNames.value[id] = category.name;
    return category.name;
  }
  const createCategory = async (payload: CategoryRequest): Promise<CategoryResponse | null> => {
    try {
      const response = await $fetch(`${api}/categories`, 'post', JSON.stringify(payload));

      if (response.status !== 200) throw new Error(await response.text());

      const result = await response.json();
      categories.value.push(result);
      return result;
    } catch (e) {
      setError(e);
      return null;
    }
  }

  return { categories, getCategories, getCategory, getCategoryName, createCategory };
}