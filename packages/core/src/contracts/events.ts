/**
 * Base event shared by all notification events.
 */
export interface BaseNotificationEvent {
    notificationId: string;
    userId: string;
    eventType: string;
}

/**
 * Event published when a notification is created.
 */
export interface NotificationCreatedEvent extends BaseNotificationEvent {
    eventId: string;
    payload: Record<string, unknown>;
}

/**
 * Supported notification channels.
 */
export type NotificationChannel = "EMAIL" | "SMS";

/**
 * Base event used for retry and DLQ processing.
 */
export interface RetryableEvent extends BaseNotificationEvent {
    channel: NotificationChannel;
    retryCount: number;
}

/**
 * Retry event.
 */
export interface RetryEvent extends RetryableEvent {}

/**
 * Dead Letter Queue event.
 */
export interface DLQEvent extends RetryableEvent {}

/**
 * Event used by the ingestion service for fan-out.
 */
export interface FanOutEvent extends BaseNotificationEvent {}