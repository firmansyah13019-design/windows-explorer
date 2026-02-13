import { ref, computed } from 'vue';
import type { Folder, File } from '../types/explorer';
import { api } from '../services/api';

export function useExplorer() {
    const folders = ref<Folder[]>([]);
    const selectedFolder = ref<Folder | null>(null);
    const currentContents = ref<{ subfolders: Folder[]; files: File[] }>({
        subfolders: [],
        files: []
    });
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Navigation history
    const history = ref<Folder[]>([]);
    const historyIndex = ref(-1);

    const canGoBack = computed(() => historyIndex.value > 0);
    const canGoForward = computed(() => historyIndex.value < history.value.length - 1);

    const loadFolderHierarchy = async () => {
        loading.value = true;
        error.value = null;
        try {
            folders.value = await api.getFolderHierarchy();
        } catch (err) {
            error.value = 'Failed to load folders';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const selectFolder = async (folder: Folder, skipHistory = false) => {
        selectedFolder.value = folder;
        loading.value = true;
        try {
            const contents = await api.getFolderContents(folder.id);
            currentContents.value = {
                subfolders: contents.subfolders,
                files: contents.files
            };

            // Add to history only if not navigating through history
            if (!skipHistory) {
                // Remove any forward history if we navigate to a new folder
                if (historyIndex.value < history.value.length - 1) {
                    history.value = history.value.slice(0, historyIndex.value + 1);
                }
                history.value.push(folder);
                historyIndex.value = history.value.length - 1;
            }
        } catch (err) {
            error.value = 'Failed to load folder contents';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const goBack = async () => {
        if (canGoBack.value) {
            historyIndex.value--;
            const folder = history.value[historyIndex.value];
            if (!folder) return;
            await selectFolder(folder, true);
        }
    };

    const goForward = async () => {
        if (canGoForward.value) {
            historyIndex.value++;
            const folder = history.value[historyIndex.value];
            if (!folder) return;
            await selectFolder(folder, true);
        }
    };

    const closeFolder = () => {
        selectedFolder.value = null;
        currentContents.value = {
            subfolders: [],
            files: []
        };
        // Remove the last item from history
        if (historyIndex.value >= 0) {
            history.value.splice(historyIndex.value, 1);
            if (historyIndex.value >= history.value.length) {
                historyIndex.value--;
            }
        }
    };

    const toggleFolder = (folder: Folder) => {
        folder.isOpen = !folder.isOpen;
    };

    return {
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
    };
}