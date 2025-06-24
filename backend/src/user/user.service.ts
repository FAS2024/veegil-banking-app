// -------------------- src/user/user.service.ts --------------------
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { LoginResponse } from './dto/loginResponse.dto';

type JwtPayload = {
  sub: string;
  phoneNumber: string;
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(input: CreateUserInput): Promise<LoginResponse> {
    const { fullName, phoneNumber, password } = input;

    const existingUser = await this.userModel.findOne({ phoneNumber });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      fullName,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = { sub: newUser._id, phoneNumber: newUser.phoneNumber };
    const token = this.jwtService.sign(payload);

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return {
      token,
      user: plainToInstance(User, userWithoutPassword),
    };
  }

  async login(phoneNumber: string, password: string): Promise<LoginResponse> {
    const user = await this.userModel.findOne({ phoneNumber }).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let isMatch: boolean;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (error) {
      // Handle errors from bcrypt.compare gracefully
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { sub: user._id, phoneNumber: user.phoneNumber };
    const token = this.jwtService.sign(payload);

    // Remove password field before returning user
    const { password: _, ...userWithoutPassword } = user;

    return { token, user: plainToInstance(User, userWithoutPassword) };

  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    const { password, ...userWithoutPassword } = user;
    return plainToInstance(User, userWithoutPassword);
  }
}
