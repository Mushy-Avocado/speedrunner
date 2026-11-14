
import { Level } from "./Level.js";
import { ChunkRendererComponent } from "./ChunkRendererComponent.js";
import { ChunkLoader } from "./ChunkLoader.js";

class ChunkedLevel extends Level {
    
    constructor(levelData, grid, tileTypes) {
        super(levelData, grid, tileTypes);
        this.chunks = new ChunkLoader(grid, levelData.width, levelData.height, (chunkX, chunkY) => {
            return [
                new ChunkRendererComponent(chunkX, chunkY, this),
            ];
        });
    }

    update(deltaTime, camera) {
        this.chunks.update(deltaTime, camera);
    }

    render(ctx, camera) {   
        this.chunks.render(ctx, camera);
    }

    fixedUpdate(deltaTime, camera) {
        this.chunks.fixedUpdate(deltaTime, camera);
    }

    setTileAt(index, tile) {
        super.setTileAt(index, tile);
        if (this.getTileAt(index) !== tile) {
            this.chunks.setDirtyAt(index);
        }
    }

    setTile(x, y, tile) {
        super.setTile(x, y, tile);
        if (this.getTile(x, y) !== tile) {
            this.chunks.setDirty(x, y);
        }
    }

}

export { ChunkedLevel };