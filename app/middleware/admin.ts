export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUser()

  if (!user.value) {
    return "/auth"
  }
  if (user.value.role !== 'admin') {
    return `/${user.value.role.user}`
  }

  return true
})