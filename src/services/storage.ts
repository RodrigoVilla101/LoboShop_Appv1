import { Storage } from '@ionic/storage';

class StorageService {
    private _storage: Storage | null = null;

    constructor() {
        this.init();
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = new Storage();
        this._storage = await storage.create();
    }

    // Create a safe way to get storage instance, waiting for init if necessary
    private async getStorage(): Promise<Storage> {
        if (this._storage) {
            return this._storage;
        }
        // Wait for init to complete if it hasn't
        const storage = new Storage();
        this._storage = await storage.create();
        return this._storage;
    }

    public async set(key: string, value: any) {
        const storage = await this.getStorage();
        return storage.set(key, value);
    }

    public async get(key: string) {
        const storage = await this.getStorage();
        return storage.get(key);
    }

    public async remove(key: string) {
        const storage = await this.getStorage();
        return storage.remove(key);
    }

    public async clear() {
        const storage = await this.getStorage();
        return storage.clear();
    }
}

export const storageService = new StorageService();
