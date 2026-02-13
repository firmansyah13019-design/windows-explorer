<template>
  <div class="folder-tree">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="tree-container">
      <FolderTreeNode
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        :level="0"
        @select="handleSelect"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FolderTreeNode from './FolderTreeNode.vue';
import type { Folder } from '../types/explorer';

const props = defineProps<{
  folders: Folder[];
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', folder: Folder): void;
  (e: 'toggle', folder: Folder): void;
}>();

const handleSelect = (folder: Folder) => {
  emit('select', folder);
};

const handleToggle = (folder: Folder) => {
  emit('toggle', folder);
};
</script>

<style scoped>
.folder-tree {
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
}

.tree-container {
  padding: 8px 0;
}

.loading, .error {
  padding: 16px;
  text-align: center;
  color: #666;
}

.error {
  color: #d32f2f;
}
</style>