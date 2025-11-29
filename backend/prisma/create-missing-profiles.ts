import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Get all users with CANDIDATE role who don't have a candidate profile
    const users = await prisma.user.findMany({
        where: {
            role: 'CANDIDATE',
        },
        include: {
            candidate: true
        }
    });

    const usersWithoutProfile = users.filter(u => !u.candidate);
    
    console.log(`Found ${usersWithoutProfile.length} candidate users without profiles`);

    for (const user of usersWithoutProfile) {
        await prisma.candidate.create({
            data: {
                userId: user.id,
                qualifiedToWork: false,
                skills: [],
                languages: [],
                availability: {},
            }
        });
        console.log(`✓ Created profile for user: ${user.email}`);
    }

    console.log('Done!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
