
import { Level } from "./Level.js";

class FullLevel extends Level {

    constructor(levelData, grid, tileTypes) {
        super(levelData, grid, tileTypes);
    }

    update(deltaTime, camera) {
        
    }

    render(ctx, camera) {
        this.grid.iterate(camera.viewport.minX, camera.viewport.minY, camera.viewport.width, camera.viewport.height, (x, y, tile) => {
            const tileType = this.getTileType(x, y);
            if (tileType) {
                tileType.render(tile, ctx, this.grid.cellToWorld(x), this.grid.cellToWorld(y), this.grid.size, this.grid.size);
            }
        });
    }

    fixedUpdate(deltaTime, camera) {
        
    }

}

export { FullLevel };