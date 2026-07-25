export const CHANNELS = {
    EMAIL: "EMAIL",
    SMS: "SMS",
} as const;

export type Channel =
    typeof CHANNELS[keyof typeof CHANNELS];