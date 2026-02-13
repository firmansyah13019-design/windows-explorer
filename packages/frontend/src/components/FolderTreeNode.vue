<template>
  <div class="folder-node" :style="{ paddingLeft: `${level * 20}px` }">
    <div 
      class="folder-item"
      :class="{ selected: isSelected }"
      @click="handleClick"
    >
      <span class="toggle-icon" @click.stop="handleToggle">
        {{ folder.isOpen ? '▼' : '►' }}
      </span>
      <span class="folder-icon">📁</span>
      <span class="folder-name">{{ folder.name }}</span>
    </div>
    <div v-if="folder.isOpen && folder.subfolders?.length" class="subfolders">
      <FolderTreeNode
        v-for="subfolder in sortedSubfolders"
        :key="subfolder.id"
        :folder="subfolder"
        :level="level + 1"
        :selected-folder-id="selectedFolderId"
        @select="handleSubfolderSelect"
        @toggle="handleSubfolderToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Folder } from '../types/explorer';

const props = defineProps<{
  folder: Folder;
  level: number;
  selectedFolderId?: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', folder: Folder): void;
  (e: 'toggle', folder: Folder): void;
}>();

const isSelected = computed(() => props.selectedFolderId === props.folder.id);

const sortedSubfolders = computed(() => {
  return [...(props.folder.subfolders || [])].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
});

const handleClick = () => {
  emit('select', props.folder);
};

const handleToggle = () => {
  emit('toggle', props.folder);
};

const handleSubfolderSelect = (folder: Folder) => {
  emit('select', folder);
};

const handleSubfolderToggle = (folder: Folder) => {
  emit('toggle', folder);
};
</script>

<style scoped>
.folder-node {
  user-select: none;
}

.folder-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.folder-item:hover {
  background-color: #e3f2fd;
}

.folder-item.selected {
  background-color: #bbdefb;
  font-weight: 500;
}

.toggle-icon {
  width: 20px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.folder-icon {
  margin-right: 8px;
  font-size: 18px;
}

.folder-name {
  font-size: 14px;
  color: #333;
}

.subfolders {
  margin-left: 20px;
}
</style>