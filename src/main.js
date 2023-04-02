import * as PIXI from "pixi.js";

import { QuadTree } from "./util/QuadTree";
import { Circle } from "./util/Circle";

// Create a new PIXI.js application with a canvas element
const app = new PIXI.Application({
	width: window.innerWidth * 0.9,
	height: window.innerHeight * 0.9,
	antialias: true,
	transparent: false,
	resolution: 1,
	backgroundColor: 0xffffff,
});

// Add the PIXI.js canvas to the DOM
document.body.appendChild(app.view);

// Create a new PIXI.js container for the circles
const circleContainer = new PIXI.Container();
app.stage.addChild(circleContainer);

app.start();

// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

const maxCircles = 25;
const minSize = 10;
const maxSize = 30;
const maxVelocity = 0.25;

const quadtree = new QuadTree(0, 0, app.renderer.width, app.renderer.height, 4, 64);
let circles = new Set();

// Create initial circles
for(let i = 0; i < maxCircles; i++) {
	const x = Math.random() * app.renderer.width;
	const y = Math.random() * app.renderer.height;
	const r = Math.random() * (maxSize - minSize) + minSize;
	const vx = Math.random() * maxVelocity * 2 - maxVelocity;
	const vy = Math.random() * maxVelocity * 2 - maxVelocity;
	const circle = new Circle(x, y, r, vx, vy);
	circles.add(circle);
	quadtree.insert(circle);
}

function gameLoop() {
	// Clear canvas
	// app.renderer.clear();

	// Move and draw circles
	circles.forEach(circle => {
		circle.move(app.renderer.width, app.renderer.height);

		const currentNode = circle.node;
		const newNode = quadtree.getContainingNode(circle);
		if(currentNode !== newNode) {
			currentNode.remove(circle);
			newNode.insert(circle);
			circle.node = newNode;
		}

		if(!circle.graphics) {
			// Create a new graphics object for the circle
			circle.graphics = new PIXI.Graphics();
			circle.graphics.lineStyle(1, 0x000);
			circle.graphics.drawCircle(~~circle.x, ~~circle.y, ~~circle.r);
			circle.graphics.endFill();
			circleContainer.addChild(circle.graphics);
		} else {
			// Reuse the existing graphics object
			circle.graphics.clear();
			circle.graphics.lineStyle(1, 0x000);
			circle.graphics.drawCircle(~~circle.x, ~~circle.y, ~~circle.r);
			circle.graphics.endFill();
		}
	});
	
	// // Clear canvas
	// ctx.clearRect(0, 0, app.renderer.width, app.renderer.height);

	// // Move and draw circles
	// for(const circle of circles) {
	// 	circle.move(app.renderer.width, app.renderer.height);

	// 	const currentNode = circle.node;
	// 	const newNode = quadtree.getContainingNode(circle);
	// 	if(currentNode !== newNode) {
	// 		currentNode.remove(circle);
	// 		newNode.insert(circle);
	// 		circle.node = newNode;
	// 	}

	// 	ctx.beginPath();
	// 	ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
	// 	ctx.lineWidth = 1;
	// 	ctx.strokeStyle = circle.collisions.size ? 'red' : 'green';
	// 	ctx.stroke();
	// }

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
						circleContainer.removeChild(neighbor.graphics);
					} else {
						neighbor.r = Math.sqrt(newArea / Math.PI);
						circles.delete(circle);
						quadtree.remove(circle);
						circleContainer.removeChild(circle.graphics);
					}
				}
			}
		}


		if(Math.random() < 0.0001 || circle.r > 250) {
			circles.delete(circle);
			quadtree.remove(circle);
			circleContainer.removeChild(circle.graphics);
			const totalArea = Math.PI * circle.r * circle.r;
			const numBubbles = Math.floor(Math.floor(totalArea / (avgRadius * avgRadius)), 25);
			const explodingMass = circle.r * circle.r;
			const surroundingMass = totalArea - explodingMass;
			const explosionForce = (explodingMass * maxVelocity) / surroundingMass;

			let totalMomentumX = 0;
			let totalMomentumY = 0;

			for(let i = 0; i < numBubbles; i++) {
				const r = Math.random() * avgRadius / 2;
				const m = r * r;
				const angle = Math.random() * Math.PI * 2;
				const distanceFromCenter = Math.random() * circle.r;
				const x = circle.x + distanceFromCenter * Math.cos(angle);
				const y = circle.y + distanceFromCenter * Math.sin(angle);
				const vx = explosionForce * Math.cos(angle) * 10;
				const vy = explosionForce * Math.sin(angle) * 10;
				const c = new Circle(x, y, r, vx, vy);
				circles.add(c);
				quadtree.insert(c);
				totalMomentumX += vx * m;
				totalMomentumY += vy * m;
			}
		}
	}

	if(Math.random() < 0.001) {
		// Pick a random spot on the canvas
		const x = Math.random() * app.renderer.width;
		const y = Math.random() * app.renderer.height;

		// Spawn between 1 and 10 bubbles
		const numBubbles = Math.floor(Math.random() * 10) + 1;

		let totalMomentumX = 0;
		let totalMomentumY = 0;

		for(let i = 0; i < numBubbles; i++) {
			const r = Math.random() * avgRadius / 2;
			const m = r * r;
			const angle = Math.random() * Math.PI * 2;
			const distanceFromCenter = Math.random() * (app.renderer.width / 2 - r);
			const bx = x + distanceFromCenter * Math.cos(angle);
			const by = y + distanceFromCenter * Math.sin(angle);
			const vx = (bx - x) / distanceFromCenter * maxVelocity;
			const vy = (by - y) / distanceFromCenter * maxVelocity;
			const c = new Circle(bx, by, r, vx, vy);
			circles.add(c);
			quadtree.insert(c);
			c.graphics = new PIXI.Graphics();
			c.graphics.lineStyle(1, 0x000);
			c.graphics.drawCircle(~~c.x, ~~c.y, ~~c.r);
			circleContainer.addChild(c.graphics);
			totalMomentumX += m * vx;
			totalMomentumY += m * vy;
		}
	}

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);