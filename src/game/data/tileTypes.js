const TILE_ID = {
    EMPTY: 0,
    GRASS: 1,
    DIRT: 2,
};

const tileTypes = {
    [TILE_ID.GRASS]: {
        render(tile, ctx, x, y, width, height) {
            ctx.fillStyle = "green";
            ctx.fillRect(x, y, width, height);
        },
    },
    [TILE_ID.DIRT]: {
        render(tile, ctx, x, y, width, height) {
            ctx.fillStyle = "brown";
            ctx.fillRect(x, y, width, height);
        },
    },
};

export { TILE_ID, tileTypes };