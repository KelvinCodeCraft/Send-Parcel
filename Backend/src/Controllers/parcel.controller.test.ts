import { Request, Response } from 'express';
import { getParcelsByEmail } from './parcel.controller';
import db from '../Databasehelper/db-connection';

jest.mock('../Databasehelper/db-connection');

describe('Parcel Controller', () => {
  describe('getParcelsByEmail', () => {
    it('should return parcels for senderEmail', async () => {
      const req = {
        query: {
          senderEmail: 'test@example.com',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockResult = [
        {
          id: 1,
          senderEmail: 'test@example.com',
          receiverEmail: 'receiver@example.com',
          // other fields...
        },
      ];

      (db.exec as jest.Mock).mockResolvedValue(mockResult);

      const next = jest.fn();
      await getParcelsByEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 if no parcels found', async () => {
      const req = {
        query: {
          senderEmail: 'test@example.com',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.exec as jest.Mock).mockResolvedValue([]);

      const next = jest.fn();
      await getParcelsByEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No parcels found' });
    });

    it('should return 500 on database error', async () => {
      const req = {
        query: {
          senderEmail: 'test@example.com',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.exec as jest.Mock).mockRejectedValue(new Error('Database error'));

      const next = jest.fn();
      await getParcelsByEmail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error('Database error') });
    });
  });
});