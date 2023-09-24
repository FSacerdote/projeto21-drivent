import { prisma } from '@/config';

async function getTypes() {
    const types = await prisma.ticketType.findMany()
    return types
}

export const ticketRepository = {
    getTypes,
};