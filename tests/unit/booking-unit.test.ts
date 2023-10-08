import app, { init } from "@/app";
import { cleanDb } from "../helpers";
import supertest from "supertest";
import { bookingRepository } from "@/repositories";
import { bookingService } from "@/services";
import httpStatus from "http-status";

beforeAll(async () => {
    await init();
});
  
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app)

describe("GET /booking", ()=> {

    it("Should respond with status 400 if user doesnt have a booking", async ()=>{

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