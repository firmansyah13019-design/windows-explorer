import { File } from './File';
import type { SerializedFile } from './File';


// Define a type for the serialized folder
export type SerializedFolder = {
    id: string;
    name: string;
    path: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    subfolders?: SerializedFolder[];
    files?: SerializedFile[];
};

export class Folder {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly path: string,
        public readonly parentId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public subfolders?: Folder[],
        public files?: File[]
    ) { }

    static create(name: string, parentId: string | null = null): Folder {
        const path = parentId ? `${parentId}/${name}` : name;
        return new Folder(
            crypto.randomUUID(),
            name,
            path,
            parentId,
            new Date(),
            new Date()
        );
    }

    hasSubfolders(): boolean {
        return this.subfolders ? this.subfolders.length > 0 : false;
    }

    // Add explicit return type to fix the implicit any error
    toJSON(): SerializedFolder {
        return {
            id: this.id,
            name: this.name,
            path: this.path,
            parentId: this.parentId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            subfolders: this.subfolders?.map(folder => folder.toJSON()),
            files: this.files?.map(file => file.toJSON())
        };
    }
}