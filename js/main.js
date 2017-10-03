var width, height;
var renderer;
function initThree() {
// 	Get width and height of the frame "canvas-frame"
	width = document.getElementById('canvas-frame').clientWidth;
	height = document.getElementById('canvas-frame').clientHeight;
// 	Generate renderer object
	renderer = new THREE.WebGLRenderer({antialias: true});
// 	Set width and height of the renderer
	renderer.setSize(width, height);
// 	Get properties of the frame "canvas-frame" with DOM
// 	We can get and set properties of the object we select by its id with DOM API
	document.getElementById('canvas-frame').appendChild(renderer.domElement);
// 	Set clear color of the renderer
	renderer.setClearColor(0xFFFFFF, 1.0);
}

var camera;
function initCamera() {
// 	Set camera with perspective method
// 	PerspectiveCamera( fov, aspect, near, far )
	camera = new THREE.PerspectiveCamera( 45, width/height, 1, 10000 );
// 	Set the camera position
// 	camera.position.set( new THREE.Vector3( 100, 20, 50 ) );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 800;
// 	Set the direction of the camera
	camera.up.x = 0;
	camera.up.y = 1;
	camera.up.z = 0;
// 	Set the direction in which the camera looks at
	camera.lookAt({x:0, y:0, z:0});
}

// Scene : the 3-dimensional virtual space
var scene;
function initScene() {
	scene = new THREE.Scene();
}

var light;
function initLight() {
// 	Set the light source
	light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
// 	Set the vector of light
	light.position.set( 100, 100, 200 );
// 	Add the light source object to the scene object
	scene.add(light);
}

// var cube;
// function initObject() {
// 	cube = new THREE.Mesh(
// 		new THREE.CubeGeometry(50, 50, 50),
// 		new THREE.MeshLambertMaterial({color:0xFF0000})
// 	);
// 	scene.add(cube);
// 	cube.position.set(0,0,0);
// }

var axis;
var grid;
function initObject() {
// 	axis = new THREE.AxisHelper(50);
// 	scene.add(axis);

// 	grid = new THREE.GridHelper(800,40);
// 	scene.add(grid);
// 	grid.rotation.set(Math.PI/2, 0, 0);
	initArrow();
}

var colLength = 50;
var rowLength = 50;
var spin = new Array();
function initSpin() {
	var mt = new MersenneTwister();
	for (var col = 0; col < colLength; ++col) {
		spin[col] = new Array();
		for (var row = 0; row < rowLength; ++row) {
			spin[col][row] = 2*Math.PI*mt.next();
		}
	}
}

// coupleCoeff = 1;
// var invTemp = 0;
var invTemp = 10000;
function step() {
	var tmpSpin = new Array();
	col = 2, row = 2;
	for (var col = 0; col < colLength; ++col) {
		tmpSpin[col] = new Array();
		for (var row = 0; row < rowLength; ++row) {
			var cosTerm =
				Math.cos( spin[col][(rowLength+row-1)%rowLength] )
				+ Math.cos( spin[col][(rowLength+row+1)%rowLength] )
				+ Math.cos( spin[(colLength+col-1)%colLength][row] )
				+ Math.cos( spin[(colLength+col+1)%colLength][row] );
			var sinTerm =
				Math.sin( spin[col][(rowLength+row-1)%rowLength] )
				+ Math.sin( spin[col][(rowLength+row+1)%rowLength] )
				+ Math.sin( spin[(colLength+col-1)%colLength][row] )
				+ Math.sin( spin[(colLength+col+1)%colLength][row] );

			var R = Math.sqrt( cosTerm*cosTerm+sinTerm*sinTerm );
			var alpha = Math.atan( sinTerm/cosTerm );

			// 	Neumann method
			var mt = new MersenneTwister();
			var X = (2*mt.next()-1)*Math.PI;
			var Y = mt.next();
			var prob = Math.exp( invTemp*R*Math.cos(X));
			while ( Y > prob ) {
				X = (2*mt.next()-1)*Math.PI;
				prob = Math.exp( invTemp*R*Math.cos(X));
			}

			var sigma = X + alpha;

			tmpSpin[col][row] = sigma;

		}
	}

	for (var col = 0; col < colLength; ++col) {
		for (var row = 0; row < rowLength; ++row) {
			spin[col][row] = tmpSpin[col][row];
		}
	}
}

