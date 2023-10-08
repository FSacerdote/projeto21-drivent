import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createUser } from "../factories";
import * as jwt from 'jsonwebtoken';
import { createBooking } from "../factories/booking-factory";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app)

describe("GET /booking", ()=>{

    it('Should respond with status 401 if no token is given', async ()=> {
        const result = await server.get("/booking")

        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it('Should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word()

        const result = await server.get("/booking").set('Authorization', `Bearer ${token}`);

        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it('Should respond with status 401 if given token doesnt match any session', async ()=>{
        const user = await createUser()

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const result = await server.get("/booking").set('Authorization', `Bearer ${token}`);
        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    describe("When token is valid", ()=> {
        it("Should respond with status 200 and return a valid body", async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user)
            const hotel = await createHotel()
            const room = await createRoomWithHotelId(hotel.id)
            const booking = await createBooking(user, room)

            const result = await server.get("/booking").set('Authorization', `Bearer ${token}`);

            expect(result.statusCode).toBe(httpStatus.OK)
            expect(result.body).toEqual({
                id: booking.id,
                Room: {
                    capacity: room.capacity,
                    hotelId: room.hotelId,
                    id: room.id,
                    name: room.name,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            })
        })
    })

})


