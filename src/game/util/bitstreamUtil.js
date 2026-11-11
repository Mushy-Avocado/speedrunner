
// Custom Base64 implementation with variable-length encoding and bit-packing
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// Write bits, any unused bits on the base64 respresentation are packed into the next value.
function createBitWriter() {
    let result = "";
    let buffer = 0;
    let bitCount = 0;

    return {
        // Writes using bit packing. If the previous value left unused bits pack them into the current one
        write(value, length) {
            buffer = buffer * (2 ** length) + value;
            bitCount += length;

            while (bitCount >= 6) {
                bitCount -= 6;
                result += alphabet[Math.floor(buffer / (2 ** bitCount))];
                buffer = buffer % (2 ** bitCount);
            }
        },
        // When the bits needed can vary, use variable-length encoding to minimize wasted bits.
        // 5 bit chunks and a continuation bit are added as needed
        writeVariableLength(value) {
            do {
                let chunk = value % 32;
                value = Math.floor(value / 32);
                if (value > 0) chunk |= 32;
                this.write(chunk, 6);
            } while (value > 0);
        },
        // Outputs the final encoding
        finish() {
            if (bitCount > 0) {
                result += alphabet[buffer * (2 ** (6 - bitCount))];
            }
            return result;
        },
    };
}

function createBitReader(code) {
    let index = 0;
    let buffer = 0;
    let bitCount = 0;

    return {
        read(length) {
            while (bitCount < length) {
                if (index >= code.length) {
                    throw new Error("Unexpected end of encoded data.");
                }
                const value = alphabet.indexOf(code[index++]);
                if (value < 0) {
                    throw new Error("Invalid character in encoded data.");
                }
                buffer = buffer * 64 + value;
                bitCount += 6;
            }

            bitCount -= length;
            const value = Math.floor(buffer / (2 ** bitCount));
            buffer %= 2 ** bitCount;
            return value;
        },
        readVariableLength() {
            let value = 0;
            let multiplier = 1;
            let chunk;

            // Continue reading chunks while the continuation bit is set
            // Combine the values together until the final value is read
            do {
                chunk = this.read(6);
                value += (chunk & 31) * multiplier;
                multiplier *= 32;
            } while (chunk & 32);

            return value;
        },
    };
}

const bitstreamUtil = { createWriter: createBitWriter, createReader: createBitReader };;

export default bitstreamUtil;