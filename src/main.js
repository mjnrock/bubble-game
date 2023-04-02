import Helper from "./lib/util/helper";

import { Position } from "./lib/components/Position";

const position = Position.Factory({ x: 10, y: 20 }, 1);

console.log(position);
console.log(position.pos());
console.log(position.pos(true));

console.log(position.next({ z: 100, y: 200 }));
console.log({ ...position, z: 100, y: 200 });
console.log(Position.Factory({ z: 100, y: 200 }));
console.log(Position.Factory({ x: 3, y: 4 }).distance([ 4, 6 ]));