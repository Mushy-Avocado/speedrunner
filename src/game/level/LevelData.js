
class LevelData {

    static from(array32, width) {
        const result = new LevelData(width, array32.length / width);
        result.data = array32;
        return result;
    }

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint32Array(width * height);
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
        return this.data[index];
    }
    setTileAt(index, value) {
        this.data[index] = value;
    }

    deleteTile(x, y) {
        this.setTile(x, y, 0);
    }

    clone() {
        return LevelData.from(this.data.slice(), this.width);
    }

}

export { LevelData };