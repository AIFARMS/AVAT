const DB_NAME = 'avat_autosave'
const DB_VERSION = 1
const STORE_NAME = 'sessions'
export const ACTIVE_SESSION_ID = 'active'
export const AUTOSAVE_SCHEMA_VERSION = 1

function openAutosaveDatabase(){
    return new Promise<IDBDatabase>((resolve, reject) => {
        if(typeof window === 'undefined' || !window.indexedDB){
            reject(new Error('IndexedDB is not available in this browser.'))
            return
        }

        const request = window.indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result
            if(!db.objectStoreNames.contains(STORE_NAME)){
                db.createObjectStore(STORE_NAME, { keyPath: 'id' })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error || new Error('Unable to open autosave storage.'))
    })
}

function runSessionTransaction(mode: IDBTransactionMode, operation): Promise<any>{
    return openAutosaveDatabase().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, mode)
            const store = transaction.objectStore(STORE_NAME)
            const request = operation(store)
            let result

            request.onsuccess = () => {
                result = request.result
            }
            request.onerror = () => reject(request.error || new Error('Autosave storage operation failed.'))
            transaction.oncomplete = () => {
                db.close()
                resolve(result)
            }
            transaction.onerror = () => {
                db.close()
                reject(transaction.error || new Error('Autosave storage transaction failed.'))
            }
            transaction.onabort = () => {
                db.close()
                reject(transaction.error || new Error('Autosave storage transaction was aborted.'))
            }
        })
    })
}

export function getAutosaveSession(){
    return runSessionTransaction('readonly', (store) => store.get(ACTIVE_SESSION_ID))
}

export function saveAutosaveSession(session){
    return runSessionTransaction('readwrite', (store) => store.put({
        ...session,
        id: ACTIVE_SESSION_ID,
        schemaVersion: AUTOSAVE_SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
    }))
}

export function deleteAutosaveSession(){
    return runSessionTransaction('readwrite', (store) => store.delete(ACTIVE_SESSION_ID))
}
