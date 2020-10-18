import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import userView from '../views/users_view';

import bcrypt from 'bcrypt';

import User from '../models/User';

export default {

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      password,
    } = request.body;

    try {
      const usersRepository = getRepository(User);
      
      if(await usersRepository.findOneOrFail({email})) {
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
          userView.render(user)
        );
      })
      .catch(err => {
        return response.status(500).json({
          error: err.message
        });
      });
    } catch(err) {
      return response.status(400).json({
        error: "User registration failed"
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
            userView.render(user)
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