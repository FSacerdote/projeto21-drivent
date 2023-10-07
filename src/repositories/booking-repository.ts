import { prisma } from "@/config"


async function getBookingByUserId(userId: number){
    return prisma.booking.findUnique({
        where: {
            userId
        },
        select: {
            id: true,
            Room: true
        }
    })
}

export const bookingRepository = {
    getBookingByUserId
}