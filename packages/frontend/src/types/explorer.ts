export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  subfolders?: Folder[];
  isOpen?: boolean;
  loading?: boolean;
}

export interface File {
  id: string;
  name: string;
  extension: string;
  size: number;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderContents {
  folder: Folder;
  subfolders: Folder[];
  files: File[];
}