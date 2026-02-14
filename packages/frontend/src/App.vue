<template>
  <div class="app">
    <header class="header">
      <div class="header-left">
        <button
          class="nav-button"
          @click="handleGoBack"
          :disabled="!canGoBack"
          title="Back"
        >
          ◀
        </button>
        <button
          class="nav-button"
          @click="handleGoForward"
          :disabled="!canGoForward"
          title="Forward"
        >
          ▶
        </button>
      </div>
      <h1>Windows Explorer</h1>
      <div class="search" v-if="searchEnabled">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch(searchQuery)"
          placeholder="Search folders and files..."
          class="search-input"
        />
      </div>
    </header>
    
    <!-- Search Results View -->
    <div v-if="searchQuery && (searchResults.folders.length > 0 || searchResults.files.length > 0)" class="search-results">
      <div class="results-container">
        <div v-if="searchResults.folders.length > 0" class="results-section">
          <h3>Folders</h3>
          <div class="results-list">
            <div
              v-for="folder in searchResults.folders"
              :key="folder.id"
              class="result-item folder"
              @click="handleFolderSelect(folder)"
            >
              <span class="result-icon">📁</span>
              <span class="result-name">{{ folder.name }}</span>
              <span class="result-path">{{ folder.path }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="searchResults.files.length > 0" class="results-section">
          <h3>Files</h3>
          <div class="results-list">
            <div
              v-for="file in searchResults.files"
              :key="file.id"
              class="result-item file"
            >
              <span class="result-icon">📄</span>
              <span class="result-name">{{ file.name }}.{{ file.extension }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Normal Explorer View -->
    <div v-else class="explorer">
      <FolderTree
        :folders="filteredFolders"
        :loading="loading"
        :error="error"
        @select="handleFolderSelect"
        @toggle="handleFolderToggle"
      />
      <FileList
        :selected-folder="selectedFolder"
        :subfolders="currentContents.subfolders"
        :files="currentContents.files"
        :loading="loading"
        :error="error"
        @folder-click="handleFolderSelect"
        @close="handleCloseFolder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import FolderTree from './components/FolderTree.vue';
import FileList from './components/FileList.vue';
import { useExplorer } from './composables/useExplorer';
import { api } from './services/api';
import type { Folder, File } from './types/explorer';

const {
  folders,
  selectedFolder,
  currentContents,
  loading,
  error,
  canGoBack,
  canGoForward,
  loadFolderHierarchy,
  selectFolder,
  toggleFolder,
  goBack,
  goForward,
  closeFolder
} = useExplorer();

const searchQuery = ref('');
const searchEnabled = true;
const searchResults = ref<{ folders: Folder[]; files: File[] }>({
  folders: [],
  files: []
});
const isSearching = ref(false);

const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders.value;
  
  const search = searchQuery.value.toLowerCase();
  const filterFolders = (folders: Folder[]): Folder[] => {
    return folders
      .map(folder => ({
        ...folder,
        subfolders: folder.subfolders ? filterFolders(folder.subfolders) : []
      }))
      .filter(folder => 
        folder.name.toLowerCase().includes(search) ||
        (folder.subfolders && folder.subfolders.length > 0)
      );
  };
  
  return filterFolders(folders.value);
});

const handleSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = { folders: [], files: [] };
    return;
  }
  
  isSearching.value = true;
  try {
    searchResults.value = await api.search(query);
  } catch (err) {
    console.error('Search failed:', err);
    searchResults.value = { folders: [], files: [] };
  } finally {
    isSearching.value = false;
  }
};

const handleFolderSelect = async (folder: Folder) => {
  await selectFolder(folder);
};

const handleFolderToggle = (folder: Folder) => {
  toggleFolder(folder);
};

const handleGoBack = async () => {
  await goBack();
};

const handleGoForward = async () => {
  await goForward();
};

const handleCloseFolder = () => {
  closeFolder();
};

onMounted(async () => {
  await loadFolderHierarchy();
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f0f0f0;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
}

.header-left {
  display: flex;
  gap: 8px;
}

.nav-button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.nav-button:hover:not(:disabled) {
  background: #f0f0f0;
  border-color: #ccc;
}

.nav-button:active:not(:disabled) {
  background: #e0e0e0;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  width: 300px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2196f3;
}

.explorer {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  overflow: hidden;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: white;
}

.results-container {
  max-width: 100%;
}

.results-section {
  margin-bottom: 32px;
}

.results-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  gap: 12px;
}

.result-item:hover {
  background-color: #f5f5f5;
  border-color: #2196f3;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.result-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.result-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.result-path {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}
</style>