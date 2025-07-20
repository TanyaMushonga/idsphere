import { useState, useEffect } from "react";
import data from "../app/data.json";

export function useCredentials() {
  const [credentials, setCredentials] = useState(data.credentials);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCredentials([...data.credentials]); // Refresh with same data for demo
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { credentials, loading, refresh };
}
