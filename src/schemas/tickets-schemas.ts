import Joi from 'joi';
import { CreateTicket } from '@/protocols';

export const createTicketSchema = Joi.object<CreateTicket>({
  ticketTypeId: Joi.number().integer().required(),
});
