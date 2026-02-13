import { PrismaClient } from '@prisma/client';
import { FolderRepository } from '../../domain/repositories/FolderRepository';
import { Folder } from '../../domain/entities/Folder';
import { File } from '../../domain/entities/File';

export class PrismaFolderRepository implements FolderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Folder[]> {
    const folders = await this.prisma.folder.findMany({
      orderBy: { name: 'asc' }
    });
    
    return folders.map(f => this.mapToDomain(f));
  }

  async findById(id: string): Promise<Folder | null> {
    const folder = await this.prisma.folder.findUnique({
      where: { id }
    });
    
    return folder ? this.mapToDomain(folder) : null;
  }

  async findSubfolders(folderId: string): Promise<Folder[]> {
    const subfolders = await this.prisma.folder.findMany({
      where: { parentId: folderId },
      orderBy: { name: 'asc' }
    });
    
    return subfolders.map(f => this.mapToDomain(f));
  }

  async findFiles(folderId: string): Promise<File[]> {
    const files = await this.prisma.file.findMany({
      where: { folderId },
      orderBy: { name: 'asc' }
    });
    
    return files.map(f => new File(
      f.id,
      f.name,
      f.extension,
      f.size,
      f.folderId,
      f.createdAt,
      f.updatedAt
    ));
  }

  async findFolderWithContents(folderId: string): Promise<{ folder: Folder; subfolders: Folder[]; files: File[] } | null> {
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        subfolders: {
          orderBy: { name: 'asc' }
        },
        files: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!folder) return null;

    return {
      folder: this.mapToDomain(folder),
      subfolders: folder.subfolders.map(sf => this.mapToDomain(sf)),
      files: folder.files.map(f => new File(
        f.id,
        f.name,
        f.extension,
        f.size,
        f.folderId,
        f.createdAt,
        f.updatedAt
      ))
    };
  }

  private mapToDomain(prismaFolder: any): Folder {
    return new Folder(
      prismaFolder.id,
      prismaFolder.name,
      prismaFolder.path,
      prismaFolder.parentId,
      prismaFolder.createdAt,
      prismaFolder.updatedAt
    );
  }
}