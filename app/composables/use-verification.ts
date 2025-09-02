import type { VerificationRequest, VerificationResponse } from "~/types/verification";

export function useVerification() {
  const { $fetch } = useNuxtApp();
  const { public: { api } } = useRuntimeConfig();
  const { setError } = useAlert()

  const getVerificationsByItem = async (id: string): Promise<VerificationResponse[]> => {
    try {
      const response = await $fetch(`${api}/verifications?item_id=${id}`, 'get');

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result
    } catch {
      return []
    }
  }
  const createVerification = async (payload: VerificationRequest): Promise<VerificationResponse | null> => {
    try {
      const response = await $fetch(`${api}/verifications`, 'post', JSON.stringify(payload));

      if (response.status !== 200) throw new Error("");

      const result = await response.json();
      return result
    } catch (e) {
      setError(e)
      return null
    }
  }

  return { getVerificationsByItem, createVerification };
}