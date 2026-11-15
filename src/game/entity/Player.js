import { Character } from "./Character";

class Player extends Character {
    constructor(level, x, y) {
        super(level, x, y, 20, 30);
        this.previousX = x;
        this.previousY = y;
    }

    update(deltaTime) {}
    
    render(ctx, alpha) {
        const renderX = this.previousX + (this.x - this.previousX) * alpha;
        const renderY = this.previousY + (this.y - this.previousY) * alpha;
        ctx.fillStyle = "gray";
        ctx.fillRect(renderX, renderY, this.width, this.height);
    }

    fixedUpdate(deltaTime) {
        this.previousX = this.x;
        this.previousY = this.y;
        super.fixedUpdate(deltaTime);
    }

    updateControls(keyboard) {}

}



export { Player };