import { notFoundError } from "@/errors"
import { forbiddenError } from "@/errors/forbidden-error"
import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories"

async function getBookingByUserId(userId: number){
    const booking = await bookingRepository.getBookingByUserId(userId)
    if(!booking) throw notFoundError()

    return booking
}

async function postBooking(userId: number, roomId: number){
    const room = await bookingRepository.getRoomById(roomId)
    const count = await bookingRepository.countBookingsByRoom(roomId)
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    const ticketType = ticket.TicketType

    if(room.capacity <= count) throw forbiddenError()
    if(!room) throw notFoundError
    if(!enrollment || !ticket || ticketType.isRemote || ticketType.includesHotel === false || ticket.status === 'RESERVED') throw forbiddenError()


    const bookingId = await bookingRepository.postBooking(userId, roomId)
    return bookingId
}

async function putBooking(userId: number, roomId: number, bookingId: number){
    const originalBooking = await bookingRepository.getBookingByUserId(userId)
    const room = await bookingRepository.getRoomById(roomId)
    const count = await bookingRepository.countBookingsByRoom(roomId)

    if(!originalBooking) throw forbiddenError()
    if(!room) throw notFoundError()
    if(room.capacity <= count) throw forbiddenError()

    await bookingRepository.updateBooking(roomId, bookingId)
}

export const bookingService={
    getBookingByUserId,
    postBooking,
    putBooking
}