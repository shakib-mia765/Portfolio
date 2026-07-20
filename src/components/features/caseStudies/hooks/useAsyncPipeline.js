import { useReducer, useCallback, useMemo } from 'react';

// 1. IN-MEMORY CONFIGURATION MANIFEST (Pure JSON-Driven Isolation Layer)
const PIPELINE_MANIFEST_JSON = {
    "HOOK_METADATA": {
        "signature": "ASYNC-PIPE-v804.2-PROD",
        "runtimeTier": "Reactive-State-Orchestrator",
        "specification": "Deterministic-FSM-Reducer"
    },
    "STABILITY_POLICIES": {
        "enableExecutionLogTraces": true,
        "defaultTimeoutThresholdMs": 10000,
        "automaticErrorMutingBypass": false
    },
    "INITIAL_STATE_SCHEMA": {
        "status": "SYSTEM_IDLE",
        "dataStream": null,
        "executionError": null,
        "activeTransactionId": null,
        "performanceMetrics": {
            "executionLatencyMs": 0,
            "resolvedEpochTimestamp": null
        }
    }
};

// 2. DOMAIN LAYER INVARIANT TYPES (Immutable Registries)
const PIPELINE_TRANSITIONS = {
    DISPATCH_EXECUTION: 'TRANSITION_DISPATCH_EXECUTION',
    RESOLVE_SUCCESS: 'TRANSITION_RESOLVE_SUCCESS',
    REJECT_FAULT: 'TRANSITION_REJECT_FAULT',
    RESET_PIPELINE: 'TRANSITION_RESET_PIPELINE'
};

const PIPELINE_STATUS_STATES = {
    IDLE: 'SYSTEM_IDLE',
    PENDING: 'SYSTEM_PENDING_COMPUTATION',
    RESOLVED: 'SYSTEM_RESOLVED_STABLE',
    REJECTED: 'SYSTEM_REJECTED_FAULT_DIVERGENCE'
};

// 3. FSM REDUCER STRATEGY MAP (Completely replaces messy nested if-else/switch blocks)
const StateTransitionStrategyMap = {
    [PIPELINE_TRANSITIONS.DISPATCH_EXECUTION]: (currentState, actionPayload) => ({
        ...currentState,
        status: PIPELINE_STATUS_STATES.PENDING,
        activeTransactionId: actionPayload.transactionId,
        executionError: null
    }),

    [PIPELINE_TRANSITIONS.RESOLVE_SUCCESS]: (currentState, actionPayload) => {
        // Guard Clause: Drop state mutation if the incoming transaction is stale (Race Condition Prevention)
        if (currentState.activeTransactionId !== actionPayload.transactionId) return currentState;

        return {
            ...currentState,
            status: PIPELINE_STATUS_STATES.RESOLVED,
            dataStream: actionPayload.data,
            executionError: null,
            performanceMetrics: {
                executionLatencyMs: actionPayload.latencyMs,
                resolvedEpochTimestamp: Date.now()
            }
        };
    },

    [PIPELINE_TRANSITIONS.REJECT_FAULT]: (currentState, actionPayload) => {
        if (currentState.activeTransactionId !== actionPayload.transactionId) return currentState;

        return {
            ...currentState,
            status: PIPELINE_STATUS_STATES.REJECTED,
            dataStream: null,
            executionError: actionPayload.error
        };
    },

    [PIPELINE_TRANSITIONS.RESET_PIPELINE]: () => JSON.parse(JSON.stringify(PIPELINE_MANIFEST_JSON.INITIAL_STATE_SCHEMA))
};

/**
 * Pure Functional Central FSM Reducer Router Core
 * @private
 */
function asyncPipelineReducerRouter(state, action) {
    const computeTargetStrategyFn = StateTransitionStrategyMap[action.type];
    // Guard Clause: If action type is unregistered, fallback safely to existing state references
    if (!computeTargetStrategyFn) return state;
    return computeTargetStrategyFn(state, action.payload);
}

