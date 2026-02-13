<template>
  <div class="file-list">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!selectedFolder" class="empty-state">
      Select a folder to view contents
    </div>
    <div v-else>
      <div class="folder-header">
        <span class="folder-icon">📁</span>
        <h3>{{ selectedFolder.name }}</h3>
        <button
          class="close-button"
          @click="handleClose"
          title="Close"
        >
          ✕
        </button>
      </div>
      
      <div v-if="subfolders.length > 0" class="section">
        <h4 class="section-title">Folders</h4>
        <div class="grid">
          <div
            v-for="folder in sortedSubfolders"
            :key="folder.id"
            class="grid-item folder"
            @click="emit('folder-click', folder)"
          >
            <span class="item-icon">📁</span>
            <span class="item-name">{{ folder.name }}</span>
          </div>
        </div>
      </div>

      <div v-if="files.length > 0" class="section">
        <h4 class="section-title">Files</h4>
        <div class="grid">
          <div
            v-for="file in sortedFiles"
            :key="file.id"
            class="grid-item file"
          >
            <span class="item-icon">{{ getFileIcon(file.extension) }}</span>
            <span class="item-name">{{ file.name }}.{{ file.extension }}</span>
            <span class="item-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
      </div>

      <div v-if="subfolders.length === 0 && files.length === 0" class="empty-folder">
        This folder is empty
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Folder, File } from '../types/explorer';

const props = defineProps<{
  selectedFolder: Folder | null;
  subfolders: Folder[];
  files: File[];
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: 'folder-click', folder: Folder): void;
  (e: 'close'): void;
}>();

const sortedSubfolders = computed(() => {
  return [...props.subfolders].sort((a, b) => a.name.localeCompare(b.name));
});

const sortedFiles = computed(() => {
  return [...props.files].sort((a, b) => {
    if (a.name === b.name) {
      return a.extension.localeCompare(b.extension);
    }
    return a.name.localeCompare(b.name);
  });
});

const getFileIcon = (extension: string): string => {
  const icons: Record<string, string> = {
    'txt': '📄',
    'pdf': '📕',
    'doc': '📘',
    'docx': '📘',
    'jpg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'mp3': '🎵',
    'mp4': '🎬',
    'zip': '🗜️',
    'js': '📜',
    'ts': '📜',
    'html': '🌐',
    'css': '🎨'
  };
  return icons[extension.toLowerCase()] || '📄';
};

const handleClose = () => {
  emit('close');
};

const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

</script>

<style scoped>
.file-list {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background: white;
}

.folder-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
  gap: 12px;
}

.folder-header .folder-icon {
  font-size: 32px;
}

.folder-header h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
  flex: 1;
}

.close-button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #d32f2f;
}

.close-button:hover {
  background: #ffebee;
  border-color: #d32f2f;
}

.close-button:active {
  background: #ffcdd2;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.grid-item:hover {
  background-color: #f5f5f5;
  border-color: #2196f3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.item-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.item-name {
  font-size: 14px;
  color: #333;
  word-break: break-word;
  max-width: 100%;
}

.item-size {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.loading, .error, .empty-state, .empty-folder {
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
}

.error {
  color: #d32f2f;
}

.empty-folder {
  background: #f9f9f9;
  border-radius: 8px;
}
</style>