import { Circle } from "../util/model/Circle";

export function checkCollisions(circles) {
	const sortedCircles = [ ...circles ].sort((a, b) => a.ox - b.ox);

	const potentiallyColliding = [];

	sortedCircles.forEach((circle, i) => {
		for(let j = i + 1; j < sortedCircles.length; j++) {
			const otherCircle = sortedCircles[ j ];
			const radii = circle.radius + otherCircle.radius;

			if(Math.abs(otherCircle.ox - circle.ox) > radii) {
				break;
			} else if(Math.abs(otherCircle.oy - circle.oy) > radii) {
				break;
			}

			potentiallyColliding.push([ circle, otherCircle ]);
		}
	});

	potentiallyColliding.forEach(([ circle1, circle2 ]) => {
		if(Circle.detectCollision(circle1, circle2)) {
			console.log(`Collision detected between Circle (${ circle1.ox }, ${ circle1.oy }) and Circle (${ circle2.ox }, ${ circle2.oy })`);
		}
	});
};