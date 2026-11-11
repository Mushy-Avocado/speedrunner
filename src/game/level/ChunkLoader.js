import tileDataUtil from "../util/tileDataUtil.js";
import Grid from "./Grid.js";

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

    setDirty() {
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

class Chunk {
    static size = 16;

    constructor(chunkX, chunkY, grid, levelData, tileData) {
        this.renderer = new ChunkRenderer(chunkX, chunkY, grid, levelData, tileData);
    }

    setDirty() {
        this.renderer.setDirty();
    }

    update(tick) {

    }

    render(ctx) {
        this.renderer.render(ctx);
    }
    
    unload() {

    }
}

class ChunkLoader {

    chunks = [];
    chunkGrid = new Grid(Chunk.size);
    queuedChunks = new Set();
    chunksPerFrame = 4;
    addedChunk = false;
    loadQueue = [];

    // No reasonable need to unload distant chunks right now
    // They use very little memory
    unloadDistantChunks = false;

    constructor(levelData, tileData, grid) {
        this.levelData = levelData;
        this.grid = grid;
        this.minChunkX = 0;
        this.minChunkY = 0;
        this.maxChunkX = Math.ceil(levelData.width / Chunk.size);
        this.maxChunkY = Math.ceil(levelData.height / Chunk.size);
        this.tileData = tileData;
    }

    instantLoad(x, y) {
        const index = x + y * this.maxChunkX;
        if (this.chunks[index]) return;
        const chunk = new Chunk(x, y, this.grid, this.levelData, this.tileData);
        this.chunks[index] = chunk;
        return chunk;
    }

    queueLoad(x, y, startX = 0, startY = 0) {
        const index = x + y * this.maxChunkX;
        if (this.chunks[index] || this.queuedChunks.has(index)) return;

        const centerX = startX / this.grid.size;
        const centerY = startY / this.grid.size;
        const chunkCenterX = (x + 0.5) * Chunk.size / this.grid.size;
        const chunkCenterY = (y + 0.5) * Chunk.size / this.grid.size;
        const dx = chunkCenterX - centerX;
        const dy = chunkCenterY - centerY;

        this.queuedChunks.add(index);
        this.loadQueue.push({ x, y, index, distance: dx * dx + dy * dy });
        this.addedChunk = true; // To know to sort chunks queue after they've been queued
    }

    processLoadQueue() {
        if (this.loadQueue.length === 0) {
            if (this.resolveLoadAll) {
                this.resolveLoadAll();
            }
            return;
        }
        for (let i = 0; i < Math.min(this.chunksPerFrame, this.loadQueue.length); i++) {
            const chunk = this.loadQueue.shift();
            this.queuedChunks.delete(chunk.index);
            this.instantLoad(chunk.x, chunk.y);
        }
    }

    unload(x, y) {
        const index = x + y * this.maxChunkX;
        this.chunks[index]?.unload();
        delete this.chunks[index];
    }

    getChunk(x, y) {
        const index = x + y * this.maxChunkX;
        if (!this.chunks[index]) {
            return this.instantLoad(x, y);
        }
        return this.chunks[index];
    }

    // Mark a cell as dirty so the chunk loader knows to update its render
    // Not calling this will result in outdated rendering
    setDirty(x, y) {
        const index = this.chunkGrid.worldToCell(x) + this.chunkGrid.worldToCell(y) * this.maxChunkX;
        if (this.chunks[index]) {
            this.chunks[index].setDirty();
        }
    }
    setDirtyAt(index) {
        this.setDirty(index % this.levelData.width, Math.floor(index / this.levelData.width));
    }

    queueLoadAll(startX, startY) {
        for (let y = 0; y < this.maxChunkY; y++) {
            for (let x = 0; x < this.maxChunkX; x++) {
                this.queueLoad(x, y, startX, startY);
            }
        }
        return new Promise((resolve, reject) => {
            this.resolveLoadAll = () => void resolve();
            // If someones computer is excessively slow, just reject the promise. 
            // Possibly just load the chunks lazily instead. This behavior will be handled by the loader
            setTimeout(() => reject(new Error("Failed to load all chunks")), 60000);
        });
    }

    getViewportBounds(camera) {
        const viewport = camera.viewport;
        return {
            minX: Math.max(this.chunkGrid.worldToCell(this.grid.worldToCell(viewport.minX)), this.minChunkX),
            minY: Math.max(this.chunkGrid.worldToCell(this.grid.worldToCell(viewport.minY)), this.minChunkY),
            maxX: Math.min(this.chunkGrid.worldToCell(this.grid.worldToCell(viewport.maxX)), this.maxChunkX - 1),
            maxY: Math.min(this.chunkGrid.worldToCell(this.grid.worldToCell(viewport.maxY)), this.maxChunkY - 1)
        };
    }

    // Load/unload chunks if necessary
    updateChunks(previous, current, camera) {
        const overlapMinX = Math.max(previous.minX, current.minX);
        const overlapMaxX = Math.min(previous.maxX, current.maxX);
        const overlapMinY = Math.max(previous.minY, current.minY);
        const overlapMaxY = Math.min(previous.maxY, current.maxY);

        // Camera teleportation case, when theres no overlap so all chunks must be loaded
        if (overlapMinX > overlapMaxX || overlapMinY > overlapMaxY) {
            if (this.unloadDistantChunks) {
                for (let y = previous.minY; y <= previous.maxY; y++) {
                    for (let x = previous.minX; x <= previous.maxX; x++) {
                        this.unload(x, y);
                    }
                }
            }
            for (let y = current.minY; y <= current.maxY; y++) {
                for (let x = current.minX; x <= current.maxX; x++) {
                    this.queueLoad(x, y, camera.centerX, camera.centerY);
                }
            }
            return;
        }

        // A bunch of loops to make sure theres no unnecessary iteration
        // Loads only whats needed, unloads whats not needed

        if (this.unloadDistantChunks) {
            // Unload left
            for (let x = previous.minX; x < overlapMinX; x++) {
                for (let y = previous.minY; y <= previous.maxY; y++) this.unload(x, y);
            }

            // Unload right
            for (let x = overlapMaxX + 1; x <= previous.maxX; x++) {
                for (let y = previous.minY; y <= previous.maxY; y++) this.unload(x, y);
            }

            // Unload top
            for (let y = previous.minY; y < overlapMinY; y++) {
                for (let x = overlapMinX; x <= overlapMaxX; x++) this.unload(x, y);
            }

            // Unload bottom
            for (let y = overlapMaxY + 1; y <= previous.maxY; y++) {
                for (let x = overlapMinX; x <= overlapMaxX; x++) this.unload(x, y);
            }
        }

        // Load left
        for (let x = current.minX; x < overlapMinX; x++) {
            for (let y = current.minY; y <= current.maxY; y++) this.queueLoad(x, y, camera.centerX, camera.centerY);
        }

        // Load right
        for (let x = overlapMaxX + 1; x <= current.maxX; x++) {
            for (let y = current.minY; y <= current.maxY; y++) this.queueLoad(x, y, camera.centerX, camera.centerY);
        }

        // Load top
        for (let y = current.minY; y < overlapMinY; y++) {
            for (let x = overlapMinX; x <= overlapMaxX; x++) this.queueLoad(x, y, camera.centerX, camera.centerY);
        }

        // Load bottom
        for (let y = overlapMaxY + 1; y <= current.maxY; y++) {
            for (let x = overlapMinX; x <= overlapMaxX; x++) this.queueLoad(x, y, camera.centerX, camera.centerY);
        }
    }

    update(camera = null) {

        if (camera) {

            const viewportBounds = this.getViewportBounds(camera);
            const previous = this.previousViewportBounds;
    
            if (previous) {
                if (previous.minX !== viewportBounds.minX || previous.minY !== viewportBounds.minY || previous.maxX !== viewportBounds.maxX || previous.maxY !== viewportBounds.maxY) {
                    this.updateChunks(previous, viewportBounds, camera);
                }
            } else {
                for (let y = viewportBounds.minY; y <= viewportBounds.maxY; y++) {
                    for (let x = viewportBounds.minX; x <= viewportBounds.maxX; x++) {
                        this.queueLoad(x, y, camera.centerX, camera.centerY);
                    }
                }
            }

            this.previousViewportBounds = viewportBounds;
        }
        

        this.processLoadQueue();

        if (this.addedChunk) this.loadQueue.sort((a, b) => a.distance - b.distance);

    }

    render(ctx, camera, alpha = 1) {
        const viewportBounds = this.getViewportBounds(camera);

        for (let y = viewportBounds.minY; y <= viewportBounds.maxY; y++) {
            for (let x = viewportBounds.minX; x <= viewportBounds.maxX; x++) {
                const chunk = this.getChunk(x, y);
                if (chunk) {
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    chunk.render(ctx);
                    ctx.restore();
                }
            }
        }

    }

}

export default ChunkLoader;