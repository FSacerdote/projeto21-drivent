import { AuthenticatedRequest } from "@/middlewares";
import { hotelsService } from "@/services/hotels-service";
import { Request, Response } from "express";


export async function getHotels(req: AuthenticatedRequest, res: Response){
    const userId = req.userId
    const hotels = await hotelsService.getHotels(userId)
    res.send(hotels)
}