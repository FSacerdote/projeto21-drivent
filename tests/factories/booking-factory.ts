import { Room, User } from '@prisma/client';
import { prisma } from '@/config';

export async function createBooking(user: User, room: Room) {
  return prisma.booking.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });
}
