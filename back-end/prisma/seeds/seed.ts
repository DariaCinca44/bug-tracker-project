import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma=new PrismaClient();

async function main() {
    console.log('Seed is starting!');

    //parolele hash
    const passwordMP= await bcrypt.hash('parolaMP', 10);
    const passwordTST= await bcrypt.hash('parolaTST', 10);

    //userul MP
    const userMP= await prisma.user.create({
        data:{
            name: 'Member Project',
            email: 'memberproject@gmail.com',
            passwordHash: passwordMP,
            xp:0,
            level:1
        }
    })

    //userul TST
    const userTST= await prisma.user.create({
        data:{
            name: 'Tester',
            email:'tester@gmail.com',
            passwordHash: passwordTST,
            xp: 0,
            level: 1
        }
    })

    //project
    const project= await prisma.project.create({
        data:{
            name: 'BugTracker',
            repoUrl: 'https://github.com/example/bug-tracker-project.git',
            createdById: userMP.id
        }
    })

    //roles
    await prisma.projectMember.create({
        data:{
            projectId: project.id,
            userId:userMP.id,
            role: 'MP'
        }
    })

    await prisma.projectMember.create({
        data:{
            projectId:project.id,
            userId:userTST.id,
            role: 'TST'
        }
    })

    //bug
    await prisma.bug.create({
        data:{
            projectId: project.id,
            reporterId: userTST.id,
            title: 'Eroare',
            description: 'eroare test',
            severity: 'HIGH',
            priority: 'MEDIUM',
            status:'OPEN'
        }
    })

    console.log('Seed created!');
}

main().catch((e) =>{
    console.error(e);
    process.exit(1);
}). finally(async () =>{
    await prisma.$disconnect();
})
