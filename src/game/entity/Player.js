import Bounds from "../Bounds";
import ReplayRecorder from "../replay/ReplayRecorder";


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
        this.isGrounded = false;
        this.velocityY += deltaTime * 980;

        this.x += this.velocityX * deltaTime;

        this.collideLevelDataX(levelData, grid);

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

class Player extends SimpleBody {
    constructor(levelData, grid) {
        super(50, 0, 20, 30);
        this.levelData = levelData;
        this.grid = grid;
        this.replayRecorder = new ReplayRecorder();
    }

    fixedUpdate(deltaTime) {
        this.replayRecorder.fixedUpdate();
        
        if (this.isMovingLeft) {
            this.velocityX -= 2000 * deltaTime;
        }

        if (this.isMovingRight) {
            this.velocityX += 2000 * deltaTime;
        }

        this.applyFriction(5 * deltaTime, 0);
        
        if (this.isQueuedJumping) {
            this.isQueuedJumping = false;
            this.velocityY = -400;
        }
        super.fixedUpdate(deltaTime, this.levelData, this.grid);
    }

    updateControls(keyboard) {
        this.isMovingLeft = false;
        this.isMovingRight = false;
        if (keyboard.key("KeyA")) {
            this.isMovingLeft = true;
        }
        if (keyboard.key("KeyD")) {
            this.isMovingRight = true;
        }
        if (keyboard.keyDown("Space") && this.isGrounded) {
            this.isQueuedJumping = true;
        }
        this.replayRecorder.setInput(this.isMovingLeft, this.isMovingRight, this.isQueuedJumping, false);

    }
    
    render(ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}



export default Player;