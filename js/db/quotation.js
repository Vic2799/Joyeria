'use strict';

let database = null;

function getDatabase() {
    if (database === null) {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open('cart_db', 1);

            request.onerror = () => {
                reject();
            }

            request.onsuccess = () => {
                database = request.result;
                resolve(request.result);
            }

            request.onupgradeneeded = (event) => {
                // Create object store (table)
                const objectStore = event.target.result.createObjectStore('product', { keyPath: 'product_id' });
                objectStore.createIndex('quantity', 'quantity', { unique: false });

                // this later calls onsuccess, therefore; resolve is not called here
            };
        });
    } else {
        return new Promise((resolve, _reject) => {
            resolve(database);
        });
    }
}

export function getAllProducts() {
    return new Promise((resolve, reject) => {
        getDatabase()
            .then(db => {
                const transaction = db.transaction('product');
                const objectStore = transaction.objectStore('product');

                const request = objectStore.getAll();

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                }

                request.onerror = () => reject();
            });
    });
}

export function getProductById(productId) {
    return new Promise((resolve, reject) => {
        getDatabase()
            .then(db => {
                const transaction = db.transaction('product');
                const objectStore = transaction.objectStore('product');

                const request = objectStore.get(productId);

                request.onsuccess = (event) => {
                    resolve(event.target.result);
                }

                request.onerror = () => reject();
            });
    });
}

export function putQuotationProduct(productId, productQuantity) {
    return new Promise((resolve, reject) => {
        getDatabase()
            .then(db => {
                const newItem = { 'product_id': productId, 'quantity': productQuantity };

                const transaction = db.transaction(['product'], 'readwrite');

                const objectStore = transaction.objectStore('product');

                objectStore.put(newItem);

                transaction.oncomplete = () => {
                    resolve();
                };

                transaction.onerror = () => {
                    reject();
                };
            });
    });
}

export function removeProductFromQuotation(productId) {
    return new Promise((resolve, reject) => {
        getDatabase()
            .then(db => {
                const transaction = db.transaction(['product'], 'readwrite');

                const objectStore = transaction.objectStore('product');

                objectStore.delete(productId);

                transaction.oncomplete = () => {
                    resolve();
                };

                transaction.onerror = () => {
                    reject();
                };
            });
    });
}
