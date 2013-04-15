var Game = (function () {
	
	var canvas
	  , body
	  , ctx
	  , snake
	  , INTERVAL
	  , animationScope = []
	
	function init () {
		updateVars();
		bindEvents();

		start();
	}

	function bindEvents () {
		body.addEventListener('keydown', keysAction);
	}

	function updateVars () {
		canvas = document.getElementById('game');
		body = document.getElementsByTagName('body')[0];
		ctx = canvas.getContext('2d');
	}

	function start () {
		addSnake();
		addFood();
		draw();
	}

	function addFood () {
		var x = getRandomInt(0, canvas.width)
		  , y = getRandomInt(0, canvas.height)
		  , lvl = getRandomInt(0, 3)
		  , food = new Food(x,y,lvl,ctx);

		addAnimation( food );
	}

	function addSnake () {
		snake = new Snake({x:10,y:10}, ctx);
		addAnimation( snake );
	}

	function draw () {
		INTERVAL = setInterval(function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			animationScope.forEach(function (obj) {
				obj.draw();
			});

		}, 1000/10);
	}

	function addAnimation (obj) {
		return animationScope.push( obj );
	}

	function end () {
		clearInterval( INTERVAL );
		console.log('score: 10');
	}

	function keysAction (e) {
		var key = e.keyCode;
		
		switch(key){
			case 87:
				snake.changeDirection('up');
				break;
			case 83:
				snake.changeDirection('down');
				break;
			case 68:
				snake.changeDirection('right');
				break;
			case 65:
				snake.changeDirection('left');
				break;
			default:
				break;
		}
	}

	return{
		  init: init
		, end: end
		, addAnimation: addAnimation
	}
})();



var Snake = function (coords,ctx) {
	
	var coords = coords
	  , ctx = ctx

	  , bodySlice = 1
	  , direction = 'right'
	  , w = 10
	  , h = 10

	  , bodys = []
	  , head

	function init () {
		for (var i = 1; i <= 3; i++) {
			bodys.push({
				coords: {x: coords.x+w*i, y: coords.y},
				color: '#222'
			});
		}

		head = bodys[bodys.length-1];
	}

	function draw () {
		bodys.forEach(function (body) {
			ctx.fillRect(body.coords.x,body.coords.y,w-1,h-1);
		});
		move(direction);
	}

	function checkBounds (x,y) {
		if (   x < 0 || x+w > 400
			|| y < 0 || y+h > 400 ) {
			Game.end();
			return false;
		}
		return true;
	}

	function changeDirection (d) {
		if (   direction === 'up' && d === 'down'
			|| direction === 'down' && d === 'up'
			|| direction === 'right' && d === 'left'
			|| direction === 'left' && d === 'right') {

			return false;
		}

		direction = d;
	}

	function move (direction) {
		switch(direction){
			case 'right':
				addBody(w,0);
				break;
			case 'down':
				addBody(0,h);
				break;
			case 'left':
				addBody(-w,0);
				break;
			case 'up':
				addBody(0,-h);
				break;
		}
		checkBounds(head.coords.x, head.coords.y);
	}

	function addBody (w,h) {
		var coords = head.coords; 
		bodys.push({
			coords: {x: coords.x+w, y: coords.y+h},
			color: '#222'
		})
		bodys.shift();

		head = bodys[bodys.length-1]

		return {
			x: coords.x+w,
			y: coords.y+h
		}
	}

	init();

	return{  
		  draw: draw
		, changeDirection: changeDirection
	}
}


var Food = function (x,y,lvl,ctx) {
	
	function draw () {
		ctx.strokeRect(x,y,10,10);
	}

	return{
		draw: draw
	}

}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

Game.init();