import tileDataUtil from "../util/tileDataUtil.js";
import { Chunk } from "./Chunk";

// Caches rendering of chunk into a single image for performance boost
// The downside is that redrawing a tile costs more.
// If a tile changes frequently, mark it as animated to avoid too many updates
class ChunkRenderer {

    canvas = document.createElement("canvas");
    dynamicTiles = [];
    isDirty = false;

    constructor(chunkX, chunkY, grid, levelData, tileData) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.startX = chunkX * Chunk.size;
        this.startY = chunkY * Chunk.size;
        this.endX = this.startX + Chunk.size;
        this.endY = this.startY + Chunk.size;
        this.levelData = levelData;
        this.tileData = tileData;
        this.grid = grid;
        this.canvas.width = grid.size * Chunk.size;
        this.canvas.height = grid.size * Chunk.size;
        this.ctx = this.canvas.getContext("2d");
        this.setDirty();
    }

    // Sets a tile as dirty to repaint the chunk
    setDirty(x, y) {
        const tile = this.levelData.getTile(x, y);
        if (tile) {
            const tileId = tileDataUtil.getId(tile);
            if (this.tileData[tileId].isAnimated) {
                return;
            }
        }
        this.isDirty = true;
    }

    repaint() {
        this.dynamicTiles.length = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.grid.cellToWorld(this.startX), -this.grid.cellToWorld(this.startY));
        const width = this.grid.size;
        const height = this.grid.size;
        for (let y = this.startY; y < this.endY; y++) {
            for (let x = this.startX; x < this.endX; x++) {
                const tile = this.levelData.getTile(x, y);
                const tileId = tileDataUtil.getId(tile);
                const tileX = this.grid.cellToWorld(x);
                const tileY = this.grid.cellToWorld(y);
                if (tileId !== 0) {
                    if (!this.tileData[tileId].isAnimated) {
                        this.tileData[tileId].render(tile, this.ctx, tileX, tileY, width, height);
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
        const originX = this.grid.cellToWorld(this.startX);
        const originY = this.grid.cellToWorld(this.startY);
        ctx.drawImage(this.canvas, originX, originY);
        for (let i = 0; i < this.dynamicTiles.length; i++) {
            const dynamicTile = this.dynamicTiles[i];
            const tileId = tileDataUtil.getId(dynamicTile[0]);
            const tileX = dynamicTile[1];
            const tileY = dynamicTile[2];
            this.tileData[tileId].render(dynamicTile[0], ctx, tileX, tileY, this.grid.size, this.grid.size);
        } 
    }
}

export { ChunkRenderer };