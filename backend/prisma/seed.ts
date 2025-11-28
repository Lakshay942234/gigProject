import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminEmail = 'admin@bpo.com';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: Role.ADMIN,
                status: UserStatus.ACTIVE,
                phone: '1234567890',
            },
        });
        console.log('Admin user created: admin@bpo.com / admin123');
    } else {
        console.log('Admin user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
