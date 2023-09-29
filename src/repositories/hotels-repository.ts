import { prisma } from '@/config';

async function getHotels() {
  const hotels = await prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return hotels;
}

async function getHotelById(hotelId: number) {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      Rooms: true,
    },
  });
  return hotel;
}

export const hotelsRepository = {
  getHotels,
  getHotelById,
};
