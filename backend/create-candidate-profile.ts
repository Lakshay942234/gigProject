import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Get all users with CANDIDATE role who don't have a candidate profile
    const users = await prisma.user.findMany({
        where: {
            role: 'CANDIDATE',
            candidate: null
        }
    });

    console.log(`Found ${users.length} candidate users without profiles`);

    for (const user of users) {
        await prisma.candidate.create({
            data: {
                userId: user.id,
                qualifiedToWork: false,
                skills: [],
                languages: [],
                availability: {},
            }
        });
        console.log(`Created profile for user: ${user.email}`);
    }

    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
