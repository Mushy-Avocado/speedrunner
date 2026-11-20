import { SimpleBody } from "./SimpleBody";
import { CharacterInput } from "./CharacterInput";

class Character extends SimpleBody {
    constructor(level, x, y, width, height) {
        super(x, y, width, height);
        this.level = level;
        this.input = new CharacterInput();
    }

    isMovingLeft = false;
    isMovingRight = false;
    isQueuedJumping = false;
    isSprinting = false;

    jumpBufferTicks = Infinity;
    coyoteTicks = Infinity;

    isJumping = false;

    // Number of ticks the character can be in the air, and still jump
    coyoteTime = 0;
    // Number of ticks the character can still jump after pressing jump too early
    jumpBufferTime = 0;

    jumpHeight = 100;
    variableJumpScale = 0;
    requestedJump = false;

    horizontalAcceleration = 3000;
    horizontalDeceleration = 7;

    constGravity = this.gravity;
    apexGravityScale = 1;
    apexAccelerationScale = 1;
    apexThreshold = 100;
    airControlScale = 0.7;

    sprintScale = 2;

    getJumpForce(height) {
        return Math.sqrt(2 * this.gravity * height);
    }

    fixedUpdate(deltaTime) {
        this.input.applyCharacter(this);
        
        if (this.isSprinting) {
            if (!this.appliedSprint) {
                this.horizontalAcceleration *= this.sprintScale;
            }
            this.appliedSprint = true;
        } else if (this.appliedSprint) {
            this.appliedSprint = false;
            this.horizontalAcceleration /= this.sprintScale;
        }

        this.coyoteTicks++;
        this.jumpBufferTicks++;
        if (this.isGrounded) {
            this.coyoteTicks = 0;
        }
        if (this.isQueuedJumping && !this.isJumping && !this.requestedJump) {
            this.requestedJump = true;
            this.jumpBufferTicks = 0;
        } 
        if (!this.isQueuedJumping) {
            this.requestedJump = false;
        }

        let horizontalAcceleration = this.horizontalAcceleration;
        let horizontalDeceleration = this.horizontalDeceleration;
        this.gravity = this.constGravity;
        if (this.coyoteTicks <= this.coyoteTime && this.jumpBufferTicks <= this.jumpBufferTime) {
            const force = this.getJumpForce(this.jumpHeight) * (1 - this.variableJumpScale);
            this.velocityY = -force;
            this.coyoteTicks = Infinity;
            this.jumpBufferTicks = Infinity;
            this.isJumping = true;
        }
        if (this.isJumping) {
            if (this.velocityY < 0) {
                const jumpHoldGravityScale = this.isQueuedJumping ? (1 - this.variableJumpScale) ** 2 : 1;
                this.velocityY -= this.gravity * (1 - jumpHoldGravityScale) * deltaTime;
            }
            if (Math.abs(this.velocityY) < this.apexThreshold) {
                this.gravity = this.constGravity * this.apexGravityScale;
                horizontalAcceleration *= this.apexAccelerationScale;
            } 
            else if (this.velocityY > 0) {
                this.isJumping = false;
            }
        }
        if (!this.isGrounded) {
            horizontalAcceleration *= this.airControlScale;
            horizontalDeceleration *= this.airControlScale;
        }

        const moveDirection = Number(this.isMovingRight) - Number(this.isMovingLeft);
        this.velocityX += moveDirection * horizontalAcceleration * deltaTime;
        this.applyFriction(this.horizontalDeceleration * deltaTime, 0);

        if (!this.isJumping) {
            this.applyFriction(0, 2 * deltaTime);
        }

        super.fixedUpdate(deltaTime, this.level);
    }

}

export { Character };