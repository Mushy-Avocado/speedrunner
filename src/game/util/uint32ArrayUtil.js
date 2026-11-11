import bitstream from "./bitstreamUtil";
import checksum from "./checksumUtil";

function encodeRLE(data) {
    let result = [];
    let last = data[0];
    let count = 1;

    for (let i = 1; i < data.length; i++) {
        if (data[i] === last && count < 65535) {
            count++;
        } else {
            result.push(last, count);
            last = data[i];
            count = 1;
        }
    }

    if (data.length) result.push(last, count);

    return Uint32Array.from(result);
}

function decodeRLE(data) {
    let result = [];

    for (let i = 0; i < data.length; i += 2) {
        let value = data[i];
        let count = data[i + 1];

        for (let j = 0; j < count; j++) result.push(value);
    }

    return Uint32Array.from(result);
}

function encode(array32, useRLE = false) {

    const writer = bitstream.createWriter();
    array32 = useRLE ? encodeRLE(array32) : array32;

    for (let i = 0; i < array32.length; i++) {
        writer.write(array32[i], 32);
    }

    return checksum.add(writer.finish());

}

function decode(data, useRLE = false) {

    data = checksum.verify(data);

    const reader = bitstream.createReader(data);
    const result = new Uint32Array(Math.floor((data.length * 6) / 32));

    for (let i = 0; i < result.length; i++) {
        result[i] = reader.read(32);
    }

    if (useRLE) return decodeRLE(result);
    else return result;
}

export default { encode, decode, };