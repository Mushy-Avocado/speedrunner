import tileDataUtil from "../util/tileDataUtil.js";
import { Chunk } from "./Chunk";

// Caches rendering of chunk into a single image for performance boost
// The downside is that redrawing a tile costs more.
// If a tile changes frequently, mark it as animated to avoid too many updates
class ChunkRenderer {

    canvas = document.createElement("canvas");
    dynamicTiles = [];
    isDirty = false;

    constructor(chunkX, chunkY, level) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.startX = chunkX * Chunk.size;
        this.startY = chunkY * Chunk.size;
        this.endX = this.startX + Chunk.size;
        this.endY = this.startY + Chunk.size;
        this.level = level;
        this.canvas.width = this.level.grid.size * Chunk.size;
        this.canvas.height = this.level.grid.size * Chunk.size;
        this.ctx = this.canvas.getContext("2d");
        this.setDirty();
    }

    // Sets a tile as dirty to repaint the chunk
    setDirty(x, y) {
        if (this.level.getTileType(x, y)?.isAnimated) {
            return;
        }
        this.isDirty = true;
    }

    repaint() {
        this.dynamicTiles.length = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.level.grid.cellToWorld(this.startX), -this.level.grid.cellToWorld(this.startY));
        const width = this.level.grid.size;
        const height = this.level.grid.size;
        for (let y = this.startY; y < this.endY; y++) {
            for (let x = this.startX; x < this.endX; x++) {
                const tile = this.level.data.getTile(x, y);
                const tileId = tileDataUtil.getId(tile);
                const tileX = this.level.grid.cellToWorld(x);
                const tileY = this.level.grid.cellToWorld(y);
                if (tileId !== 0) {
                    const tileType = this.level.getTileType(x, y);
                    if (!tileType.isAnimated) {
                        tileType.render(tile, this.ctx, tileX, tileY, width, height);
                    } else {
                        this.dynamicTiles.push([tile, tileX, tileY]);
                    }
                }
            }
        }
        this.ctx.restore();
    }

    render(ctx) {
        if (this.isDirty) {
            this.repaint();
            this.isDirty = false;
        }
        const originX = this.level.grid.cellToWorld(this.startX);
        const originY = this.level.grid.cellToWorld(this.startY);
        ctx.drawImage(this.canvas, originX, originY);
        for (let i = 0; i < this.dynamicTiles.length; i++) {
            const dynamicTile = this.dynamicTiles[i];
            const tileId = tileDataUtil.getId(dynamicTile[0]);
            const tileX = dynamicTile[1];
            const tileY = dynamicTile[2];
            this.level.tileTypes[tileId].render(dynamicTile[0], ctx, tileX, tileY, this.level.grid.size, this.level.grid.size);
        } 
    }
}

export { ChunkRenderer };