"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MAX_RETRY_COUNT = void 0;
exports.getNextRetryCount = getNextRetryCount;
exports.canRetry = canRetry;
/**
 * Default maximum retry attempts.
 */
exports.DEFAULT_MAX_RETRY_COUNT = 3;
/**
 * Returns the next retry count.
 *
 * @param retryCount Current retry count.
 */
function getNextRetryCount(retryCount) {
    return retryCount + 1;
}
/**
 * Determines whether another retry is allowed.
 *
 * @param retryCount Current retry count.
 * @param maxRetryCount Maximum allowed retries.
 */
function canRetry(retryCount, maxRetryCount = exports.DEFAULT_MAX_RETRY_COUNT) {
    return retryCount < maxRetryCount;
}
