import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import authConfig from '../config/auth.json'; 

import User from '../models/User';
import userView from '../views/users_view';

function generateToken(params = {}) {
  return jwt.sign(
    params,
    authConfig.secret,
    { expiresIn: 86400 }
  );
}

export default {
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      password,
    } = request.body;
    
    try {
      const usersRepository = getRepository(User);
      
      if(await usersRepository.findOne({email})) {
        return response.status(409).json({
          error: 'User already exists'
        });
      }

      bcrypt.hash(password, 10)
      .then(hash => {
        const data = {
          name,
          email,
          password: hash,
        };

        const user = usersRepository.create(data);
    
        usersRepository.save(user);
    
        return response.status(201).json(
          userView.render(user, generateToken({ id: user.id }))
        );
      })
      .catch(err => {
        return response.status(500).json({
          error: err.message
        });
      });
    } catch(err) {
      return response.status(400).json({
        error: err.message
      });
    }
  },

  async authenticate(request: Request, response: Response) {
    try {
      const {
        email,
        password
      } = request.body;
  
      const usersRepository = getRepository(User);
      
      const user = await usersRepository.findOne({email});

      if (!user) {
        return response.status(400).json({
          error: "User not found"
        });
      }
      
      bcrypt.compare(password, user.password)
      .then(result => {
        return result ? (
          response.status(201).json(
            userView.render(user, generateToken({ id: user.id }))
          )
        ) : (
          response.status(400).json({
            error: "Invalid password"
          })
        );
      })
      .catch(err => {
        return response.status(500).json({error: err.message});
      });
    } catch(err) {
      return response.status(500).json({error: err.message});
    }
  }
}