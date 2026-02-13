import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { folderController } from './interface/api/FolderController';

const app = new Elysia()
  .use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }))
  .use(folderController)
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .listen(3001);

console.log(`🦊 Backend running at ${app.server?.hostname}:${app.server?.port}`);