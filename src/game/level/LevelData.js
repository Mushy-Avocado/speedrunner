
class LevelData {

    static fromDecoded({ tiles, width }) {
        const result = new LevelData(width, tiles.length / width);
        result.tiles = tiles.slice();
        return result;
    }

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = new Uint32Array(width * height);
    }

    getIndex(x, y) {
        return x + y * this.width;
    }

    getTile(x, y) {
        return this.getTileAt(this.getIndex(x, y))
    }
    setTile(x, y, value) {
        this.setTileAt(this.getIndex(x, y), value);
    }
    
    getTileAt(index) {
        return this.tiles[index];
    }
    setTileAt(index, value) {
        this.tiles[index] = value;
    }

    deleteTile(x, y) {
        this.setTile(x, y, 0);
    }

    clone() {
        return LevelData.fromDecoded(this);
    }

}

export { LevelData };