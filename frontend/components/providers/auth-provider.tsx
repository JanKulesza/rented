"use client";
import React from "react";
import { UserRoles } from "../forms/signup-schema";
import { SigninSchemaType } from "../forms/signin-schema";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  image: { id: string; url: string };
  email: string;
  agency: string | null;
  properties: string[];
  sold: number;
  role: UserRoles;
}

interface AuthContext {
  user: User | null;
  fetchWithAuth: <T>(
    endpoint: string | URL | globalThis.Request,
    init?: RequestInit
  ) => Promise<{
    res: Response;
    data: T;
  }>;
  signout: () => void;
  signin: (values: SigninSchemaType) => Promise<Response>;
}

export const authContext = React.createContext<AuthContext>({} as AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  async function fetchWithAuth<T>(
    endpoint: string | URL | Request,
    init: RequestInit = {}
  ): Promise<{ res: Response; data: T }> {
    let didRetry = false;

    const doFetch = async (token: string | null): Promise<Response> => {
      const headers = new Headers(init.headers);
      if (token) headers.set("Authorization", `Bearer ${token}`);

      return fetch(endpoint, {
        ...init,
        headers,
        credentials: "include",
      });
    };

    let res = await doFetch(accessToken);

    if (res.status === 401 && !didRetry) {
      didRetry = true;

      const newToken = await getNewToken();

      if (newToken) {
        res = await doFetch(newToken);
      }
    }

    const data = (await res.json()) as T;
    return { res, data };
  }

  const getNewToken = async () => {
    const res = await fetch("http://localhost:8080/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });

    const newAccessToken = await res.json();
    if (newAccessToken !== accessToken && newAccessToken) {
      setAccessToken(newAccessToken);
      return newAccessToken;
    } else {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        let res;
        if (accessToken)
          res = await fetch("http://localhost:8080/api/auth/me", {
            headers: [["Authorization", `Bearer ${accessToken}`]],
            credentials: "include",
          });

        if (!accessToken) await getNewToken();

        if (res?.ok) {
          const user = await res.json();
          setUser(user);
        }
      } catch (error) {
        setAccessToken(null);
        setUser(null);
      }
    })();
  }, [accessToken]);

  const signout = async () => {
    const res = await fetch("http://localhost:8080/api/auth/signout", {
      method: "POST",
      headers: [["Authorization", `Bearer ${accessToken}`]],
      credentials: "include",
    });
    if (res.status === 200) {
      localStorage.setItem("signedout", "true");
      setAccessToken(null);
      setUser(null);
    }
  };

  const signin = async (values: SigninSchemaType) => {
    const res = await fetch("http://localhost:8080/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    });
    if (res.status === 200) {
      const newAccessToken = await res.json();
      if (newAccessToken !== accessToken && newAccessToken) {
        setAccessToken(newAccessToken);
        localStorage.removeItem("signedout");
      }
    }

    return res;
  };

  return (
    <authContext.Provider value={{ user, fetchWithAuth, signout, signin }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
