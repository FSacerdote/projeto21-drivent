import { notFoundError, paymentRequiredError } from "@/errors"
import { enrollmentRepository, ticketsRepository } from "@/repositories"
import { hotelsRepository } from "@/repositories/hotels-repository"

async function getHotels(userId: number){
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if(!enrollment) throw notFoundError()
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if(!ticket) throw notFoundError()
    if(!ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status !== "PAID") throw paymentRequiredError()

    const hotels = await hotelsRepository.getHotels()
    return hotels 
}


export const hotelsService = {  
    getHotels, 
}