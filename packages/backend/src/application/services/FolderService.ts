import { FolderRepository } from '../../domain/repositories/FolderRepository';
import { Folder } from '../../domain/entities/Folder';
import { File } from '../../domain/entities/File';

export class FolderService {
    constructor(private folderRepository: FolderRepository) { }

    async getAllFolders(): Promise<Folder[]> {
        return this.folderRepository.findAll();
    }

    async getFolderContents(folderId: string): Promise<{
        folder: Folder;
        subfolders: Folder[];
        files: File[];
    } | null> {
        return this.folderRepository.findFolderWithContents(folderId);
    }

    async getFolderHierarchy(): Promise<Folder[]> {
        const folders = await this.folderRepository.findAll();
        return this.buildHierarchy(folders);
    }

    async search(query: string): Promise<{
        folders: Folder[];
        files: File[];
    }> {
        const [folders, files] = await Promise.all([
            this.folderRepository.searchFolders(query),
            this.folderRepository.searchFiles(query)
        ]);
        return { folders, files };
    }

    private buildHierarchy(folders: Folder[]): Folder[] {
        const folderMap = new Map<string, Folder>();
        const rootFolders: Folder[] = [];

        // First pass: create map
        folders.forEach(folder => {
            folderMap.set(
                folder.id,
                new Folder(
                    folder.id,
                    folder.name,
                    folder.path,
                    folder.parentId,
                    folder.createdAt,
                    folder.updatedAt,
                    [], // subfolders
                    folder.files
                )
            );
        });

        // Second pass: build hierarchy
        folders.forEach(folder => {
            const folderWithSubfolders = folderMap.get(folder.id)!;

            if (folder.parentId && folderMap.has(folder.parentId)) {
                const parent = folderMap.get(folder.parentId)!;
                parent.subfolders = parent.subfolders || [];
                parent.subfolders.push(folderWithSubfolders);
            } else {
                rootFolders.push(folderWithSubfolders);
            }
        });

        // Sort folders alphabetically
        const sortFolders = (folders: Folder[]) => {
            folders.sort((a, b) => a.name.localeCompare(b.name));
            folders.forEach(f => {
                if (f.subfolders?.length) {
                    sortFolders(f.subfolders);
                }
            });
        };

        sortFolders(rootFolders);
        return rootFolders;
    }
}