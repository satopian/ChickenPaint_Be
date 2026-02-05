/*
    litaChix
    https://github.com/satopian/ChickenPaint_Be
    by satopian
    Customized from ChickenPaint by Nicholas Sherlock.
    GNU GENERAL PUBLIC LICENSE
    Version 3, 29 June 2007
    <http://www.gnu.org/licenses/>
*/

const DB_NAME = "litaChixDB";
const STORE_NAME = "chibiResults";
const STORAGE_KEY = "latest_backup";

/**
 * 内部用：DB接続・トランザクション処理の抽象化
 */
async function performAction(mode, callback) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(STORE_NAME, mode);
            const store = transaction.objectStore(STORE_NAME);
            const opRequest = callback(store);

            opRequest.onsuccess = () => {
                resolve(opRequest.result);
                db.close();
            };
            opRequest.onerror = () => reject(opRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * データ消失防止のためDBに保存 (Save)
 * 画像データとパレットデータを保存する
 * @param {Uint8Array} bytes - .chi形式のバイナリ
 * @param {Blob|null} swatchesBlob - パレットのBlobデータ
 */
export async function CPPutChiAutosaveToDB(bytes, swatchesBlob) {
    const data = {
        bytes: bytes,
        swatches: swatchesBlob, // BlobもそのままIndexedDBに保存可能です
        savedAt: Date.now(),
    };
    // 復元可能なバックアップが存在することを示すフラグをlocalStorageに保存
    localStorage.setItem("has_chibi_autosave_flag", "true");
    return performAction("readwrite", (store) => store.put(data, STORAGE_KEY));
}
/**
 * 復元対象があるか確認し、あればデータを取得する (Load)
 */
export async function CPGetChiAutosaveFromDB() {
    const result = await performAction("readonly", (store) =>
        store.get(STORAGE_KEY),
    );
    return result || null; // データがなければnull
}

/**
 * 復元が完了した、あるいは不要になった場合に「復元済み」とする (Clear)
 * ※次に保存(backup)した時に上書きされるので、必須ではありません。
 */
export async function CPClearChiAutosaveFromDB() {
    // 復元可能なバックアップが存在することを示すフラグをlocalStorageから削除
    localStorage.removeItem("has_chibi_autosave_flag");
    return performAction("readwrite", (store) => store.delete(STORAGE_KEY));
}
