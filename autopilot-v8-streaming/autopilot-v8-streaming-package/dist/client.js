/**
 * AUTOPILOT V8 - STREAMING CLIENT COMPONENT
 * React component for consuming streaming API responses
 *
 * Features:
 * - Real-time streaming updates
 * - Progress indicators
 * - Cache status display
 * - Error handling
 */
'use client';
import { useState, useCallback, useRef } from 'react';
// ============================================================================
// STREAMING API CLIENT
// ============================================================================
class AutopilotStreamingClient {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    /**
     * Standard evaluation (with caching)
     */
    async evaluate(documentType, scenario, data, options) {
        const response = await fetch(`${this.apiUrl}/autopilot/evaluate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documentType,
                scenario,
                data,
                options
            })
        });
        if (!response.ok) {
            throw new Error(`Evaluation failed: ${response.statusText}`);
        }
        const cacheStatus = response.headers.get('X-Cache');
        const result = await response.json();
        return {
            ...result,
            cacheHit: cacheStatus === 'HIT'
        };
    }
    /**
     * Streaming evaluation
     */
    async *streamEvaluate(documentType, scenario, data, options) {
        const response = await fetch(`${this.apiUrl}/autopilot/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                documentType,
                scenario,
                data,
                options
            })
        });
        if (!response.ok) {
            throw new Error(`Stream failed: ${response.statusText}`);
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                // Process complete messages
                const lines = buffer.split('\n\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        try {
                            const chunk = JSON.parse(data);
                            yield chunk;
                        }
                        catch (e) {
                            console.error('Failed to parse chunk:', data);
                        }
                    }
                }
            }
        }
        finally {
            reader.releaseLock();
        }
    }
    /**
     * Invalidate cache
     */
    async invalidateCache(pattern) {
        const response = await fetch(`${this.apiUrl}/autopilot/cache/invalidate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pattern })
        });
        if (!response.ok) {
            throw new Error(`Cache invalidation failed: ${response.statusText}`);
        }
        return await response.json();
    }
}
// ============================================================================
// REACT HOOK
// ============================================================================
export function useAutopilotStreaming(apiUrl) {
    const [state, setState] = useState({
        isStreaming: false,
        content: '',
        result: null,
        error: null,
        startTime: null,
        endTime: null,
        cacheHit: false
    });
    const clientRef = useRef();
    if (!clientRef.current) {
        clientRef.current = new AutopilotStreamingClient(apiUrl);
    }
    const streamEvaluate = useCallback(async (documentType, scenario, data, options) => {
        setState({
            isStreaming: true,
            content: '',
            result: null,
            error: null,
            startTime: Date.now(),
            endTime: null,
            cacheHit: false
        });
        try {
            const client = clientRef.current;
            for await (const chunk of client.streamEvaluate(documentType, scenario, data, options)) {
                switch (chunk.type) {
                    case 'start':
                        // Stream started
                        break;
                    case 'content':
                        setState(prev => ({
                            ...prev,
                            content: prev.content + chunk.data.text
                        }));
                        break;
                    case 'complete':
                        setState(prev => ({
                            ...prev,
                            isStreaming: false,
                            result: chunk.data,
                            endTime: Date.now(),
                            cacheHit: chunk.data.cached || false
                        }));
                        break;
                    case 'error':
                        setState(prev => ({
                            ...prev,
                            isStreaming: false,
                            error: chunk.data.error,
                            endTime: Date.now()
                        }));
                        break;
                }
            }
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                isStreaming: false,
                error: error.message || 'Streaming failed',
                endTime: Date.now()
            }));
        }
    }, []);
    const evaluate = useCallback(async (documentType, scenario, data, options) => {
        setState({
            isStreaming: true,
            content: '',
            result: null,
            error: null,
            startTime: Date.now(),
            endTime: null,
            cacheHit: false
        });
        try {
            const client = clientRef.current;
            const result = await client.evaluate(documentType, scenario, data, options);
            setState({
                isStreaming: false,
                content: result.explanation || '',
                result,
                error: null,
                startTime: state.startTime,
                endTime: Date.now(),
                cacheHit: result.cacheHit || false
            });
        }
        catch (error) {
            setState(prev => ({
                ...prev,
                isStreaming: false,
                error: error.message || 'Evaluation failed',
                endTime: Date.now()
            }));
        }
    }, [state.startTime]);
    const invalidateCache = useCallback(async (pattern) => {
        const client = clientRef.current;
        return await client.invalidateCache(pattern);
    }, []);
    const reset = useCallback(() => {
        setState({
            isStreaming: false,
            content: '',
            result: null,
            error: null,
            startTime: null,
            endTime: null,
            cacheHit: false
        });
    }, []);
    return {
        ...state,
        streamEvaluate,
        evaluate,
        invalidateCache,
        reset,
        processingTime: state.startTime && state.endTime
            ? state.endTime - state.startTime
            : null
    };
}
export function AutopilotStreamingUI({ apiUrl, documentType, scenario, data, useStreaming = true, cacheEnabled = true }) {
    const { isStreaming, content, result, error, cacheHit, processingTime, streamEvaluate, evaluate, reset } = useAutopilotStreaming(apiUrl);
    const handleEvaluate = async () => {
        if (useStreaming) {
            await streamEvaluate(documentType, scenario, data, { cacheEnabled });
        }
        else {
            await evaluate(documentType, scenario, data, { cacheEnabled });
        }
    };
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex gap-4" },
            React.createElement("button", { onClick: handleEvaluate, disabled: isStreaming, className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" }, isStreaming ? 'Оброблення...' : 'Оцінити документ'),
            result && (React.createElement("button", { onClick: reset, className: "px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors" }, "\u0421\u043A\u0438\u043D\u0443\u0442\u0438"))),
        (isStreaming || result || error) && (React.createElement("div", { className: "bg-gray-800 border border-gray-700 rounded-lg p-4" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("div", { className: "flex items-center gap-3" },
                    isStreaming && (React.createElement("div", { className: "animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" })),
                    React.createElement("div", { className: "text-sm" },
                        isStreaming && React.createElement("span", { className: "text-blue-400" }, "\u041E\u0431\u0440\u043E\u0431\u043A\u0430..."),
                        result && !isStreaming && (React.createElement("span", { className: "text-green-400" }, "\u2713 \u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E")),
                        error && React.createElement("span", { className: "text-red-400" }, "\u2717 \u041F\u043E\u043C\u0438\u043B\u043A\u0430"))),
                React.createElement("div", { className: "flex items-center gap-4 text-xs text-gray-400" },
                    cacheHit && (React.createElement("span", { className: "flex items-center gap-1" },
                        React.createElement("span", { className: "w-2 h-2 bg-green-500 rounded-full" }),
                        "\u041A\u0435\u0448")),
                    processingTime !== null && (React.createElement("span", null,
                        processingTime,
                        "ms")),
                    useStreaming && (React.createElement("span", { className: "flex items-center gap-1" },
                        React.createElement("span", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse" }),
                        "Stream")))))),
        isStreaming && content && (React.createElement("div", { className: "bg-gray-900 border border-gray-700 rounded-lg p-6" },
            React.createElement("h3", { className: "text-sm font-semibold text-gray-400 mb-3" }, "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C\u0443 \u0447\u0430\u0441\u0456:"),
            React.createElement("div", { className: "text-gray-300 whitespace-pre-wrap font-mono text-sm" },
                content,
                React.createElement("span", { className: "inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" })))),
        error && (React.createElement("div", { className: "bg-red-900/20 border border-red-700 rounded-lg p-6" },
            React.createElement("h3", { className: "text-red-400 font-semibold mb-2" }, "\u041F\u043E\u043C\u0438\u043B\u043A\u0430"),
            React.createElement("p", { className: "text-gray-300" }, error))),
        result && !isStreaming && (React.createElement("div", { className: "space-y-4" },
            React.createElement("div", { className: `border rounded-lg p-6 ${result.decision === 'approve' ? 'bg-green-900/20 border-green-700' :
                    result.decision === 'conditional_approve' ? 'bg-yellow-900/20 border-yellow-700' :
                        result.decision === 'reject' ? 'bg-red-900/20 border-red-700' :
                            'bg-blue-900/20 border-blue-700'}` },
                React.createElement("div", { className: "flex items-center justify-between mb-4" },
                    React.createElement("h3", { className: "text-xl font-bold text-white" },
                        result.decision === 'approve' && '✓ Схвалено',
                        result.decision === 'conditional_approve' && '⚠ Умовно схвалено',
                        result.decision === 'reject' && '✗ Відхилено',
                        result.decision === 'refer' && '→ Перенаправлено'),
                    React.createElement("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${result.risk_level === 'low' ? 'bg-green-500/20 text-green-400' :
                            result.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                result.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-red-500/20 text-red-400'}` },
                        "\u0420\u0438\u0437\u0438\u043A: ",
                        result.risk_level)),
                React.createElement("p", { className: "text-gray-300 mb-4" }, result.explanation),
                result.conditions && result.conditions.length > 0 && (React.createElement("div", { className: "bg-gray-800/50 rounded p-4" },
                    React.createElement("h4", { className: "text-sm font-semibold text-gray-400 mb-2" }, "\u0423\u043C\u043E\u0432\u0438:"),
                    React.createElement("ul", { className: "list-disc list-inside space-y-1 text-gray-300 text-sm" }, result.conditions.map((condition, i) => (React.createElement("li", { key: i }, condition))))))),
            React.createElement("div", { className: "bg-gray-800 border border-gray-700 rounded-lg p-4" },
                React.createElement("h4", { className: "text-sm font-semibold text-gray-400 mb-3" }, "\u041C\u0435\u0442\u0440\u0438\u043A\u0438 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0456"),
                React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" },
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-gray-400" }, "\u0427\u0430\u0441 \u043E\u0431\u0440\u043E\u0431\u043A\u0438"),
                        React.createElement("div", { className: "text-white font-mono" },
                            processingTime,
                            "ms")),
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-gray-400" }, "\u041A\u0435\u0448"),
                        React.createElement("div", { className: "text-white font-mono" }, cacheHit ? '✓ HIT' : '✗ MISS')),
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-gray-400" }, "\u0420\u0435\u0436\u0438\u043C"),
                        React.createElement("div", { className: "text-white font-mono" }, useStreaming ? 'Stream' : 'Standard')),
                    React.createElement("div", null,
                        React.createElement("div", { className: "text-gray-400" }, "\u0412\u0456\u043A \u043A\u0435\u0448\u0443"),
                        React.createElement("div", { className: "text-white font-mono" }, result.cache_age_seconds ? `${result.cache_age_seconds}s` : 'N/A'))))))));
}
// ============================================================================
// USAGE EXAMPLE
// ============================================================================
export function AutopilotDemoPage() {
    const sampleData = {
        company_name: "ТОВ Інноваційні Рішення",
        edrpou: "12345678",
        contract_value: 500000,
        delivery_terms: "30 днів",
        payment_terms: "передоплата 50%"
    };
    return (React.createElement("div", { className: "max-w-4xl mx-auto p-6" },
        React.createElement("h1", { className: "text-3xl font-bold text-white mb-8" }, "Autopilot v8 - Streaming Demo"),
        React.createElement(AutopilotStreamingUI, { apiUrl: "https://ivyar-api.ivyar-gov.workers.dev", documentType: "procurement", scenario: "under_threshold", data: sampleData, useStreaming: true, cacheEnabled: true })));
}
