
class CharacterInput {

    constructor() {
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    set(left, right, up) {
        this.left = left;
        this.right = right;
        this.up = this.up || up;
    }

    applyCharacter(character) {
        character.isMovingLeft = this.left;
        character.isMovingRight = this.right;
        if (this.up && character.isGrounded) {
            character.isQueuedJumping = true;
        }
        this.up = false;
    }

}
export { CharacterInput };