import { QuadTree } from "./util/QuadTree";
import { Circle } from "./util/Circle";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const maxCircles = 25;
const minSize = 10;
const maxSize = 30;
const maxVelocity = 0.25;

const quadtree = new QuadTree(0, 0, canvas.width, canvas.height, 4, 64);
let circles = new Set();

// Create initial circles
for(let i = 0; i < maxCircles; i++) {
	const x = Math.random() * canvas.width;
	const y = Math.random() * canvas.height;
	const r = Math.random() * (maxSize - minSize) + minSize;
	const vx = Math.random() * maxVelocity * 2 - maxVelocity;
	const vy = Math.random() * maxVelocity * 2 - maxVelocity;
	const circle = new Circle(x, y, r, vx, vy);
	circles.add(circle);
	quadtree.insert(circle);
}

function gameLoop() {
	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Move and draw circles
	for(const circle of circles) {
		circle.move(canvas.width, canvas.height);

		const currentNode = circle.node;
		const newNode = quadtree.getContainingNode(circle);
		if(currentNode !== newNode) {
			currentNode.remove(circle);
			newNode.insert(circle);
			circle.node = newNode;
		}

		ctx.beginPath();
		ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
		ctx.lineWidth = 1;
		ctx.strokeStyle = circle.collisions.size ? 'red' : 'green';
		ctx.stroke();
	}

	// Check for collisions
	let avgRadius = Array.from(circles).reduce((sum, circle) => sum + circle.r, 0) / circles.size;
	for(const circle of Array.from(circles)) {
		if(!circles.has(circle)) {
			continue;
		}

		const neighbors = quadtree.retrieve(circle);
		for(const neighbor of neighbors) {
			if(neighbor !== circle) {
				const dx = neighbor.x - circle.x;
				const dy = neighbor.y - circle.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if(dist < circle.r + neighbor.r) {
					const newArea = Math.PI * (circle.r * circle.r + neighbor.r * neighbor.r);
					if(circle.r >= neighbor.r) {
						circle.r = Math.sqrt(newArea / Math.PI);
						circles.delete(neighbor);
						quadtree.remove(neighbor);
					} else {
						neighbor.r = Math.sqrt(newArea / Math.PI);
						circles.delete(circle);
						quadtree.remove(circle);
					}
				}
			}
		}

		if(Math.random() < 0.0001 || circles.size < 5) {
			if(circle.r > avgRadius) {
				circles.delete(circle);
				quadtree.remove(circle);

				for(let i = 0; i < circle.r / Math.PI; i++) {					
					const x = circle.r + circle.x + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * circle.r);
					const y = circle.r + circle.y + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * circle.r);
					const r = Math.random() * 20;
					const vx = Math.random() * maxVelocity * 2 - maxVelocity * (Math.random() > 0.5 ? 1 : -1);
					const vy = Math.random() * maxVelocity * 2 - maxVelocity * (Math.random() > 0.5 ? 1 : -1);
					const c = new Circle(x, y, r, vx, vy);
					circles.add(c);
					quadtree.insert(c);
				}
			}
		}
	}

	if(Math.random() < 0.05) {
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		const r = Math.random() * (maxSize - minSize) + minSize;
		const vx = Math.random() * maxVelocity * 2 - maxVelocity;
		const vy = Math.random() * maxVelocity * 2 - maxVelocity;
		const circle = new Circle(x, y, r, vx, vy);
		circles.add(circle);
		quadtree.insert(circle);
	}

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);