var arrow = Array();
function initArrow() {
	for (var col = 0; col < colLength; ++col) {
		arrow[col] = new Array();
		for (var row = 0; row < rowLength; ++row) {
			var from = new THREE.Vector3( 0, 0, 0 );
			var to = new THREE.Vector3( 10, 0, 0 );
// 			var to = new THREE.Vector3( 10*Math.cos( spin[col][row] ), 10*Math.sin( spin[col][row] ), 0 );
			var direction = to.clone().sub(from);
			var length = direction.length();
			var headLength = 15;
			var headWidth = 10;
			arrow[col][row] = new THREE.ArrowHelper( direction.normalize(), from, length, 0xff0000, headLength, headWidth );
			scene.add( arrow[col][row] );
			arrow[col][row].position.set(20*(row-0.5*(rowLength-1)), 20*(col-0.5*(colLength-1)), 0);
			arrow[col][row].rotation.set(0, 0, spin[col][row]);
		}
	}
}

function drawArrow() {
	for (var col = 0; col < colLength; ++col) {
		for (var row = 0; row < rowLength; ++row) {
			arrow[col][row].rotation.set(0, 0, spin[col][row]);
// 			var from = new THREE.Vector3( 0, 0, 0 );
// 			var to = new THREE.Vector3( 10*Math.cos( spin[col][row] ), 10*Math.sin( spin[col][row] ), 0 );
// 			var direction = to.clone().sub(from);
// 			var length = direction.length();
// 			var headLength = 5;
// 			var headWidth = 5;
// 			arrow[col][row] = new THREE.ArrowHelper( direction.normalize(), from, length, 0xff0000, headLength, headWidth );
// 			scene.add( arrow[col][row] );
// 			arrow[col][row].position.set(20*(row-0.5*(rowLength-1)), 20*(col-0.5*(colLength-1)), 0);
		}
	}
}

// function drawArrow(sx, sy, sz, ex, ey, ez) {
// 	var from = new THREE.Vector3( sx, sy, sz );
// 	var to = new THREE.Vector3( ex, ey, ez );
// 	var direction = to.clone().sub(from);
// 	var length = direction.length();
// 	var arrowHelper = new THREE.ArrowHelper( direction.normalize(), from, length, 0xff0000 );
// 	scene.add( arrowHelper );
// }

var down = false;
var sx = 0, sy = 0;
window.onmousedown = function (ev) {
	if (ev.target == renderer.domElement) {
		down = true;
		sx = ev.clientX;
		sy = ev.clientY;
	}
};
window.onmouseup = function () {
	down = false;
};
// window.onmousemove = function (ev) {
// 	var speed = 2;
// 	if (down) {
// 		if (ev.target == renderer.domElement) {
// 			var dx = -(ev.clientX - sx);
// 			var dy = -(ev.clientY - sy);
// 			camera.position.x += dx*speed;
// 			camera.position.y -= dy*speed;
// 			sx -= dx;
// 			sy -= dy;
// 		}
// 	}
// }
window.onmousewheel = function (ev) {
	var speed = 0.2;
	camera.position.z += ev.wheelDelta * speed;
}

var isStop = false;
window.onkeydown = function (ev) {
	if (ev.keyCode == 32) {
		switch (isStop) {
			case false:
				isStop = true;
				break;
			case true:
				isStop = false;
		}
// 		alert("Pushed space key");
	}
}

var time = 0;
function loop() {
	time++;

	if (isStop == false) {
		step();
	}

	drawArrow();

	renderer.clear();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
}

function threeStart() {
	initThree();
	initCamera();
	initScene();
	initLight();
	initSpin();
	initObject();

	loop();
// 	renderer.clear();
// 	renderer.render(scene, camera);
}

