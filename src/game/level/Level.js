
import tileDataUtil from "../util/tileDataUtil.js";

// Easier to pass around and guarantees that the data stays together
class Level {

    constructor(levelData, grid, tileTypes) {
        this.data = levelData;
        this.grid = grid;
        this.tileTypes = tileTypes; 
        this.width = levelData.width;
        this.height = levelData.height;
    }

    getTileType(x, y) {
        const tile = this.data.getTile(x, y);
        return this.tileTypes[tileDataUtil.getId(tile)];
    }


    getTile(x, y) {
        return this.data.getTile(x, y);
    }
    setTile(x, y, tile) {
        if (this.getTile(x, y) !== tile) {
            this.data.setTile(x, y, tile);
        }
    }

    getIndex(x, y) {
        return y * this.data.width + x;
    }

    getTileAt(index) {
        return this.data.getTileAt(index);
    }
    setTileAt(index, tile) {
        if (this.data.getTileAt(index) !== tile) {
            this.data.setTileAt(index, tile);
        }
    }

}

export { Level };