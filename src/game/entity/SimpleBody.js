import { Bounds } from "../Bounds";

// Simple collisions and velocity. Nothing crazy.
// If more is added, make a new class to keep this one for quick prototyping
class SimpleBody extends Bounds {

    velocityX = 0;
    velocityY = 0;

    gravity = 2500;
    
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    applyFriction(x, y = x) {
        this.velocityX *= 1 - x;
        this.velocityY *= 1 - y;
    }

    fixedUpdate(deltaTime, level) {
        // Gravity
        this.isGrounded = false;
        
        // X axis
        this.x += this.velocityX * deltaTime;
        this.collideLevelX(level);
        
        // Y axis
        this.velocityY += 0.5 * deltaTime * this.gravity;
        this.y += this.velocityY * deltaTime;
        this.velocityY += 0.5 * deltaTime * this.gravity;
        this.collideLevelY(level);
    }

    collideLevelX(level) {
        level.grid.iterate(this.minX, this.minY, this.width, this.height, (x, y) => {
            const tile = level.data.getTile(x, y);
            if (tile === 0) {
                return;
            }
            const tileX = level.grid.cellToWorld(x);
            const tileY = level.grid.cellToWorld(y);
            const tileType = level.getTileType(x, y);
            if (this.maxX > tileX && this.minX < tileX + level.grid.size && this.maxY > tileY && this.minY < tileY + level.grid.size) {
                if (tileType?.trigger) {
                    tileType.trigger(this, x, y, tile);
                }
                if (tileType?.isTrigger) {
                    return;
                }
                if (this.velocityX > 0) {
                    this.x = tileX - this.width;
                } else {
                    this.x = tileX + level.grid.size;
                }
                this.velocityX = 0;
            }
        });

    }

    collideLevelY(level) {
        level.grid.iterate(this.minX, this.minY, this.width, this.height, (x, y) => {
            const tile = level.data.getTile(x, y);
            if (tile === 0) {
                return;
            }
            const tileX = level.grid.cellToWorld(x);
            const tileY = level.grid.cellToWorld(y);
            const tileType = level.getTileType(x, y);
            if (this.maxX > tileX && this.minX < tileX + level.grid.size && this.maxY > tileY && this.minY < tileY + level.grid.size) {
                if (tileType?.trigger) {
                    tileType.trigger(this, x, y, tile);
                }
                if (tileType?.isTrigger) {
                    return;
                }
                if (this.velocityY > 0) {
                    this.isGrounded = true;
                    this.y = tileY - this.height;
                } else {
                    this.y = tileY + level.grid.size;
                }
                this.velocityY = 0;
            }
        });
    }

}

export { SimpleBody };