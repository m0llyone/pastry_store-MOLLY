import bcrypt from 'bcrypt';
import { Role } from '../models/roleModel.js';
import { User } from '../models/userModel.js';
import { validationResult } from 'express-validator';
import { generateTokens } from '../services/tokenService.js';

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) return res.status(400).json({ message: errors.errors[0].msg });
      const { email, password } = req.body;

      const candidate = await User.findOne({ email });
      if (candidate)
        return res.status(400).json({ message: 'User with the same email already exist' });

      const hashPassword = bcrypt.hashSync(password, 7);

      const userRole = await Role.findOne({ value: 'USER' });
      if (!userRole) {
        return res.status(500).json({ message: 'Role not found' });
      }

      const user = new User({ email, password: hashPassword, roles: [userRole.value] });
      await user.save();
      res.status(201).json({ message: 'User was created successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Registration error' });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User is not found' });

      const unHashPassword = bcrypt.compareSync(password, user.password);
      if (!unHashPassword) return res.status(400).json({ message: 'Password is incorrect' });

      const token = generateTokens({ id: user.id, role: user.roles });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await User.find();
      res.header('Content-Range', `items 0-${users.length - 1}/${users.length}`);
      if (!users.length) {
        res.status(404).json({ message: `Cannot find any users` });
      } else {
        res.status(201).json(users);
      }
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async auth(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const token = generateTokens({ id: user.id, role: user.roles });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (e) {
      res.send({ message: 'Server error' });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Id not specified' });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async editUser(req, res) {
    try {
      const { id } = req.params;
      let userData = req.body;

      if (userData.password) {
        userData.password = bcrypt.hashSync(userData.password, 7);
      }

      const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: `Cannot find any user with ID: ${id}` });
      }

      res.header('Content-Range', 'items 0-9/100');
      return res.status(200).json(updatedUser);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) res.status(404).json({ message: `Сannot find any user with ID ${id}` });
      res.status(204).json(deletedUser);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

export default new UserController();
