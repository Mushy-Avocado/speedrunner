
import tileDataUtil from "../util/tileDataUtil.js";

// Easier to pass around and guarantees that the data stays together
class Level {
    constructor(data, grid, tileTypes) {
        this.data = data;
        this.grid = grid;
        this.tileTypes = tileTypes;
    }

    getTileType(x, y) {
        const tile = this.data.getTile(x, y);
        return this.tileTypes[tileDataUtil.getId(tile)];
    }
}

export { Level };