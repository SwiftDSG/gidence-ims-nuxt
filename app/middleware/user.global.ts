export default defineNuxtRouteMiddleware(async (to, from) => {
  const { refresh } = useUser()

  await refresh();

  return true;
})