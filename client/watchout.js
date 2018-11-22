// start slingin' some d3 here.
let dimensions = {
	width: 500,
	height:400
};

let board = d3.select('.board')
		.style('width', 400)
		.style('background-color', '#f297eb');

let svg = board.append('svg')
		.attr('width', 500)
		.attr('height', 400)
		.style('background-color', '#fff');


/////// ENEMIES ///////////////////////////////////////

let generateEnemyData = function(num) {
	return d3.range(num).map(i => {
		return { 
			i: i,
			r: random(15, 10),
			fill: randomColor(undefined, 70)
		}
	});
};

let spawn = function(data) {
	let circle = svg.selectAll('circle')
		.data(data);

	circle = circle.enter().append('circle')
			.classed('enemy', true)
			.attr('fill', d => d.fill)
			.attr('r', d => d.r);
	circle.each(function() {
		generateLocation(d3.select(this));
	});

	return circle;
}

let generateLocation = function(selection) {
	let x = [svg[0][0].clientWidth - selection.attr('r'), selection.attr('r')];
	let y = [svg[0][0].clientHeight - selection.attr('r'), selection.attr('r')];
	selection
			.attr('cx', random(x[0], x[1]))
			.attr('cy', random(y[0], y[1]));
}

//TODO: keep enemies from falling off the board
let mobilize = function(selection) {
	selection
		.transition()
			.duration(1000)
			.attr('cx', () => random(svg[0][0].clientWidth))
			.attr('cy', () => random(svg[0][0].clientHeight));
}

/////// HELPERS ///////////////////////////////////////

let random = function(max, min) {
	return (min !== undefined) ? Math.floor(Math.random() * (max - min) + min) : Math.floor(Math.random() * max);
}
let randomColor = function(max = 255, min) {
	return `rgb(${random(255, min)}, ${random(255, min)}, ${random(255, min)})`;
}


/////// MAIN ///////////////////////////////////////

let enemyData = generateEnemyData(10);
let enemies = spawn(enemyData);
setInterval(() => mobilize(enemies), 1000);