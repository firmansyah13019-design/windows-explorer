import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create root folders
  const documents = await prisma.folder.create({
    data: {
      name: 'Documents',
      path: 'Documents'
    }
  });

  const pictures = await prisma.folder.create({
    data: {
      name: 'Pictures',
      path: 'Pictures'
    }
  });

  const music = await prisma.folder.create({
    data: {
      name: 'Music',
      path: 'Music'
    }
  });

  // Create subfolders under Documents
  const work = await prisma.folder.create({
    data: {
      name: 'Work',
      path: 'Documents/Work',
      parentId: documents.id
    }
  });

  const personal = await prisma.folder.create({
    data: {
      name: 'Personal',
      path: 'Documents/Personal',
      parentId: documents.id
    }
  });

  const projects = await prisma.folder.create({
    data: {
      name: 'Projects',
      path: 'Documents/Work/Projects',
      parentId: work.id
    }
  });

  // Create files
  await prisma.file.createMany({
    data: [
      {
        name: 'resume',
        extension: 'pdf',
        size: 1024 * 1024, // 1MB
        folderId: documents.id
      },
      {
        name: 'notes',
        extension: 'txt',
        size: 5120, // 5KB
        folderId: documents.id
      },
      {
        name: 'presentation',
        extension: 'pptx',
        size: 5 * 1024 * 1024, // 5MB
        folderId: work.id
      },
      {
        name: 'budget',
        extension: 'xlsx',
        size: 2 * 1024 * 1024, // 2MB
        folderId: personal.id
      },
      {
        name: 'project-plan',
        extension: 'docx',
        size: 1.5 * 1024 * 1024, // 1.5MB
        folderId: projects.id
      },
      {
        name: 'vacation',
        extension: 'jpg',
        size: 3 * 1024 * 1024, // 3MB
        folderId: pictures.id
      },
      {
        name: 'family',
        extension: 'png',
        size: 2.5 * 1024 * 1024, // 2.5MB
        folderId: pictures.id
      },
      {
        name: 'favorite-song',
        extension: 'mp3',
        size: 4 * 1024 * 1024, // 4MB
        folderId: music.id
      }
    ]
  });

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });