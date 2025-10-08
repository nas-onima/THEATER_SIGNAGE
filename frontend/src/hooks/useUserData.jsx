import useSWR from "swr";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createApiUrl } from "../config/api";

export async function getIdTokenForSWR(forceRefresh) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return await user.getIdToken(forceRefresh);
  } else {
    return new Promise((resolve, reject) => {
      console.log("WAITING ON USER");
      onAuthStateChanged(auth, async (user) => {
        if (user) resolve(await user.getIdToken(forceRefresh));
        else reject(new Error("TOKEN NOT FOUND"));
      });
    });
  }
}

const fetcher = async (url) => {
  // const auth = getAuth();
  // const user = auth.currentUser;

  // if (!user) throw new Error("USER NOT LOGGED IN");

  const token = await getIdTokenForSWR();
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API ERROR: ${res.statusText}`);
  }

  return res.json();
};

export function useUserData(shouldFetch = true) {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? createApiUrl("/api/auth/user") : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 1000, // 重複リクエストを制限
      errorRetryCount: 2, // エラー時のリトライ回数を制限
      errorRetryInterval: 1000, // リトライ間隔
    }
  );

  return {
    userData: data,
    isLoading: shouldFetch ? isLoading : false,
    isError: error,
    mutate,
  };
}
