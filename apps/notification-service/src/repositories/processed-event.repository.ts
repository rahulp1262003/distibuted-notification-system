import { prisma } from "../lib/prisma";

export class ProcessedEventRepository {

    async exists(eventId: string) {
        return prisma.processedEvent.findUnique({
            where: {
                eventId,
            },
        });
    }

    async create(eventId: string) {
        return prisma.processedEvent.create({
            data: {
                eventId,
            },
        });
    }
}