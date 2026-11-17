import { Scene } from "./Scene";
import { validateReplay } from "../speedrun/validateReplay";
import { Grid } from "../level/Grid";
import dateUtil from "../util/dateUtil";

class MainMenuScene extends Scene {

    load(data) {
        const replay = data.replay;
        const levelCodes = data.levelCodes;
        this.validateTask = validateReplay(replay, this.game.display, levelCodes, new Grid(30));
        this.validateTask.promise.then(ms => {
            this.result = "valid";
            this.time = ms;
        }).catch(e => {
            this.result = "invalid";
            this.reason = e.message;
        });
    }

    render(ctx, alpha) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.game.display.width * this.validateTask.progress, this.game.display.height);

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        if (!this.result) {
            ctx.fillText(`Validating replay... ${Math.floor(this.validateTask.progress * 100)}%`, 20, 40);
        } else {
            ctx.fillText(`Replay by ${this.validateTask.username} is ${this.result}`, 20, 40);
            if (this.result === "valid") {
                ctx.fillText(`Time: ${dateUtil.formatMs(this.time)}`, 20, 70);
            } else {
                ctx.fillText(`Reason: ${this.reason}`, 20, 70);
            }
        }
    }

}

export { MainMenuScene };