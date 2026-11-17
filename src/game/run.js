import { Game } from "./Game";
import { LevelScene } from "./scenes/LevelScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { levelCodes } from './data/levelCodes';

window.replays = [
    "TVVTSFk=;4BBpDGBQkCICAsgQBQQBoCAogQXIEFyBBggQaQIBYBAtAgRQED0HAKCwDQQKQYVoGBgBQMBYDQ8BIFoGAgCQMCIDARAwEoGB0-g4IICGJkYIICGqj4IICMgbjYIICGsi4IICFtiYIICGOh4IICB-x4IICE_B4IICCfR4IICCfh4IICB_x4IICCoCIIICCeR4IICIAeB4IICCtx4IICCdh4IICB9R4IICCoz4IICLAg~8fpr2o"
];


function run() {
    (new Game({
        level: new LevelScene(),
        mainMenu: new MainMenuScene(),
    })).start("mainMenu", {
        levelCodes,
        // "TVVTSFk=;LApEmHBNBWHR0CEoBAZGwA~1qmhtfe"
        replay: "TVVTSFk=;1BDgFE2GRoC4IoeDwCQdiE5ChCh4UoaBwJTAFiEBAGEaJhGiYLAJEGKRBjgBhCh4UoiBADRtiUSgyh4ToeDMBRRiUZgcFgA~jqa8ak",
    });
}

export { run };