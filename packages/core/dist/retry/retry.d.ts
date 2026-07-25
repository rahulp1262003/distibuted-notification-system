/**
 * Default maximum retry attempts.
 */
export declare const DEFAULT_MAX_RETRY_COUNT = 3;
/**
 * Returns the next retry count.
 *
 * @param retryCount Current retry count.
 */
export declare function getNextRetryCount(retryCount: number): number;
/**
 * Determines whether another retry is allowed.
 *
 * @param retryCount Current retry count.
 * @param maxRetryCount Maximum allowed retries.
 */
export declare function canRetry(retryCount: number, maxRetryCount?: number): boolean;
//# sourceMappingURL=retry.d.ts.map