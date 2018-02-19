"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KEY_PREFIX = "angular2ws";
var WebStorageUtility = (function () {
    function WebStorageUtility() {
    }
    WebStorageUtility.generateStorageKey = function (key) {
        return KEY_PREFIX + "_" + key;
    };
    WebStorageUtility.get = function (storage, key) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        var value = storage.getItem(storageKey);
        return WebStorageUtility.getGettable(value);
    };
    WebStorageUtility.set = function (storage, key, value) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        storage.setItem(storageKey, WebStorageUtility.getSettable(value));
    };
    WebStorageUtility.remove = function (storage, key) {
        var storageKey = WebStorageUtility.generateStorageKey(key);
        storage.removeItem(storageKey);
    };
    WebStorageUtility.getSettable = function (value) {
        return typeof value === "string" ? value : JSON.stringify(value);
    };
    WebStorageUtility.getGettable = function (value) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    };
    return WebStorageUtility;
}());
exports.WebStorageUtility = WebStorageUtility;
// initialization cache
var cache = {};
function LocalStorage(key) {
    return function (target, propertyName) {
        key = key || propertyName;
        var storageKey = WebStorageUtility.generateStorageKey(key);
        var storedValue = WebStorageUtility.get(localStorage, key);
        Object.defineProperty(target, propertyName, {
            get: function () {
                return WebStorageUtility.get(localStorage, key);
            },
            set: function (value) {
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
    };
}
exports.LocalStorage = LocalStorage;
function SessionStorage(key) {
    return exports.WebStorage(sessionStorage, key);
}
exports.SessionStorage = SessionStorage;
exports.WebStorage = createWebStorage;
function createWebStorage(webStorage, key) {
    return function (target, propertyName) {
        key = key || propertyName;
        var storageKey = WebStorageUtility.generateStorageKey(key);
        var storedValue = WebStorageUtility.get(webStorage, key);
        Object.defineProperty(target, propertyName, {
            get: function () {
                return WebStorageUtility.get(webStorage, key);
            },
            set: function (value) {
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
    };
}
exports.createWebStorage = createWebStorage;
//# sourceMappingURL=webstorage.js.map