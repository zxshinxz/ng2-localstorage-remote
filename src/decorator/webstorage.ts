const KEY_PREFIX = "angular2ws";

export class WebStorageUtility {
    static generateStorageKey(key: string): string {
        return `${KEY_PREFIX}_${key}`
    }

    static get(storage: Storage, key: string): any {
        let storageKey = WebStorageUtility.generateStorageKey(key);

        let value = storage.getItem(storageKey);

        return WebStorageUtility.getGettable(value);
    }

    static set(storage: Storage, key: string, value: any): void {
        let storageKey = WebStorageUtility.generateStorageKey(key);

        storage.setItem(storageKey, WebStorageUtility.getSettable(value));
    }

    static remove(storage: Storage, key: string): void {
        let storageKey = WebStorageUtility.generateStorageKey(key);

        storage.removeItem(storageKey);
    }

    private static getSettable(value: any): string {
        return typeof value === "string" ? value : JSON.stringify(value);
    }

    private static getGettable(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
}

// initialization cache
let cache = {};

export function LocalStorage(key?: string) {
    return (target: Object, propertyName: string): void => {
        key = key || propertyName;

        let storageKey = WebStorageUtility.generateStorageKey(key);
        let storedValue = WebStorageUtility.get(localStorage, key);

        Object.defineProperty(target, propertyName, {
            get: function () {
                return WebStorageUtility.get(localStorage, key);
            },
            set: function (value: any) {
                if (!cache[key]) {
                    // first setter handle
                    if (storedValue === null) {
                        // if no value in localStorage, set it to initializer
                        WebStorageUtility.set(localStorage, key, value);
                    }

                    cache[key] = true;
                    return;
                }

                WebStorageUtility.set(localStorage, key, value);
            },
        });
    }
}

export function SessionStorage(key?: string) {
    return WebStorage(sessionStorage, key);
}


export let WebStorage = createWebStorage;


export function createWebStorage(webStorage: Storage, key: string) {
    return (target: Object, propertyName: string): void => {
        key = key || propertyName;

        let storageKey = WebStorageUtility.generateStorageKey(key);
        let storedValue = WebStorageUtility.get(webStorage, key);

        Object.defineProperty(target, propertyName, {
            get: function () {
                return WebStorageUtility.get(webStorage, key);
            },
            set: function (value: any) {
                // if (!cache[key]) {
                //   // first setter handle
                //   if (storedValue === null) {
                //     // if no value in localStorage, set it to initializer
                //     WebStorageUtility.set(webStorage, key, value);
                //   }
                //
                //   cache[key] = true;
                //   return;
                // }

                WebStorageUtility.set(webStorage, key, value);
            },
        });

    }
}
