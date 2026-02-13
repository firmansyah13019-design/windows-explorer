import { Folder } from '../entities/Folder';
import { File } from '../entities/File';

export interface FolderRepository {
  findAll(): Promise<Folder[]>;
  findById(id: string): Promise<Folder | null>;
  findSubfolders(folderId: string): Promise<Folder[]>;
  findFiles(folderId: string): Promise<File[]>;
  findFolderWithContents(folderId: string): Promise<{ folder: Folder; subfolders: Folder[]; files: File[] } | null>;
}