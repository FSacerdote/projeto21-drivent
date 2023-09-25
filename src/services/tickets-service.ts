import { notFoundError } from "@/errors";
import { ticketRepository } from "@/repositories";

async function getTypes(){
    const types = await ticketRepository.getTypes()
    return types
}

async function getTicket(userId: number){
    const enrollment = await ticketRepository.getEnrollment(userId)
    if(!enrollment) throw notFoundError()
    const ticket = await ticketRepository.getTicket(enrollment.id)
    if(!ticket) throw notFoundError()
    const type = await ticketRepository.getType(ticket.ticketTypeId)
    return {
        ...ticket,
        TicketType: type,
    }
}

async function postTicket(userId: number, ticketTypeId: number){
    const enrollment = await ticketRepository.getEnrollment(userId)
    if(!enrollment) throw notFoundError()
    const type = await ticketRepository.getType(ticketTypeId)
    if(!type) throw notFoundError()
    const ticket = await ticketRepository.postTicket(ticketTypeId, enrollment.id)
    return{
        ...ticket,
        TicketType: type,
    }
}

export const ticketService = {
    getTypes,
    getTicket,
    postTicket,
};