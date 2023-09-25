import { AuthenticatedRequest } from "@/middlewares";
import { ticketService } from "@/services";
import { Request, Response } from "express";
import httpStatus from "http-status";


export async function getTicketsTypes(req: Request, res: Response) {
    const types = await ticketService.getTypes();
    res.send(types)
}

export async function getTicket (req: AuthenticatedRequest, res: Response) {
    const userId: number = req.userId
    const ticket = await ticketService.getTicket(userId)
    res.send(ticket)
}

export async function postTicket (req: AuthenticatedRequest, res: Response){
    const ticketTypeId: number = req.body.ticketTypeId
    const userId: number = req.userId
    const ticket = await ticketService.postTicket(userId, ticketTypeId)
    res.status(httpStatus.CREATED).send(ticket)
}