import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services";
import { Response } from "express";


export async function getBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    const booking = await bookingService.getBookingByUserId(userId)
    res.send(booking)
}

export async function postBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    const { roomId } = req.body;

    const bookingId = await bookingService.postBooking(userId, roomId)

    res.send({bookingId})
}