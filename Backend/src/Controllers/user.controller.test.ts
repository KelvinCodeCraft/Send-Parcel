import { Request, Response } from 'express';
import {
  createUser,
  loginUser,
  getUserById
} from './user.controller';
import db from '../Databasehelper/db-connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../Databasehelper/db-connection');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  describe('createUser', () => {
    it('should create a user and return a token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          phone: '1234567890'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (db.exec as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should return 500 if user creation fails', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          phone: '1234567890'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (db.exec as jest.Mock).mockResolvedValue(false);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error creating user' });
    });
  });

  describe('loginUser', () => {
    it('should login a user and return a token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const mockUser = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword',
          is_deleted: false
        }
      ];

      (db.exec as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token: 'token', user: mockUser[0] });
    });

    it('should return 500 if invalid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const mockUser = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword',
          is_deleted: false
        }
      ];

      (db.exec as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const req = {
        params: {
          id: '1'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const mockUser = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword'
        }
      ];

      (db.exec as jest.Mock).mockResolvedValue(mockUser);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser[0]);
    });

    it('should return 404 if user not found', async () => {
      const req = {
        params: {
          id: '1'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (db.exec as jest.Mock).mockResolvedValue([]);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 500 on database error', async () => {
      const req = {
        params: {
          id: '1'
        }
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      (db.exec as jest.Mock).mockRejectedValue(new Error('Database error'));

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});