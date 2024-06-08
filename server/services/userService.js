import { User } from '../models/userModel';
import bcrypt from 'bcrypt';

class UserService {
  async registration(email, password) {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new Error('Пользователь с таким почтовым адресом уже существует');
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const user = await User.create({ email, password: hashPassword, activationLink });
    const tokens = tokenService.generateTokens();
  }
}

export default new UserService();
