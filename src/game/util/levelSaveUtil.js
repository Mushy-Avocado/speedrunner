
import uint32ArrayUtil from "./uint32ArrayUtil";
import checksum from "./checksumUtil";

function encodeLevel(levelData) {
    const width = levelData.width;
    const tiles = uint32ArrayUtil.encode(levelData.data, true);

    return checksum.add(width + ";" + tiles);
}

function decodeLevel(rawData) {
    const [width, tiles] = checksum.verify(rawData).split(";");
    return { tiles: uint32ArrayUtil.decode(tiles, true), width: parseInt(width, 10) };
}

const levelSaveUtil = {
    encode: encodeLevel,
    decode: decodeLevel,
};

export default levelSaveUtil;