

class Grid {
    constructor(size) {
        this.size = size;
    }

    worldToCell(x) {
        return Math.floor(x / this.size);
    }

    cellToWorld(x) {
        return x * this.size;
    }

    iterate(minX, minY, width, height, callback) {
        const maxX = minX + width;
        const maxY = minY + height;
        for (let y = Math.floor(minY / this.size); y <= Math.floor(maxY / this.size); y++) {
            for (let x = Math.floor(minX / this.size); x <= Math.floor(maxX / this.size); x++) {
                callback(x, y);
            }
        }
    }
}

export { Grid };