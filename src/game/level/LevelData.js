
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

    /*
    static fromJSON(json) {
        const result = new LevelData(json.width, json.height);
        result.data = base64Util.toUint32Array(json.base64);
        return result;
    }

    save() {
        const base64 = base64Util.fromUint32Array(this.data);
        const data = {
            width: this.width,
            height: this.height,
            base64,
        };
        const txt = JSON.stringify(data);
        const link = document.createElement('a');
        link.style.display = "none";
        link.setAttribute('href', 'data:text/plain,' + txt);
        link.setAttribute('download', 'level.txt');
        document.getElementsByTagName("body")[0].appendChild(link).click();
    }
    */

}

export { LevelData };