import { Grid } from "./level/Grid";
import { ChunkLoader } from "./level/ChunkLoader";
import { CanvasDisplay } from "./CanvasDisplay";
import { Camera } from "./Camera";
import { Keyboard, Mouse } from "./Input";
import { MainLoop } from "./MainLoop";
import { FixedLoop } from "./FixedLoop";
import tileDataUtil from "./util/tileDataUtil";
import { TILE_ID, tileTypes } from "./data/tileTypes";
import { ReplayStream } from "./replay/ReplayStream";
import { GhostPlayer } from "./entity/GhostPlayer";
import { LivePlayer } from "./entity/LivePlayer";
import levelSaveUtil from "./util/levelSaveUtil";
import replaySaveUtil from "./util/replaySaveUtil";
import { PerformanceMetric } from "./PerformanceMetric";
import { DebugUI } from "./ui/DebugUI";
import { Level } from "./level/Level";

function run() {

    // Metrics and debugging
    const mainLoopMetric = new PerformanceMetric("Main Loop");
    const fixedLoopMetric = new PerformanceMetric("Fixed Loop");
    const debugUI = new DebugUI();
    debugUI.addMetric(mainLoopMetric);
    debugUI.addMetric(fixedLoopMetric);
    
    // Raw data
    const levelCode = "60;AAAAAAAAAlgACAAAAAACWA~1802lis~1sjqxnu";
    const replayCode = "TVVTSFk=;4BBpDGBQkCICAsgQBQQBoCAogQXIEFyBBggQaQIBYBAtAgRQED0HAKCwDQQKQYVoGBgBQMBYDQ8BIFoGAgCQMCIDARAwEoGB0-g4IICGJkYIICGqj4IICMgbjYIICGsi4IICFtiYIICGOh4IICB-x4IICE_B4IICCfR4IICCfh4IICB_x4IICCoCIIICCeR4IICIAeB4IICCtx4IICCdh4IICB9R4IICCoz4IICLAg~8fpr2o";
    
    // Decoded data
    const levelData = levelSaveUtil.decode(levelCode);
    const ghostLevelData = levelSaveUtil.decode(levelCode);
    
    // Final data
    const grid = new Grid(30);
    const level = new Level(levelData, grid, tileTypes);
    const chunks = new ChunkLoader(level);
    const ghostLevel = new Level(ghostLevelData, grid, tileTypes);
    const ghostChunks = new ChunkLoader(ghostLevel);
    const stream = ReplayStream.fromData(ghostChunks, replaySaveUtil.decode(replayCode));

    // Rendering
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d");
    const display = new CanvasDisplay(canvas, 600, 400);
    const camera = new Camera(display);
    camera.setCenter(display.width / 2, display.height / 2);
    
    // Input
    const keyboard = new Keyboard();
    const mouse = new Mouse(canvas);
    mouse.setCamera(camera);
    
    // Placement
    let selectedTile = tileDataUtil.setId(TILE_ID.EMPTY, TILE_ID.GRASS);
    
    // Players
    const player = new LivePlayer(level, 50, 50);
    let ghost = stream ? new GhostPlayer(stream, 50, 50) : null;

    function main() {
        mainLoopMetric.startFrame();

        display.updateSize();

        // Layout
        ctx.save();
        display.applyScaling();
        ctx.save();
        camera.applyTransform();

        // Background
        ctx.fillStyle = "#264d8e";
        ctx.fillRect(0, 0, display.width, display.height);

        // Input
        if (mouse.buttonDown(0)) {
            const gridX = grid.worldToCell(mouse.x);
            const gridY = grid.worldToCell(mouse.y);
            levelData.setTile(gridX, gridY, selectedTile);
            player.replayRecorder.recordTile(levelData.getIndex(gridX, gridY), selectedTile);
            chunks.setDirty(gridX, gridY);
        }
        if (keyboard.keyDown("KeyS")) {
            console.log(replaySaveUtil.encode("MUSHY", player.replayRecorder));
        }

        // Chunks
        ghostChunks.update(camera);
        ghostChunks.render(ctx, camera, 0.4);
        chunks.update(camera);
        chunks.render(ctx, camera);
        mainLoopMetric.timer("Chunks");

        // Player
        player.updateControls(keyboard);
        player.render(ctx);
        if (ghost) {
            ghost.updateControls();
            ghost.render(ctx);
        }
        mainLoopMetric.timer("Player");
        
        ctx.restore();
        
        // HUD
        debugUI.render(ctx);
        
        ctx.restore(); // End of rendering

        // Clean up
        mouse.endFrame();
        keyboard.endFrame();

    }

    function fixedUpdate() {

        fixedLoopMetric.startFrame();

        player.fixedUpdate(physicsLoop.deltaTime);
        if (ghost) {
            ghost.fixedUpdate(physicsLoop.deltaTime);
        }
        
    }

    const mainLoop = new MainLoop(main);
    const physicsLoop = new FixedLoop(fixedUpdate);
    mainLoop.start();
    physicsLoop.start();
    
}

export { run };