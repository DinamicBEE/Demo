import { useCallback, useRef, useEffect } from 'react';

interface UseDebounceOptions {
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: UseDebounceOptions = {}
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const callbackRef = useRef(callback);
  
  // Actualizar la referencia del callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  const { maxWait, leading = false, trailing = true } = options;
  
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      
      const shouldCallNow = leading && !timeoutRef.current;
      
      // Limpiar timeouts existentes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Ejecución inmediata (leading)
      if (shouldCallNow) {
        callbackRef.current(...args);
      }
      
      // Timeout normal
      timeoutRef.current = setTimeout(() => {
        if (trailing && lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
        }
        
        timeoutRef.current = null;
        lastArgsRef.current = null;
      }, delay);
      
      // Max wait (para evitar delays muy largos)
      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
            lastArgsRef.current = null;
          }
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          
          maxTimeoutRef.current = null;
        }, maxWait);
      }
    },
    [delay, leading, trailing, maxWait]
  );
  
  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);
  
  return debounced;
}