import { describe, expect, it, beforeEach, mock } from 'bun:test';
import { FolderService } from '../src/application/services/FolderService';
import { Folder } from '../src/domain/entities/Folder';

describe('FolderService', () => {
    let folderService: FolderService;
    let mockRepository: any;

    beforeEach(() => {
        mockRepository = {
            findAll: mock(() => Promise.resolve([])),
            findById: mock(() => Promise.resolve(null)),
            findSubfolders: mock(() => Promise.resolve([])),
            findFiles: mock(() => Promise.resolve([])),
            findFolderWithContents: mock(() => Promise.resolve(null))
        };
        folderService = new FolderService(mockRepository);
    });

    describe('buildHierarchy', () => {
        it('should build folder hierarchy correctly', async () => {
            const folders = [
                new Folder('1', 'Root', 'Root', null, new Date(), new Date()),
                new Folder('2', 'Child1', 'Root/Child1', '1', new Date(), new Date()),
                new Folder('3', 'Child2', 'Root/Child2', '1', new Date(), new Date()),
                new Folder('4', 'Grandchild', 'Root/Child1/Grandchild', '2', new Date(), new Date())
            ];

            mockRepository.findAll.mockImplementation(() => Promise.resolve(folders));

            const hierarchy = await folderService.getFolderHierarchy();

            expect(hierarchy).toHaveLength(1);
            const root = hierarchy[0]!;
            expect(root.id).toBe('1');

            expect(root.subfolders).toHaveLength(2);

            const firstChild = root.subfolders![0]!;
            expect(firstChild.subfolders).toHaveLength(1);
        });
    });
});