import { Router } from 'express';
import { getHotelByID, getHotels } from '@/controllers/hotels-controller';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelByID);

export { hotelsRouter };
