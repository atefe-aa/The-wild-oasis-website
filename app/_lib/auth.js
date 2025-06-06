import { cookies } from "next/headers";


const BASE_URL = process.env.API_URL;
export async function signup(userData) {
  try {
    const res = await fetch(BASE_URL + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new error("Somthing went wrong while signing up!");
  }
}

export async function login({ email, password }) {
  if (!email || !password) return;

  try {
    const res = await fetch(BASE_URL + "/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error("Login failed:", errorResponse.message);
      throw new Error("Login failed");
    }

    const { data } = await res.json();

    // // Set a secure HttpOnly cookie with an expiration time
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 7); // Set to expire in 7 days
    document.cookie = `access_token=${
      data.token
    }; path=/; secure;  expires=${expirationTime.toUTCString()}`;

    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw new Error("Login failed");
  }
}

export async function getCurrentUser() {
    
const accessToken = cookies.get("access_token");
  if (!accessToken) return null;

  const res = await fetch(BASE_URL + "/user", {
    method: "GET",
    headers: {
      Accept: "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });

  const { data, error } = await res.json();
  if (error) {
    console.error(error);
    throw new Error("fetching user failed!");
  }

  return data;
}

export async function logout() {
  if (!accessToken) return null;

  try {
    const res = await fetch(BASE_URL + "/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error(`Logout request failed with status ${res.status}`);
      throw new Error("Logout request failed");
    }

    const responseBody = await res.text();

    if (responseBody) {
      try {
        const responseData = JSON.parse(responseBody);

        if (responseData.message) {
          console.error(responseData.message);
          throw new Error("Logging out failed.");
        }
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error("Logout failed due to JSON parsing error.");
      }
    }
  } catch (error) {
    console.error("Error during logging out:", error);
    throw new Error("Logout failed");
  }
}

export async function updateCurrentUser({ userData, userId }) {
  // console.log(accessToken);
  console.log("userrr",JSON.stringify(userData));
  //1. Update the password or the name
  if (!userData?.avatar) {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });
    const { data, error } = await res.json();
    if (error) throw new Error("Something went wrong updating user data.");
    // console.log(data);
    return data;
  } else {
    const formData = new FormData();
    if(userData?.name) formData.append("name", userData.name);
    formData.append("avatar", userData.avatar);

    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    const { data, error } = await res.json();
    if (error) throw new Error("Something went wrong updating user data.");
    // console.log(data);
    return data;
  }

  //2. If there is avatar to update , update user again
}
