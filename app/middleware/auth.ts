export default defineNuxtRouteMiddleware(async (to, from) => {
  const { logout, user } = useUser()

  if (!user.value) {
    logout();
    return "/auth";
  }

  return true;
})