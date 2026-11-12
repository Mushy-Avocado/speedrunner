
import uint32ArrayUtil from "./uint32ArrayUtil";
import checksum from "./checksumUtil";
import { LevelData } from "../level/LevelData";

function encodeLevel(levelData) {
    const width = levelData.width;
    const tiles = uint32ArrayUtil.encode(levelData.data, true);

    return checksum.add(width + ";" + tiles);
}

function decodeLevel(rawData) {
    const [width, tiles] = checksum.verify(rawData).split(";");
    return LevelData.from(uint32ArrayUtil.decode(tiles, true), parseInt(width, 10));
}

export default {
   encode: encodeLevel,
   decode: decodeLevel,
};