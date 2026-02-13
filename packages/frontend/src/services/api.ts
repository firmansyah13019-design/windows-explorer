import type { Folder, FolderContents } from '../types/explorer';

const API_BASE = 'http://localhost:3001/api/v1';

export const api = {
  async getFolderHierarchy(): Promise<Folder[]> {
    const response = await fetch(`${API_BASE}/folders/hierarchy`);
    const data = await response.json();
    return data.data;
  },

  async getFolderContents(folderId: string): Promise<FolderContents> {
    const response = await fetch(`${API_BASE}/folders/${folderId}/contents`);
    const data = await response.json();
    return data.data;
  }
};