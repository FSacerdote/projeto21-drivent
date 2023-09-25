import { Router } from 'express';
import { getTicket, getTicketsTypes, postTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketsTypes);
ticketsRouter.get('/', authenticateToken, getTicket);
ticketsRouter.post('/', authenticateToken, validateBody(createTicketSchema), postTicket);

export { ticketsRouter };
