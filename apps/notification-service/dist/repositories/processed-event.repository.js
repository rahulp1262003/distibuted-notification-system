"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessedEventRepository = void 0;
const prisma_1 = require("../lib/prisma");
class ProcessedEventRepository {
    async exists(eventId) {
        return prisma_1.prisma.processedEvent.findUnique({
            where: {
                eventId,
            },
        });
    }
    async create(eventId) {
        return prisma_1.prisma.processedEvent.create({
            data: {
                eventId,
            },
        });
    }
}
exports.ProcessedEventRepository = ProcessedEventRepository;
