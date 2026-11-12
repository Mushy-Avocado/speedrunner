import { Character } from "./Character";

class Player extends Character {
    constructor(level, x, y) {
        super(level, x, y, 20, 30);
    }
    
    render(ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    updateControls(keyboard) {}

}



export { Player };