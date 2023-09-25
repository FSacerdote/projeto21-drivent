import { AuthenticatedRequest } from "@/middlewares";
import { ticketService } from "@/services";
import { Request, Response } from "express";


export async function getTicketsTypes(req: Request, res: Response) {
    const types = await ticketService.getTypes();
    res.send(types)
}

export async function getTicket (req: AuthenticatedRequest, res: Response) {
    const ticket = await ticketService.getTicket(req.userId)
    res.send(ticket)
}