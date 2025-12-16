import { set, get, del } from 'idb-keyval';

const PCAP_KEY = 'hsafe_pcap_file';
const PCAP_META_KEY = 'hsafe_pcap_meta';

/**
 * Save PCAP file and metadata to IndexedDB
 * @param {File} file 
 */
export const savePCAP = async (file) => {
    try {
        await set(PCAP_KEY, file);
        // Store metadata separately for quick access if needed (though file object has name/size)
        // Storing basic meta is useful if we want to show info without loading the whole blob into memory potentially
        await set(PCAP_META_KEY, {
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            type: file.type
        });
        console.log("PCAP saved to IndexedDB");
    } catch (err) {
        console.error("Failed to save PCAP to storage:", err);
    }
};

/**
 * Retrieve PCAP file from IndexedDB
 * @returns {Promise<File|null>}
 */
export const getPCAP = async () => {
    try {
        const file = await get(PCAP_KEY);
        return file || null;
    } catch (err) {
        console.error("Failed to get PCAP from storage:", err);
        return null;
    }
};

/**
 * Delete PCAP file and metadata from IndexedDB
 */
export const deletePCAP = async () => {
    try {
        await del(PCAP_KEY);
        await del(PCAP_META_KEY);
        console.log("PCAP deleted from IndexedDB");
    } catch (err) {
        console.error("Failed to delete PCAP from storage:", err);
    }
};
