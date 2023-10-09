import { prisma } from '@/config';

async function getBookingByUserId(userId: number) {
  return prisma.booking.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: {
      id: true,
    },
  });
}

async function getRoomById(roomId: number) {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function countBookingsByRoom(roomId: number) {
  return prisma.booking.count({
    where: { roomId },
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return prisma.booking.update({
    data: {
      roomId: roomId,
    },
    where: {
      id: bookingId,
    },
    select: {
      id: true,
    },
  });
}

export const bookingRepository = {
  getBookingByUserId,
  postBooking,
  getRoomById,
  countBookingsByRoom,
  updateBooking,
};
