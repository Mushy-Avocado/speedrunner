
// Basic utility to make sure that nothing gets modified
// Not really for security, more to make sure the save isnt corrupted accidentally

function checksum(text) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
        hash ^= text.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(36);
}

function addChecksum(code) {
    return code + "~" + checksum(code);
}

function verifyChecksum(code) {
    const separator = code.lastIndexOf("~");
    if (separator < 0) throw new Error("Missing checksum.");

    const payload = code.slice(0, separator);
    const savedChecksum = code.slice(separator + 1);
    if (checksum(payload) !== savedChecksum) {
        throw new Error("Speedrun code was modified or corrupted.");
    }
    return payload;
}

const checksumUtil = {
    add: addChecksum,
    verify: verifyChecksum,
};

export default checksumUtil;