// Utility functions for converting base64 data
// KA has a strict CSP for fetch() requests, so .bin files cant be loaded.
// However base64 is somewhat large in file size. 
// See file: uint32ArrayUtil.js with RLE and custom base64 encoding.
const base64Util = {
    // Converts from base64 to a Uint32Array 
    toUint32Array(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Uint32Array(bytes.buffer);
    },
    // Converts from a Uint32Array to base64
    fromUint32Array(uint32Array) {
        const bytes = new Uint8Array(uint32Array.buffer, uint32Array.byteOffset, uint32Array.byteLength);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    }
};

export default base64Util;