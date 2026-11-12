import { Bounds } from "../Bounds";

// Simple collisions and velocity. Nothing crazy.
// If more is added, make a new class to keep this one for quick prototyping
class SimpleBody extends Bounds {

    velocityX = 0;
    velocityY = 0;
    
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    applyFriction(x, y = x) {
        this.velocityX *= 1 - x;
        this.velocityY *= 1 - y;
    }

    fixedUpdate(deltaTime, levelData, grid) {
        // Gravity
        this.isGrounded = false;
        this.velocityY += deltaTime * 980;

        // X axis
        this.x += this.velocityX * deltaTime;
        this.collideLevelDataX(levelData, grid);

        // Y axis
        this.y += this.velocityY * deltaTime;
        this.collideLevelDataY(levelData, grid);
    }

    collideLevelDataX(levelData, grid) {
        grid.iterate(this.minX, this.minY, this.width, this.height, (x, y) => {
            const tile = levelData.getTile(x, y);
            if (tile === 0) {
                return;
            }
            const tileX = grid.cellToWorld(x);
            const tileY = grid.cellToWorld(y);
            if (this.maxX > tileX && this.minX < tileX + grid.size && this.maxY > tileY && this.minY < tileY + grid.size) {
                if (this.velocityX > 0) {
                    this.x = tileX - this.width;
                } else {
                    this.x = tileX + grid.size;
                }
                this.velocityX = 0;
            }
        });

    }

    collideLevelDataY(levelData, grid) {
        grid.iterate(this.minX, this.minY, this.width, this.height, (x, y) => {
            const tile = levelData.getTile(x, y);
            if (tile === 0) {
                return;
            }
            const tileX = grid.cellToWorld(x);
            const tileY = grid.cellToWorld(y);
            if (this.maxX > tileX && this.minX < tileX + grid.size && this.maxY > tileY && this.minY < tileY + grid.size) {
                if (this.velocityY > 0) {
                    this.isGrounded = true;
                    this.y = tileY - this.height;
                } else {
                    this.y = tileY + grid.size;
                }
                this.velocityY = 0;
            }
        });
    }

}

export { SimpleBody };