import { v4 as uuid } from "uuid";

export class Circle {
	constructor (x, y, r, vx, vy) {
		this.id = uuid();
		this.x = x;
		this.y = y;
		this.r = r;
		this.vx = vx;
		this.vy = vy;
		this.graphics = null;
		this.node = null;
	}

	move(maxX, maxY) {
		this.x += this.vx;
		this.y += this.vy;

		if(this.x - this.r < 0) {
			this.x = this.r;
			this.vx = -this.vx;
		} else if(this.x + this.r > maxX) {
			this.x = maxX - this.r;
			this.vx = -this.vx;
		}

		if(this.y - this.r < 0) {
			this.y = this.r;
			this.vy = -this.vy;
		} else if(this.y + this.r > maxY) {
			this.y = maxY - this.r;
			this.vy = -this.vy;
		}
	}
};

export default Circle;