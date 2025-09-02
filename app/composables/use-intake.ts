import type { IntakeRequest, IntakeResponse } from "~/types/intake";

export function useIntake() {
  const { $fetch } = useNuxtApp()
  const { public: { api } } = useRuntimeConfig()
  const { setError } = useAlert()

  const intakes = useState<IntakeResponse[]>("intakes", () => []);

  const getIntakes = async () => {
    try {
      const response = await $fetch(`${api}/intakes`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      intakes.value = result;
    } catch {
      intakes.value = []
    }
  }
  const createIntake = async (payload: IntakeRequest): Promise<IntakeResponse | null> => {
    try {
      const response = await $fetch(`${api}/intakes`, 'post', JSON.stringify(payload));

      if (response.status !== 200) throw new Error(await response.text());

      const result = await response.json();
      intakes.value.push(result);
      return result;
    } catch (e) {
      setError(e);
      return null;
    }
  }
  const acceptIntake = async (id: string): Promise<IntakeResponse | null> => {
    try {
      const response = await $fetch(`${api}/intakes/${id}/accept`, 'post');

      if (response.status !== 200) throw new Error(await response.text());

      const result = await response.json();

      const index = intakes.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        intakes.value[index] = result;
      } else {
        intakes.value.push(result);
      }

      return result;
    } catch (e) {
      setError(e);
      return null;
    }
  }
  const rejectIntake = async (id: string, reason: string): Promise<IntakeResponse | null> => {
    try {
      const response = await $fetch(`${api}/intakes/${id}/reject`, 'post', reason, {
        "Content-Type": "text/plain"
      });

      if (response.status !== 200) throw new Error(await response.text());

      const result = await response.json();

      const index = intakes.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        intakes.value[index] = result;
      } else {
        intakes.value.push(result);
      }

      return result;
    } catch (e) {
      setError(e);
      return null;
    }
  }

  return { intakes, getIntakes, createIntake, acceptIntake, rejectIntake };
}