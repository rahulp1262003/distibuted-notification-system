/**
 * Maximum retry attempts.
 */
export const MAX_RETRY_COUNT = 3;

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
 * Determines whether
 * another retry is allowed.
 *
 * @param retryCount Current retry count.
 */
export function canRetry(
    retryCount: number
): boolean {

    return retryCount < MAX_RETRY_COUNT;

}