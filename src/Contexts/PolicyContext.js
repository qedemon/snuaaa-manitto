import { createContext, useContext, useEffect, useState } from "react";
import dataConnect from "../Connections/NovaConnection";

const PolicyContext = createContext({
  policy: null,
  getPolicy: () => {},
  updatePolicy: () => {},
});

export function PolicyProvider({ children }) {
  const [policy, setPolicy] = useState(null);

  async function getPolicy() {
    try {
      const response = await dataConnect.get("/policy/getPolicies/");
      if (response.data.result === 0) {
        setPolicy((prevPolicy) => ({
          ...prevPolicy,
          ...response.data.policies,
        }));
        return response;
      }
    } catch {
      return new Error(
        "서버에서 시스템 설정을 불러오는 도중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  }

  async function updatePolicy(data) {
    try {
      const response = await dataConnect.post("/policy/setPolicy/", data);
      if (response.data.result === 0) {
        setPolicy((prevPolicy) => ({
          ...prevPolicy,
          ...response.data.policy,
        }));
        return response;
      }
    } catch {
      throw new Error(
        "시스템 설정 도중 에러가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await getPolicy();
      } catch {}
    })();
  }, []);

  return (
    <PolicyContext.Provider value={{ policy, updatePolicy, getPolicy }}>
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicy() {
  const context = useContext(PolicyContext);

  if (!context) {
    throw new Error("반드시 PolicyProvider 안에서 사용해야 합니다.");
  }

  useEffect(() => {
    (async () => {
      if (!context.policy) {
        await context.getPolicy();
      }
    })();
  }, [context]);

  return context;
}
