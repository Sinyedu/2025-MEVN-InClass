import { ref } from "vue";
import type { User } from "@/interfaces/user";
import { state } from "../globalStates/state"
export const useUsers = () => {
  const token = ref<string | null>(null);
  // const isLoggedIn = ref<boolean>(false);
  const error = ref<string | null>(null);
  const user = ref<User | null>(null);

  const name = ref<string>("");
  const email = ref<string>("");
  const password = ref<string>("");

  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(
        "https://ments-restapi.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token") || "",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Login failed: ${response.status} ${response.statusText}`,
        );
      }

      const authResponse = await response.json();

      token.value = authResponse.data.token;
      user.value = authResponse.data.userId;
      state.isLoggedIn = true

      localStorage.setItem("token", authResponse.data.token);
      localStorage.setItem("userIDToken", authResponse.data.userId);

      console.log(
        "Login successful, token stored:",
        authResponse.data.token,
        "User ID:",
        authResponse.data.userId,
      );
    } catch (err) {
      error.value =
        (err as Error).message || "An unknown error occurred during login.";
      state.isLoggedIn = false;
      console.error("Error during login:", error.value);
    }
  };

  // Additional functions for registration

  const registerUser = async (
    name: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const response = await fetch(
        "https://ments-restapi.onrender.com/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Registration failed: ${response.status} ${response.statusText}`,
        );
      }

      const authResponse = await response.json();

      token.value = authResponse.data.token;
      user.value = authResponse.data.user;
      localStorage.setItem("token", authResponse.data.token);
      console.log("Registration successful,", authResponse.data);
    } catch (err) {
      error.value =
        (err as Error).message ||
        "An unknown error occurred during registration.";
      state.isLoggedIn = false;
      console.error("Error during registration:", error.value);
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    state.isLoggedIn = false
    localStorage.removeItem("token");
    localStorage.removeItem("userIDToken");
    console.log("User logged out, token removed from localStorage.");
  };

  return {
    token,
    isLoggedIn: state.isLoggedIn,
    error,
    user,
    fetchToken,
    registerUser,
    logout,
    name,
    email,
    password,
  };
};
