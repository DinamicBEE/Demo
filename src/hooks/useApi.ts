import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
  dependencies?: unknown[];
  autoFetch?: boolean;
}

interface UseApiResult<T, A extends unknown[]> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  refetch: (...args: A) => Promise<void>;
}

export function useApi<T, A extends unknown[] = []>(   apiCall: (...args: A) => Promise<T>, options: UseApiOptions<T> = {}): UseApiResult<T, A> {
  
  const { onSuccess, onError, initialData, dependencies = [], autoFetch = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const lastArgs = useRef<A>();

  const fetchData = useCallback(async (...args: A) => {
    try {
      setIsLoading(true);
      setError(null);
      lastArgs.current = args;

      const result = await apiCall(...args);

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('ERROR');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    
    if (autoFetch)  fetchData(...(lastArgs.current ?? ([] as unknown as A)));

  }, [...dependencies, autoFetch]);

  return {
    data,
    error,
    isLoading,
    refetch: fetchData,
  };
}