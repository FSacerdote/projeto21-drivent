import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import faker from "@faker-js/faker";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import httpStatus from "http-status";
import * as jwt from 'jsonwebtoken';
import { createHotel } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", ()=>{
    
    it("Should respond with status 404 if no token is given", async ()=>{
        const result = await server.get("/hotels")
        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it("Should respond with status 404 if the token is invalid", async ()=>{
        const token = faker.lorem.word()
        const result = await server.get("/hotels").set('Authorization', `Bearer ${token}`)
        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it("Should respond with status 404 if there is no sessions for given token", async ()=>{
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    })

    describe("When token is valid", ()=>{

        it("Should return status 404 if there are no hotels", async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            const ticket = await createTicket(enrollment.id, ticketType.id, "PAID")
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })
    
        it("Should return status 404 if the user does not have an enrollment", async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user);
            const hotel = await createHotel()
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })
    
        it("Should return status 404 if the user does not have a ticket", async ()=>{
            const user = await createUser()
            const hotel = await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })

        it("Should return status 402 if the ticket status is RESERVED", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, 'RESERVED')
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED)
        })

        it("Should return status 402 if the ticketType is remote", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED)
        })

        it("Should return status 402 if the ticket doesnt include hotel", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED)
        })
    
        it("Should return an array of hotels", async ()=>{
            const user = await createUser()
            await createHotel()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.OK)
            expect(result.body).toHaveLength(2);
        })
    
    })
})



describe("GET /hotels/:hotelId", ()=>{

    it("Should respond with status 404 if no token is given", async ()=>{
        const result = await server.get("/hotels")
        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it("Should respond with status 404 if the token is invalid", async ()=>{
        const token = faker.lorem.word()
        const result = await server.get("/hotels").set('Authorization', `Bearer ${token}`)
        expect(result.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it("Should respond with status 404 if there is no sessions for given token", async ()=>{
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(result.status).toBe(httpStatus.UNAUTHORIZED);
    })

    describe("When token is valid", ()=>{
    
        it("Should return status 404 if the user does not have an enrollment", async ()=>{
            const user = await createUser()
            const token = await generateValidToken(user);
            const hotel = await createHotel()
    
            const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })
    
        it("Should return status 404 if the user does not have a ticket", async ()=>{
            const user = await createUser()
            const hotel = await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
    
            const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })

        it("Should return status 402 if the ticket status is RESERVED", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, 'RESERVED')
    
            const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED)
        })

        it("Should return status 402 if the ticketType is remote", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED)
        })

        it("Should return status 402 if the ticket doesnt include hotel", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(true, false)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED)
        })

        it("Should return 404 if the id is invalid", async ()=>{
            const user = await createUser()
            await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get('/hotels/banana').set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.NOT_FOUND)
        })
    
        it("Should return a hotel", async ()=>{
            const user = await createUser()
            const hotel = await createHotel()
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketType(false, true)
            await createTicket(enrollment.id, ticketType.id, 'PAID')
    
            const result = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`)
            expect(result.status).toBe(httpStatus.OK)
        })

    })
})