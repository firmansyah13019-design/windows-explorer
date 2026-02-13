import { Elysia, t } from 'elysia';
import { FolderService } from '../../application/services/FolderService';
import { PrismaFolderRepository } from '../../infrastructure/repositories/PrismaFolderRepository';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const folderRepository = new PrismaFolderRepository(prisma);
const folderService = new FolderService(folderRepository);

export const folderController = new Elysia({ prefix: '/api/v1/folders' })
  .get('/', async () => {
    try {
      const folders = await folderService.getAllFolders();
      return {
        success: true,
        data: folders
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch folders'
      };
    }
  })
  .get('/hierarchy', async () => {
    try {
      const hierarchy = await folderService.getFolderHierarchy();
      return {
        success: true,
        data: hierarchy
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch folder hierarchy'
      };
    }
  })
  .get('/:id/contents', async ({ params: { id } }) => {
    try {
      const contents = await folderService.getFolderContents(id);
      if (!contents) {
        return {
          success: false,
          error: 'Folder not found'
        };
      }
      return {
        success: true,
        data: contents
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch folder contents'
      };
    }
  }, {
    params: t.Object({
      id: t.String()
    })
  });