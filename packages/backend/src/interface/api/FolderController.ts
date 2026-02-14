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
  .get('/search/:query', async ({ params: { query } }) => {
    try {
      console.log('Search request for query:', query);
      const results = await folderService.search(query);
      console.log('Search results:', results);
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        error: 'Failed to search folders and files'
      };
    }
  }, {
    params: t.Object({
      query: t.String()
    })
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