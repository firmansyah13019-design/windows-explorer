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
          placeholder="Search folders and files..."
          class="search-input"
        />
      </div>
    </header>
    <div class="explorer">
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
import type { Folder } from './types/explorer';

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
</style>