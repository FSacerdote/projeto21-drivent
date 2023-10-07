import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const bookingRouter = Router()

bookingRouter
    .all("/*", authenticateToken)
    .get("/", )
    .post("/", )
    .put("/:bookingId", )

export { bookingRouter }