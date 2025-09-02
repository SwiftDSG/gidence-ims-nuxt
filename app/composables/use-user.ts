import type { UserResponse, UserRequest } from "~/types/user";

export default () => {
  const { $setDefaults, $fetch } = useNuxtApp();
  const { public: { api } } = useRuntimeConfig();
  const atkCookie = useCookie<string>("atk", {
    maxAge: 1800,
  });
  const rtkCookie = useCookie<string>("rtk", {
    maxAge: 86400,
  });

  const user = useState<UserResponse | null>("user", () => null);

  const getUsers = async (): Promise<UserResponse[]> => {
    try {
      const response = await $fetch(
        `${api}/users`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch (e) {
      return [];
    }
  };
  const getUser = async (id: string): Promise<UserResponse | null> => {
    try {
      const response = await $fetch(
        `${api}/users/${id}`,
        "get"
      );
      if (response.status !== 200) throw new Error("");

      const result = await response.json();

      return result;
    } catch {
      return null;
    }
  };
  const updateUser = async (id: string, request: UserRequest): Promise<UserResponse | null> => {
    try {
      const response = await $fetch(
        `${api}/users/${id}`,
        "put",
        JSON.stringify(request)
      );
      if (response.status !== 200) throw new Error("");
      const result = await response.json();

      return result
    } catch (e) {
      return null;
    }
  };
  const deleteUser = async (id: string): Promise<UserResponse[] | null> => {
    try {
      const response = await $fetch(
        `${api}/users/${id}`,
        "delete",
      );
      if (response.status !== 204) throw new Error("");

      return await getUsers();
    } catch (e) {
      return null;
    }
  };
  const createUser = async (payload: UserRequest): Promise<UserResponse | null> => {
    try {
      const response = await $fetch(
        `${api}/users`,
        "post",
        JSON.stringify(payload)
      );
      if (response.status !== 200) throw new Error("");

      const { atk: a, rtk: r, user: u }: {
        atk: string;
        rtk: string;
        user: UserResponse;
      } =
        await response.json();
      if (!a || !r) throw new Error("");
      atkCookie.value = a;
      rtkCookie.value = r;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${a}`,
        },
      });
      user.value = u;

      return u;
    } catch (e) {
      return null;
    }
  };
  const login = async (email: string, password: string): Promise<UserResponse | null> => {
    try {
      const response = await $fetch(
        `${api}/users/authenticate`,
        "post",
        JSON.stringify({
          login: [email, password]
        })
      );
      const { atk: a, rtk: r, user: u }: {
        atk: string;
        rtk: string;
        user: UserResponse;
      } =
        await response.json();
      if (!a || !r) throw new Error("");
      atkCookie.value = a;
      rtkCookie.value = r;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${a}`,
        },
      });
      user.value = u;
      return u;
    } catch {
      return null;
    }
  };
  const refresh = async (): Promise<UserResponse | null> => {
    try {
      if (!rtkCookie.value) throw new Error("COOKIE_UNAVAILABLE");
      const response = await $fetch(
        `${api}/users/authenticate`,
        "post",
        JSON.stringify({
          refresh: rtkCookie.value
        })
      );
      const { atk: a, rtk: r, user: u }: {
        atk: string;
        rtk: string;
        user: UserResponse;
      } =
        await response.json();
      if (!a || !r) throw new Error("");
      atkCookie.value = a;
      rtkCookie.value = r;
      $setDefaults({
        headers: {
          Authorization: `Bearer ${a}`,
        },
      });
      user.value = u;
      return u;
    } catch (e) {
      logout();
      return null;
    }
  };
  const logout = (): void => {
    atkCookie.value = "";
    rtkCookie.value = "";
    user.value = null;
    $setDefaults({
      headers: {
        "Authorization": '',
      },
    });
  };

  return { user, getUser, getUsers, createUser, deleteUser, updateUser, login, logout, refresh };
};
