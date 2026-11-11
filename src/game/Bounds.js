class Bounds {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    get minX() {
        return this.x; 
    }
    
    get minY() {
        return this.y; 
    }
    
    get maxX() {
        return this.x + this.width; 
    }
    
    get maxY() {
        return this.y + this.height; 
    }
    
    get centerX() {
        return this.x + this.width / 2; 
    }
    
    get centerY () {
        return this.y + this.height / 2;  
    }
    
    contains(b) {
        return (
            b.x >= this.x &&
            b.y >= this.y &&
            b.x + b.width <= this.x + this.width &&
            b.y + b.height <= this.y + this.height
        );
    }
    
    overlaps(b) {
        return (
            b.x < this.x + this.width &&
            b.x + b.width > this.x &&
            b.y < this.y + this.height &&
            b.y + b.height > this.y
        );
    }
    
    touches(b) {
        return (
            b.x <= this.x + this.width &&
            b.x + b.width >= this.x &&
            b.y <= this.y + this.height &&
            b.y + b.height >= this.y
        );
    }

    expand(amount) {
        this.x -= amount;
        this.y -= amount;
        this.width += amount * 2;
        this.height += amount * 2;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    translate(x, y) {
        this.x += x;
        this.y += y;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    static fromCorners(x1, y1, x2, y2) {
        return new Bounds(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2))
    }
}

export default Bounds;