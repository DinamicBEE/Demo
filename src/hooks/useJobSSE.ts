import { JobPayload, JobResponse, JobStatus } from '@models/common.model';
import { updateSalesTicket } from '@services/clousingService';
import { useState, useCallback, useRef, useEffect } from 'react';
import Cookies from "js-cookie";

export const useJobSSE = () => {
    const [loading, setLoading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isAbortedRef = useRef(false);

    useEffect(() => {
        return () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }
        };
    }, []);

     const connectToJobStream = useCallback(async (jobId: string) => {
        // Cancelar conexión anterior si existe
        if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        try {
            const token = Cookies.get("accessToken");
            const response = await fetch(
                `/api/cash-register-closure/salesTicket/noProduct/stream?jobId=${jobId}`,
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
                            handleSSEEvent(eventType, data);
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
                setLoading(false);
            }
        }
    }, []);

    const handleSSEEvent = (eventType: string, data: any) => {
        if (abortControllerRef.current?.signal.aborted) {
            return;
        }
    
        switch(data.status) {
            case 'RUNNING':
                setJobStatus(prev => prev ? { ...prev, ...data } : data);
                break;
            case 'SUCCESS':
                setJobStatus(prev => prev ? { ...prev, ...data, status: 'SUCCESS' } : data);
                setLoading(false);
                break;
            case 'FAILED':
                setError(data.error || 'Job failed');
                setJobStatus(prev => prev ? { ...prev, ...data, status: 'FAILED' } : data);
                setLoading(false);
                break;
            default:
                console.log('Unknown event type:', eventType, data);
        }
    };

    const startJob = useCallback(async (payload: JobPayload): Promise<JobResponse> => {
        setLoading(true);
        setError(null);
        setJobStatus(null);
        
        try {

            const response = await updateSalesTicket(payload.startDate, payload.endDate, payload.revenueId);
            
            if (!response) {
                throw new Error('Failed to start job');
            }
            
            const data: JobResponse = await response.data;
            setJobId(data.jobId);
            
            if (data.alreadyRunning) {
                setJobStatus({
                jobId: data.jobId,
                status: 'RUNNING',
                progress: 0,
                message: data.message
                });
            }
            
            return data;
            
        } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const executeJob = useCallback(async (payload: JobPayload) => {
        try {
        const response = await startJob(payload);
        
        if (!response.alreadyRunning && response.jobId !== null) {
            connectToJobStream(response.jobId);
        }
        
            return response;
        } catch (err) {
            console.error('Job execution failed:', err);
            throw err;
        }
    }, [startJob, connectToJobStream]);

    const cancelJob = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
        setJobId(null);
    }, []);

    const resetJob = useCallback(() => {
        cancelJob();
        setJobStatus(null);
        setError(null);
    }, [cancelJob]);


    return {
        loading,
        jobId,
        jobStatus,
        error,
        executeJob,
        cancelJob,
        resetJob
    };
}