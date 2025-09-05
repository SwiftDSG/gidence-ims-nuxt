import type { DepartmentRequest, DepartmentResponse, DepartmentSummary } from "~/types/department";

export function useDepartment() {
  const { $fetch } = useNuxtApp();
  const { public: { api } } = useRuntimeConfig();
  const { setError } = useAlert();

  const departments = useState<DepartmentResponse[]>("departments", () => []);

  const getDepartments = async () => {
    try {
      const response = await $fetch(`${api}/departments`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      departments.value = result;
    } catch {
      departments.value = []
    }
  }
  const getDepartment = async (id: string): Promise<DepartmentResponse | null> => {
    try {
      const response = await $fetch(`${api}/departments/${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch {
      return null
    }
  }
  const getDepartmentSummary = async (id: string): Promise<DepartmentSummary | null> => {
    try {
      const response = await $fetch(`${api}/departments/${id}/summary`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch {
      return null
    }
  }
  const createDepartment = async (payload: DepartmentRequest): Promise<DepartmentResponse | null> => {
    try {
      const response = await $fetch(`${api}/departments`, 'post', JSON.stringify(payload));

      if (response.status !== 200) throw new Error(await response.text());

      const result = await response.json();
      departments.value.push(result);
      return result;
    } catch (e) {
      setError(e);
      return null;
    }
  }
  const updateDepartment = async (id: string, payload: DepartmentRequest): Promise<DepartmentResponse | null> => {
    try {
      const response = await $fetch(`${api}/departments/${id}`, 'put', JSON.stringify(payload));

      if (response.status !== 200) throw new Error(await response.text());

      const result = await response.json();

      const index = departments.value.findIndex(a => a.id === id);
      if (index > -1) {
        departments.value[index] = result;
      } else {
        departments.value.push(result);
      }

      return result;
    } catch (e) {
      setError(e);
      return null;
    }
  }
  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      const response = await $fetch(`${api}/departments/${id}`, 'delete');

      if (response.status !== 204) throw new Error(await response.text());

      const index = departments.value.findIndex(a => a.id === id);
      if (index > -1) {
        departments.value.splice(index, 1);
      }

      return true;
    } catch (e) {
      setError(e);
      return false;
    }
  }

  return { departments, getDepartments, getDepartment, getDepartmentSummary, createDepartment, updateDepartment, deleteDepartment };
}