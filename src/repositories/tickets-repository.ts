import { prisma } from '@/config';

async function getTypes() {
    const types = await prisma.ticketType.findMany()
    return types
}

async function getTicket(enrollmentId: number) {
    const ticket = await prisma.ticket.findFirst({
        where: {
            enrollmentId
        }
    }) 
    return ticket
}

async function getEnrollment(userId: number){
    const enrollment = await prisma.enrollment.findUnique({
        where: { userId }
    })
    return enrollment
}

async function getType(typeId: number){
    const type = await prisma.ticketType.findUnique({
        where: {
            id: typeId
        }
    })
    return type
}

async function postTicket(ticketTypeId: number, enrollmentId: number){
    const ticket = await prisma.ticket.create({
        data: {
            ticketTypeId,
            enrollmentId,
            status: 'RESERVED'
        }
    })
    return ticket
}

export const ticketRepository = {
    getTypes,
    getTicket,
    getEnrollment,
    getType,
    postTicket,
};