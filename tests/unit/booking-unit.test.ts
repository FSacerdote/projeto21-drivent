import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import { bookingRepository, enrollmentRepository, ticketsRepository } from "@/repositories";
import { bookingService } from "@/services";
import httpStatus from "http-status";
import { createHotel, createRoomWithHotelId } from "../factories/hotels-factory";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});

beforeEach(() => {
    jest.clearAllMocks();
});

const server = supertest(app)

describe("GET /booking", ()=> {

    it("Should respond with status 404 if user doesnt have a booking", async ()=>{

        jest.spyOn(bookingRepository, "getBookingByUserId").mockImplementationOnce((): any => {
            return undefined;
        })

        const result = bookingService.getBookingByUserId(10)

        expect(result).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })

    })

})

describe("POST /booking", ()=> {

    it("Should respond with status 404 if room doenst exist", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return undefined
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    isRemote: false,
                    includesHotel: true,
                }
            };
        })

        const result = bookingService.postBooking(10, 10)

        expect(result).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })

    })

    it("It should respond with status 403 if the room is full", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 0
            }
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    isRemote: false,
                    includesHotel: true,
                }
            };
        })

        const result = bookingService.postBooking(10, 10)

        expect(result).rejects.toEqual({
            name: 'Forbidden',
            message: 'This action violates a business rule',
        })

    })

    it("It should respond with status 403 if ticket is remote", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 4
            }
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    isRemote: true,
                    includesHotel: true,
                }
            };
        })

        const result = bookingService.postBooking(10, 10)

        expect(result).rejects.toEqual({
            name: 'Forbidden',
            message: 'This action violates a business rule',
        })

    })

    it("It should respond with status 403 if ticket doesnt include hotel", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 4
            }
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: "PAID",
                TicketType: {
                    isRemote: false,
                    includesHotel: false,
                }
            };
        })

        const result = bookingService.postBooking(10, 10)

        expect(result).rejects.toEqual({
            name: 'Forbidden',
            message: 'This action violates a business rule',
        })

    })

    it("It should respond with status 403 if ticket isnt paid", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 4
            }
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })
        jest.spyOn(ticketsRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
            return {
                status: "RESERVED",
                TicketType: {
                    isRemote: false,
                    includesHotel: true,
                }
            };
        })

        const result = bookingService.postBooking(10, 10)

        expect(result).rejects.toEqual({
            name: 'Forbidden',
            message: 'This action violates a business rule',
        })

    })
})

describe("PUT /booking", ()=> {

    it("Should respond with status 403 if booking doesnt exist", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 4
            }
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(bookingRepository, "getBookingByUserId").mockImplementationOnce((): any => {
            return undefined
        })

        const result = bookingService.putBooking(10, 10, 10)

        expect(result).rejects.toEqual({
            name: 'Forbidden',
            message: 'This action violates a business rule',
        })

    })

    it("Should respond with status 404 if room doenst exist", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return undefined
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 2;
        })
        jest.spyOn(bookingRepository, "getBookingByUserId").mockImplementationOnce((): any => {
            return {
                id: 2
            }
        })

        const result = bookingService.putBooking(10, 10, 10)

        expect(result).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        })

    })

    it("Should respond with status 403 if room is on full capacity", async ()=>{

        jest.spyOn(bookingRepository, "getRoomById").mockImplementationOnce((): any => {
            return {
                capacity: 3
            }
        })
        jest.spyOn(bookingRepository, "countBookingsByRoom").mockImplementationOnce((): any => {
            return 3;
        })
        jest.spyOn(bookingRepository, "getBookingByUserId").mockImplementationOnce((): any => {
            return {
                id: 1
            }
        })

        const result = bookingService.putBooking(10, 10, 10)

        expect(result).rejects.toEqual({
            name: 'Forbidden',
            message: 'This action violates a business rule',
        })

    })

})
