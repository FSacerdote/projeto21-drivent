import { ticketService } from "@/services";
import { Request, Response } from "express";


export async function getTicketsTypes(req: Request, res: Response) {
    const types = await ticketService.getTypes();
    res.send(types)
}