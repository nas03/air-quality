import { Express } from 'express';
import request from 'supertest';

/**
 * Helper function to make HTTP requests to the API
 * @param app Express application
 * @param method HTTP method
 * @param url URL path
 * @param body Request body (optional)
 * @param token Access token for authentication (optional)
 * @returns Supertest response
 */
export const apiRequest = async (
  app: Express,
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  body?: any,
  token?: string
) => {
  const req = request(app)[method](`/api${url}`);
  
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
  
  if (body && (method === 'post' || method === 'put')) {
    req.send(body);
  }
  
  return req;
};

/**
 * Create a mock Express app for testing
 * This function is a placeholder - in actual tests we'll use the real Express app
 * but we'll mock the actual implementations of controllers/repositories
 */
export const createMockApp = () => {
  // Return a mock express app for testing
  const express = require('express');
  return express();
};

/**
 * Helper to generate a mock JWT token for tests requiring authentication
 */
export const generateMockToken = (role: 'user' | 'admin' = 'user') => {
  return 'mock-jwt-token';
};