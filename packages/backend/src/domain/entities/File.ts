export type SerializedFile = {
    id: string;
    name: string;
    extension: string;
    size: number;
    folderId: string;
    createdAt: Date;
    updatedAt: Date;
};

export class File {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly extension: string,
        public readonly size: number,
        public readonly folderId: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }


    getFullName(): string {
        return `${this.name}.${this.extension}`;
    }

    getFormattedSize(): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = this.size;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    toJSON(): SerializedFile {
        return {
            id: this.id,
            name: this.name,
            extension: this.extension,
            size: this.size,
            folderId: this.folderId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}