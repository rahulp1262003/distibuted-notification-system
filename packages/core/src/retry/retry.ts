/**
 * Default maximum retry attempts.
 */
export const DEFAULT_MAX_RETRY_COUNT = 3;

/**
 * Returns the next retry count.
 *
 * @param retryCount Current retry count.
 */
export function getNextRetryCount(
    retryCount: number
): number {
    return retryCount + 1;
}

/**
 * Determines whether another retry is allowed.
 *
 * @param retryCount Current retry count.
 * @param maxRetryCount Maximum allowed retries.
 */
export function canRetry(
    retryCount: number,
    maxRetryCount = DEFAULT_MAX_RETRY_COUNT
): boolean {
    return retryCount < maxRetryCount;
}