// Since this program works with 32 bit integers, this is what the utility object is called for clarity
// It would work with other size integers as well.
const uint32Util = {
    assignBits(original, value, startBit, bitLength) {
        // Create a mask of bits to modify
        // A bit length of 5 would result in 0b11111
        const mask = (1 << bitLength) - 1;
        // Clear out the bits to modify
        const clearedOriginal = original & ~(mask << startBit);
        // Combine the new values with the now empty bits on the original value.
        return clearedOriginal | ((value & mask) << startBit);
    }
};

export default uint32Util;