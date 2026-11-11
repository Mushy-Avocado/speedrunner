import uint32Util from "./uint32Util.js";

// Lightning fast data extraction for tiles.
// Bits allocated: 26 of 32. 6 bits free for additional data if needed.
const tileDataUtil = {
    // Light value
    // Bits 0-3
    // Max value 15
    getLight(uint32) {
        return uint32 & 15;
    },
    setLight(uint32, value) {
        return uint32Util.assignBits(uint32, value, 0, 4);
    },
    // Unique value, differs per tile what it represents
    // Bits 4-7
    // Max value 15
    getValue(uint32) {
        return (uint32 >>> 4) & 15;
    },
    setValue(uint32, value) {
        return uint32Util.assignBits(uint32, value, 4, 4);
    },
    // Flags
    // Bits 8-15
    // 8 flags max
    getFlags(uint32) {
        return (uint32 >>> 8) & 0b1111_1111;
    },
    setFlags(uint32, value) {
        return uint32Util.assignBits(uint32, value, 8, 8);
    },
    // Orientation (90 degree increments)
    // Bits 16-17
    // Max value 3
    getOrientation(uint32) {
        return (uint32 >>> 16) & 3;
    },
    setOrientation(uint32, value) {
        return uint32Util.assignBits(uint32, value, 16, 2);
    },
    // Tile ID
    // Bits 18-25
    // Max value 255
    getId(uint32) {
        return (uint32 >>> 18) & 255;
    },
    setId(uint32, value) {
        return uint32Util.assignBits(uint32, value, 18, 8);
    },
};

export default tileDataUtil;