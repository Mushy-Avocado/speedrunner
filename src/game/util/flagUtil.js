
// Utils for modification of bits to make flags.
const flagUtil = {
    has(flags, mask) {
        return (flags & mask) === mask;
    },
    hasAny(flags, mask) {
        return (flags & mask) !== 0;
    },
    add(flags, mask) {
        return flags | mask;
    },
    remove(flags, mask) {
        return flags & ~mask;
    },
    toggle(flags, mask) {
        return flags ^ mask;
    },
    // Closure function to make up to 8 flags
    createSet() {
        let index = 0;
        return () => {
            const result = 1 << index++;
            if (index > 8) {
                throw "Cannot create more than 8 flags in a flag set.";
            }
            return result;
        };
    },
};

export default flagUtil;