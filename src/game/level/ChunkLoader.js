import { Grid } from "./Grid.js";
import { ChunkComponent } from "./ChunkComponent.js";

// Loads/unloads chunks
class ChunkLoader {

    chunks = [];
    chunkGrid = new Grid(ChunkComponent.chunkSize);
    queuedChunks = new Set();
    chunksPerFrame = 4;
    addedChunk = false;
    loadQueue = [];

    // Generally a good idea since chunks have canvases that use significant memory
    // Larger levels could potentially crash the page
    unloadDistantChunks = true;

    constructor(grid, width, height, factory) {
        this.cellWidth = width;
        this.cellHeight = height;
        this.grid = grid;
        this.factory = factory;
        this.minChunkX = 0;
        this.minChunkY = 0;
        this.maxChunkX = Math.ceil(width / ChunkComponent.chunkSize);
        this.maxChunkY = Math.ceil(height / ChunkComponent.chunkSize);
    }

    instantLoad(x, y) {
        const index = x + y * this.maxChunkX;
        if (this.chunks[index]) return;
        const chunk = this.factory(x, y);
        for (let component of chunk) {
            if (!(component instanceof ChunkComponent)) {
                throw new Error("Chunk components must be instances of ChunkComponent");
            }
        }
        this.chunks[index] = chunk;
        return chunk;
    }

    queueLoad(x, y, startX = 0, startY = 0) {
        const index = x + y * this.maxChunkX;
        if (this.chunks[index] || this.queuedChunks.has(index)) return;

        const centerX = startX / this.grid.size;
        const centerY = startY / this.grid.size;
        const chunkCenterX = (x + 0.5) * ChunkComponent.chunkSize / this.grid.size;
        const chunkCenterY = (y + 0.5) * ChunkComponent.chunkSize / this.grid.size;
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


    // Mark a cell as dirty so the chunk loader knows to update its render
    // Not calling this will result in outdated rendering
    setDirty(x, y) {
        const index = this.chunkGrid.worldToCell(x) + this.chunkGrid.worldToCell(y) * this.maxChunkX;
        if (this.chunks[index]) {
            for (let component of this.chunks[index]) {
                component.setDirty(x, y);
            }
        }
    }
    setDirtyAt(index) {
        const x = index % this.cellWidth;
        const y = Math.floor(index / this.cellWidth);
        this.setDirty(x, y);
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

    update(deltaTime, camera = null) {

        const viewportBounds = this.getViewportBounds(camera);
        if (camera) {

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

        this.iterateChunkComponents(viewportBounds, component => component.update(deltaTime));

    }

    iterateChunkComponents(viewportBounds, callback) {
        for (let y = viewportBounds.minY; y <= viewportBounds.maxY; y++) {
            for (let x = viewportBounds.minX; x <= viewportBounds.maxX; x++) {
                const chunk = this.chunks[x + y * this.maxChunkX];
                if (chunk) {
                    for (let component of chunk) {
                        callback(component);
                    }
                }
            }
        }
    }

    render(ctx, camera) {
        const viewportBounds = this.getViewportBounds(camera);

        this.iterateChunkComponents(viewportBounds, component => component.render(ctx));
    }

    fixedUpdate(deltaTime, camera) {
        const viewportBounds = this.getViewportBounds(camera);
        this.iterateChunkComponents(viewportBounds, component => component.fixedUpdate(deltaTime));
    }

}

export { ChunkLoader };