import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services";
import { Response } from "express";


export async function getBooking(req: AuthenticatedRequest, res: Response){
    const { userId } = req;

    const booking = await bookingService.getBookingByUserId(userId)
    res.send(booking)
}