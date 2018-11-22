// start slingin' some d3 here.
let dimensions = {
	width: 600,
	height:500
};

let board = d3.select('.board')
		.style('background-color', '#b297eb');

let svg = board.append('svg')
		.attr('width', dimensions.width)
		.attr('height', dimensions.height)
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


/////// PLAYER ////////////////////////////////////////

let playerData = [{
	width: 20,
	height: 20,
	fill: 'black',
	stroke: 'red'
}];

let place = function(data) {
	return svg.selectAll('rect')
		.data(data)
		.enter().append('rect')
			.classed('player', true)
			.attr('width', d => d.width)
			.attr('height', d => d.height)
			.style('fill', d => d.fill)
			.attr('x', 100)
			.attr('y', 100)
			.call(d3.drag()
					.on('start', dragStarted)
					.on('drag', dragged)
					.on('end', dragEnded));
};

function dragStarted(d) {
	d3.select(this).classed('active', true);
	console.log('started dragging');
}
function dragged(d) {
	d3.select(this)
		.attr('x', d.x = d3.event.x)
		.attr('y', d.y = d3.event.y);
	console.log('dragging');
}
function dragEnded(d) {
	d3.select(this).classed('active', false);
}


/////// HELPERS ///////////////////////////////////////

let random = function(max, min) {
	return (min !== undefined) ? Math.floor(Math.random() * (max - min) + min) : Math.floor(Math.random() * max);
}
let randomColor = function(max = 255, min) {
	return `rgb(${random(255, min)}, ${random(255, min)}, ${random(255, min)})`;
}


/////// MAIN ///////////////////////////////////////

let enemyData = generateEnemyData(30);
// let enemies = spawn(enemyData);
let player = place(playerData);
// setInterval(() => mobilize(enemies), 1000);
// let scoreTimer = d3.timer(function(elapsed) {
// 	d3.select('.current span')
// 		.text(elapsed);
// }, 100)