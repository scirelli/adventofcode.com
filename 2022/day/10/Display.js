module.exports = class Display{
    constructor(width = 40, height = 6) {
        this.width = width;
        this.height = height;
        this.pixels = [];
        this.clear();
    }

    clear() {
        this.pixels = new Array(this.width * this.height).fill('.');
        return this;
    }

    toIndex(x, y) {
        return x + y*(this.width);
    }

    setPixel(x, y, c='#') {
        this.pixels[this.toIndex(x, y)] = c;
        return this;
    }

    setPixelAt(i, c='#') {
        this.pixels[i] = c;
        return this;
    }

    getPixel(x, y) {
        return this.pixels[this.toIndex(x, y)];
    }

    toString() {
        let s = [];
        for(let y=0; y<this.height; y++) {
            let r = '';
            for(let x=0; x<this.width; x++) {
                r += this.getPixel(x, y);
            }
            s.push(r);
        }
        return s.join('\n');
    }
};
