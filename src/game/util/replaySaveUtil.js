
import checksum from "./checksumUtil.js";
import bitstream from "./bitstreamUtil.js";
import ReplayStream from "../replay/ReplayStream.js";

function encodeInput(left, right, up, down) {
    return (left << 3) | (right << 2) | (up << 1) | down;
}


function encodeReplay(username, recorder) {

    const { inputs, durations, tileChanges } = recorder;

    const writer = bitstream.createWriter();
    writer.writeVariableLength(durations.length);

    for (let i = 0; i < durations.length; i++) {
        writer.write(inputs[i], 4);
        writer.writeVariableLength(durations[i]);
    }

    writer.writeVariableLength(tileChanges.length);
    let previousTileChangeFrame = 0;
    for (let i = 0; i < tileChanges.length; i++) {
        writer.writeVariableLength(tileChanges[i][0]);
        writer.writeVariableLength(tileChanges[i][1]);
        writer.writeVariableLength(tileChanges[i][2] - previousTileChangeFrame);
        previousTileChangeFrame = tileChanges[i][2];
    }

    return checksum.add(window.btoa(username) + ";" + writer.finish());
}

// Takes replay code, spits out object containing decoded data
function decodeReplay(code) {

    code = checksum.verify(code);

    // Extract username from before the semicolon
    const separatorIndex = code.lastIndexOf(";");
    const username = window.atob(code.slice(0, separatorIndex));
    const durations = [];
    const inputs = [];
    const tileChanges = [];
    

    const data = code.slice(separatorIndex + 1);
    const reader = bitstream.createReader(data);
    const runCount = reader.readVariableLength();

    for (let i = 0; i < runCount; i++) {
        const input = reader.read(4);
        inputs.push([
            ((input >> 3) & 1) === 1,
            ((input >> 2) & 1) === 1,
            ((input >> 1) & 1) === 1,
            (input & 1) === 1,
        ]);

        durations.push(reader.readVariableLength());
    }

    const tileChangeCount = reader.readVariableLength();
    let tileChangeFrame = 0;
    for (let i = 0; i < tileChangeCount; i++) {
        const index = reader.readVariableLength();
        const tileId = reader.readVariableLength();
        tileChangeFrame += reader.readVariableLength();
        tileChanges.push([index, tileId, tileChangeFrame]);
    }

    return { username, inputs, durations, tileChanges };
}

const replaySaveUtil = {
    encode: encodeReplay,
    decode: decodeReplay,
    encodeInput,
};

export default replaySaveUtil;