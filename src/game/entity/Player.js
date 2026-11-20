import { Character } from "./Character";

class Player extends Character {
    constructor(level, x, y) {
        super(level, x, y, 20, 30);
        this.previousX = x;
        this.previousY = y;
    }

    coyoteTime = 1;
    jumpBufferTime = 3;
    variableJumpScale = 0.7;

    update() {

    }

    getRenderPosition(alpha) {
        return {
            x: this.previousX + (this.x - this.previousX) * alpha,
            y: this.previousY + (this.y - this.previousY) * alpha
        };
    }
    
    render(ctx, alpha) {
        const { x, y } = this.getRenderPosition(alpha);
        ctx.fillStyle = "gray";
        ctx.fillRect(x, y, this.width, this.height);
    }

    fixedUpdate(deltaTime) {
        this.previousX = this.x;
        this.previousY = this.y;
        super.fixedUpdate(deltaTime);
    }

}



export { Player };