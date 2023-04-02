export class Circle {
	constructor ({ ox, oy, radius, mass } = {}) {
		this.ox = ox;
		this.oy = oy;
		this.radius = radius;
		this.mass = mass;
	}

	static DetectCollision(c1, c2) {
		const distance = Math.sqrt((c2.ox - c1.ox) ** 2 + (c2.oy - c1.oy) ** 2);
		const sumOfRadii = c1.radius + c2.radius;

		return distance <= sumOfRadii;
	}
};

export default Circle;