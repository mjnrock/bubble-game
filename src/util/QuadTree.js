export class QuadTree {
	constructor (x, y, w, h, maxObjects, minSize) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.maxObjects = maxObjects;
		this.minSize = minSize;
		this.objects = [];
		this.nodes = [];
	}


	insert(obj) {
		if(this.nodes.length > 0) {
			const index = this.getIndex(obj);
			if(index !== -1) {
				this.nodes[ index ].insert(obj);
				return;
			}
		}

		this.objects.push(obj);

		if(this.objects.length > this.maxObjects && this.nodes.length === 0 && this.w > this.minSize && this.h > this.minSize) {
			this.divide();
			for(const obj of this.objects) {
				const index = this.getIndex(obj);
				if(index !== -1) {
					this.nodes[ index ].insert(obj);
				}
			}
			this.objects = [];
		}

		obj.node = this.getContainingNode(obj);
	}

	remove(obj) {
		const index = this.objects.indexOf(obj);
		if(index !== -1) {
			this.objects.splice(index, 1);
		} else {
			for(const node of this.nodes) {
				node.remove(obj);
			}
		}

		// Merge children nodes if possible
		if(this.nodes.every(node => node.objects.length === 0) && this.objects.length <= this.maxObjects) {
			this.nodes = [];
		}

		obj.node = null;
	}

	getIndex(obj) {
		const horzMid = this.x + this.w / 2;
		const vertMid = this.y + this.h / 2;
		const top = obj.y - obj.r < vertMid && obj.y + obj.r < vertMid;
		const bottom = obj.y - obj.r > vertMid;
		const left = obj.x - obj.r < horzMid && obj.x + obj.r < horzMid;
		const right = obj.x - obj.r > horzMid;

		if(top) {
			if(left) return 0;
			else if(right) return 1;
		} else if(bottom) {
			if(left) return 2;
			else if(right) return 3;
		}

		return -1;
	}

	divide() {
		const halfW = this.w / 2;
		const halfH = this.h / 2;

		this.nodes.push(new QuadTree(this.x, this.y, halfW, halfH, this.maxObjects, this.minSize));
		this.nodes.push(new QuadTree(this.x + halfW, this.y, halfW, halfH, this.maxObjects, this.minSize));
		this.nodes.push(new QuadTree(this.x, this.y + halfH, halfW, halfH, this.maxObjects, this.minSize));
		this.nodes.push(new QuadTree(this.x + halfW, this.y + halfH, halfW, halfH, this.maxObjects, this.minSize));
	}

	retrieve(obj) {
		const index = this.getIndex(obj);
		const objects = [ ...this.objects ];

		if(index !== -1 && this.nodes.length > 0) {
			objects.push(...this.nodes[ index ].retrieve(obj));
		} else {
			objects.push(...this.objects);
			for(const node of this.nodes) {
				objects.push(...node.retrieve(obj));
			}
		}

		return objects;
	}

	getContainingNode(obj) {
		if(this.nodes.length > 0) {
			const index = this.getIndex(obj);
			if(index !== -1) {
				return this.nodes[ index ].getContainingNode(obj);
			}
		}

		return this;
	}

};

export default QuadTree;