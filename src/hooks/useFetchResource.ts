import { useState, useCallback } from "react";

export function useFetchResource<T = any>(
  url: string,
  sortFn?: (a: T, b: T) => number
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        // Determines the first array-like value in the result (e.g. result.courses)
        const arrKey = Object.keys(result).find((k) =>
          Array.isArray(result[k])
        );
        let items = arrKey ? (result[arrKey] as T[]) : ([] as T[]);
        if (sortFn) {
          items = items.sort(sortFn);
        }
        setData(items);
      } else {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [url, sortFn]);

  return { data, refresh, loading, error, setData };
}