// ============================================================================
// CORE CUSTOM HOOK INTERFACE (Declarative Framework-Decoupled Bridge Architecture)
// ============================================================================
export default function useAsyncPipeline(asynchronousTaskFunction, pipelineOptions = {}) {
    const [pipelineState, dispatchTransition] = useReducer(
        asyncPipelineReducerRouter,
        JSON.parse(JSON.stringify(PIPELINE_MANIFEST_JSON.INITIAL_STATE_SCHEMA))
    );

    /**
     * High-Order Execution Pipeline Gatekeeper.
     * Wraps async logic blocks inside single-flight atomic transaction handles.
     */
    const executePipelineTask = useCallback(async (...functionalArgumentsArray) => {
        const microsecondStartTimestamp = performance.now();
        const uniqueTransactionFingerprint = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        dispatchTransition({
            type: PIPELINE_TRANSITIONS.DISPATCH_EXECUTION,
            payload: { transactionId: uniqueTransactionFingerprint }
        });

        try {
            // Formulate a native Promise race layer to enforce execution timeouts
            const executionTimeoutAbortPromise = new Promise((_, rejectTimeout) =>
                setTimeout(
                    () => rejectTimeout(new Error('PIPELINE_EXECUTION_TIMED_OUT_THRESHOLD')),
                    pipelineOptions.timeoutMs || PIPELINE_MANIFEST_JSON.STABILITY_POLICIES.defaultTimeoutThresholdMs
                )
            );

            // Execute task concurrently against timeout boundaries
            const resolvedTaskPayload = await Promise.race([
                asynchronousTaskFunction(...functionalArgumentsArray),
                executionTimeoutAbortPromise
            ]);

            const microsecondEndTimestamp = performance.now();
            const calculatedLatencyDurationMs = parseFloat((microsecondEndTimestamp - microsecondStartTimestamp).toFixed(4));

            dispatchTransition({
                type: PIPELINE_TRANSITIONS.RESOLVE_SUCCESS,
                payload: {
                    transactionId: uniqueTransactionFingerprint,
                    data: resolvedTaskPayload,
                    latencyMs: calculatedLatencyDurationMs
                }
            });

            return resolvedTaskPayload;

        } catch (pipelineExceptionBlock) {
            dispatchTransition({
                type: PIPELINE_TRANSITIONS.REJECT_FAULT,
                payload: {
                    transactionId: uniqueTransactionFingerprint,
                    error: pipelineExceptionBlock.message || 'UNEXPECTED_PIPELINE_FAULT_NODE'
                }
            });

            // Guard Clause: Mute explicit downstream bubbling exceptions if parameters align
            if (PIPELINE_MANIFEST_JSON.STABILITY_POLICIES.automaticErrorMutingBypass) return null;
            throw pipelineExceptionBlock;
        }
    }, [asynchronousTaskFunction, pipelineOptions.timeoutMs]);

    /**
     * Flushes FSM registers down to clean initial parameters
     */
    const flushPipelineEngine = useCallback(() => {
        dispatchTransition({ type: PIPELINE_TRANSITIONS.RESET_PIPELINE });
    }, []);

    // Memoize active runtime states to protect the UI reconciliation layer from redundant redraws
    const processedUiStateInvariants = useMemo(() => ({
        isLoading: pipelineState.status === PIPELINE_STATUS_STATES.PENDING,
        isSuccess: pipelineState.status === PIPELINE_STATUS_STATES.RESOLVED,
        isError: pipelineState.status === PIPELINE_STATUS_STATES.REJECTED,
        rawState: pipelineState
    }), [pipelineState]);

    return [processedUiStateInvariants, executePipelineTask, flushPipelineEngine];
}

export const fetchPipelineEngineTailwindStyles = (currentStatusState) => {
    const dynamicUiThemesObjectMap = {
        [PIPELINE_STATUS_STATES.IDLE]: { bg: 'bg-slate-900/40', text: 'text-slate-400', border: 'border-slate-800', badge: 'bg-slate-950 text-slate-500', descriptor: 'ORCHESTRATOR ENGINE STANDBY' },
        [PIPELINE_STATUS_STATES.PENDING]: { bg: 'bg-slate-900/40', text: 'text-amber-400', border: 'border-amber-500/20', badge: 'bg-amber-950 text-amber-400 animate-pulse', descriptor: 'COMPUTING STREAM PIPELINES ACTIVE' },
        [PIPELINE_STATUS_STATES.RESOLVED]: { bg: 'bg-slate-900/40', text: 'text-emerald-400', border: 'border-emerald-500/20', badge: 'bg-emerald-950 text-emerald-400', descriptor: 'TRANSACTION CONVERGED SMOOTHLY' },
        [PIPELINE_STATUS_STATES.REJECTED]: { bg: 'bg-slate-900/40', text: 'text-rose-400', border: 'border-rose-500/20', badge: 'bg-rose-950 text-rose-400', descriptor: 'CRITICAL INVARIANT REJECTION EVENT' }
    };

    return dynamicUiThemesObjectMap[currentStatusState] || dynamicUiThemesObjectMap[PIPELINE_STATUS_STATES.IDLE];
};
