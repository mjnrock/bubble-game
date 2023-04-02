import { System } from "./lib/ecs/System";
import { Entity } from "./lib/ecs/Entity";
import { Component } from "./lib/ecs/Component";
import { Registry } from "./lib/ecs/Registry";

let comp = Component.Factory({ $name: "foo", cats: 3 });

// let ent = Entity.Factory({ comp });
let ent = Entity.Factory([
	Component.Factory({ $name: "foo", cats: 3 })
]);
ent.$watch((id, name, current, previous) => {
	console.log("watch", id, name, current, previous);
});
console.log(ent)

console.log(comp instanceof Component);
console.log(ent instanceof Entity);
console.log(comp.cats);

ent[ comp.$name ] = Component.Factory({
	...ent[ comp.$name ],
	cats: ent[ comp.$name ].cats * 2,
}, 1);

console.log(comp);
console.log({
	...ent[ comp.$name ],
	cats: ent[ comp.$name ].cats * 2,
});