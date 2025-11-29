import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User, Role, UserStatus } from '@prisma/client';

interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  phone?: string;
  role: Role;
  keycloakId?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: data.passwordHash,
        phone: data.phone,
        role: data.role,
        keycloakId: data.keycloakId,
        status: UserStatus.ACTIVE,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByKeycloakId(keycloakId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { keycloakId },
    });
  }

  async updateLastLogin(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async findAll(filters?: {
    role?: Role;
    status?: UserStatus;
  }): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        ...(filters?.role && { role: filters.role }),
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.DELETED },
    });
  }
}
