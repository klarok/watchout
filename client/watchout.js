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
			fill: '#defb90'//randomColor(undefined, 70)
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
			.duration(2000)
			.attr('cx', () => random(svg[0][0].clientWidth))
			.attr('cy', () => random(svg[0][0].clientHeight))
			.tween('collision', (datum, index) => {
				let enemy = selection.filter((d, i) => i === index);
				return () => detectCollision(enemy);
			});
}

function detectCollision(enemy) { //Custom tween to check for collisions
	let radii = parseInt(enemy.attr('r')) + parseInt(player.attr('r'));
	let xDiff = enemy.attr('cx') - player.attr('cx');
	let yDiff = enemy.attr('cy') - player.attr('cy');
	let distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
	if (radii > distance) {
		processCollision();
	}
}

function processCollision() {
	let high = d3.select('.highscore span');
	let curr = d3.select('.current span');
	let cols = d3.select('.collisions span');
	high.text(Math.max(parseInt(high.text()), parseInt(curr.text())));
	cols.text(parseInt(cols.text()) + 1);
	setScoreTimer();
}


/////// PLAYER ////////////////////////////////////////

let playerData = [{
	radius: 12,
	fill: '#f7a000',
	stroke: '#af4500'
}];

let place = function(data) {
	return svg.selectAll('.player')
		.data(data)
		.enter().append('circle')
			.classed('player', true)
			.attr('r', d => d.radius)
			.style('fill', d => d.fill)
			.style('stroke', d => d.stroke)
			.attr('cx', 300)
			.attr('cy', 250)
			.call(drag);
};

let drag = d3.behavior.drag()
		.on('drag', dragMove);

function dragMove(d) { 
	//Keep player from falling off the board
	let p = d3.select(this);
	//d3.select(this)
	let dxMax = dimensions.width - p.attr('cx');
	let dyMax = dimensions.height - p.attr('cy');
	p
			// .attr('cx', d.x = Math.min(d3.event.x, dxMax))
			// .attr('cy', d.y = Math.min(d3.event.y, dyMax));
			.attr('cx', d.x = d3.event.x)
			.attr('cy', d.y = d3.event.y);
}

/////// HELPERS ///////////////////////////////////////

let random = function(max, min) {
	return (min !== undefined) ? Math.floor(Math.random() * (max - min) + min) : Math.floor(Math.random() * max);
}
let randomColor = function(max = 255, min) {
	return `rgb(${random(255, min)}, ${random(255, min)}, ${random(255, min)})`;
}


/////// SCORING ///////////////////////////////////////

function setScoreTimer() {
	let curr = d3.select('.current span');
	if (scoreTimer !== null) {
		clearInterval(scoreTimer);
		score = 0;	
		curr.text(score);
	}
	scoreTimer = setInterval(() => {
		score += 1;
		curr.text(score);
	}, 500);

}


/////// MAIN ///////////////////////////////////////

let enemyData = generateEnemyData(1);
let enemies = spawn(enemyData);
let player = place(playerData);
setInterval(() => mobilize(enemies), 1000);

let score = 0;
let scoreTimer = null;
setScoreTimer();