import { Position } from "./lib/components/Position";

const position = Position.Factory({ x: 10, y: 20 }, 1);

console.log(position);
console.log(position.pos());
console.log(position.pos(true));