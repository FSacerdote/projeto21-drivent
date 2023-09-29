import { AuthenticatedRequest } from "@/middlewares";
import { hotelsService } from "@/services/hotels-service";
import { Response } from "express";


export async function getHotels(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    const hotels = await hotelsService.getHotels(userId)
    res.send(hotels)
}

export async function getHotelByID(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    const hotelId = Number(req.params.hotelId)
    const hotel = await hotelsService.getHotelById(hotelId, userId)
    res.send(hotel)
}