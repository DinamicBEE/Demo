import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

export const useNotificationSSE = () => {
    const [error, setError] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0)
    const eventSourceRef = useRef<EventSource | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        };
    }, []);

    const connectToNotification = useCallback(async () => {
        // Cancelar conexión anterior si existe
        if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const token = Cookies.get("accessToken");
            const user = Cookies.get("username");
            const response = await fetch(
                `/api/cash-register-closure/api/notifications/stream?${user ? `userId=${encodeURIComponent(user)}` : ""}`,
                {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
                signal: abortController.signal
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No reader available');
            }

            // Leer el stream
            const processStream = async () => {
                let buffer = '';

                while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('Stream complete');
                    break;
                }

                // Decodificar el chunk
                buffer += decoder.decode(value, { stream: true });
                
                // Procesar eventos SSE (formato: "event: name\ndata: {json}\n\n")
                const events = buffer.split('\n\n');
                buffer = events.pop() || '';

                for (const event of events) {
                    const lines = event.split('\n');
                    let eventType = 'message';
                    let eventData = '';

                    for (const line of lines) {
                    if (line.startsWith('event:')) {
                        eventType = line.substring(6).trim();
                    } else if (line.startsWith('data:')) {
                        eventData = line.substring(5).trim();
                    }
                    }

                    if (eventData) {
                        try {
                            const data = JSON.parse(eventData);
                            setCount(data);
                        } catch (e) {
                            console.error('Failed to parse SSE data:', e);
                        }
                    }
                }
                }
            };

            processStream();

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Stream aborted');
            } else {
                console.error('SSE connection error:', error);
                setError('Connection error');
            }
        }
    }, []);

    const cancelJob = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const resetNotification = useCallback(() => {
        cancelJob();
        setError(null);
        setCount(0);
    }, [cancelJob]);

    return {
        connectToNotification,
        count,
        setCount,
        error,
        resetNotification
    }
}