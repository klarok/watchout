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

let enemies = d3.range(10).map(i => {
	return { 
		i: i,
		r: random(15, 10),
		x: random(svg[0][0].clientWidth),
		y: random(svg[0][0].clientHeight),
		fill: `rgb(${random(255)}, ${random(255)}, ${random(255)})`
	}
});

function random(max, min) {
	return (min !== undefined) ? Math.floor(Math.random() * (max - min) + min) : Math.floor(Math.random() * max);
}

function spawn(data) {
	let circle = svg.selectAll('circle')
		.data(data);

	circle = circle.enter().append('circle')
			.style('fill', d => d.fill)
			.attr('r', d => d.r)
			.attr('cx', d => d.x)
			.attr('cy', d => d.y);
}

spawn(enemies);