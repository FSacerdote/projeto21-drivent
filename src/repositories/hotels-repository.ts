import { prisma } from "@/config"

async function getHotels(){
    const hotels = await prisma.hotel.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return hotels
}


export const hotelsRepository = {
    getHotels
}