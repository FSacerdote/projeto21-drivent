import { ticketRepository } from "@/repositories";

async function getTypes(){
    const types = await ticketRepository.getTypes()
    return types
}

export const ticketService = {
    getTypes,
};