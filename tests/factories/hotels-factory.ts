import { prisma } from '@/config';
import faker from '@faker-js/faker';

export async function createHotel(name?: string, image?: string){
    return prisma.hotel.create({
        data: {
            name: name || faker.company.companyName(),
            image: image || faker.image.abstract(),
            updatedAt: new Date()
        }
    })
}