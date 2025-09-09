export default defineNuxtRouteMiddleware(async (to, from) => {
  const { logout, user } = useUser()

  console.log('auth middleware', user.value)

  if (!user.value) {
    logout();
    return "/auth";
  }

  return true;
})