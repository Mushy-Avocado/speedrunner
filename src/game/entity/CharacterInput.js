
class CharacterInput {

    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    set(left, right, up, down) {
        this.left = left;
        this.right = right;
        this.up = this.up || up;
        this.down = down;
    }

    applyCharacter(character) {
        character.isMovingLeft = this.left;
        character.isMovingRight = this.right;
        character.isQueuedJumping = this.up;
        character.isSprinting = this.down;
        this.up = false;
    }

}
export { CharacterInput };