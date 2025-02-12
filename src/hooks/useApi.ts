import { useState, useEffect, useCallback } from 'react';
// import { ERROR_MESSAGES } from '../config/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
  dependencies?: unknown[];
  autoFetch?: boolean;
}

interface UseApiResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useApi<T>(apiCall: () => Promise<T>, options: UseApiOptions<T> = {}): UseApiResult<T> {

  const { onSuccess, onError, initialData, dependencies = [], autoFetch = true } = options;
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(autoFetch);

  const fetchData = useCallback(async () => {

    try {

      setIsLoading(true);
      setError(null);
      
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);

    } catch (err) {

      const error = err instanceof Error ? err : new Error('EEROR');
      setError(error);
      onError?.(error);

    } finally {

      setIsLoading(false);

    }

  }, [apiCall, onSuccess, onError]);

  useEffect(() => {

    if (autoFetch) fetchData();

  }, [...dependencies, autoFetch]);

  return { data, error, isLoading, refetch: fetchData };
}