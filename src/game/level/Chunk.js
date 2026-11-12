import { ChunkRenderer } from "./ChunkRenderer.js";

class Chunk {
    static size = 16;

    constructor(chunkX, chunkY, level) {
        this.renderer = new ChunkRenderer(chunkX, chunkY, level);
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

export { Chunk };