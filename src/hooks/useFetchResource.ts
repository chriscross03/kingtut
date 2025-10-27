import { useState, useCallback, useEffect } from "react";

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

        // Only update state if data has actually changed
        setData((prevData) => {
          if (JSON.stringify(prevData) === JSON.stringify(items)) {
            return prevData; // No change, return previous data
          }
          return items; // Data changed, update
        });
      } else {
        throw new Error(`Request failed: ${response.status}`);
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [url, sortFn]);

  // Automatically fetch data when component mounts, then on URL/sortFn changes
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!isMounted) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          const arrKey = Object.keys(result).find((k) =>
            Array.isArray(result[k])
          );
          let items = arrKey ? (result[arrKey] as T[]) : ([] as T[]);
          if (sortFn) {
            items = items.sort(sortFn);
          }

          if (isMounted) {
            setData((prevData) => {
              if (JSON.stringify(prevData) === JSON.stringify(items)) {
                return prevData;
              }
              return items;
            });
          }
        } else {
          throw new Error(`Request failed: ${response.status}`);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, sortFn]);

  return { data, refresh, loading, error, setData };
}
