import type { Folder, FolderContents, File } from '../types/explorer';

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
  },

  async search(query: string): Promise<{ folders: Folder[]; files: File[] }> {
    const url = `${API_BASE}/folders/search/${encodeURIComponent(query)}`;
    console.log('Searching with URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('Search response:', data);
    if (!response.ok) {
      throw new Error(data.error || 'Search failed');
    }
    return data.data || { folders: [], files: [] };
  }
};