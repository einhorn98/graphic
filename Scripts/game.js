


// ------------------------------------- //
//---------------- Marzieh Omidi  --------------//
//---------------- Alireza Ebrahimian --------------//
//---------------- Erfan sahaf nejad --------------//


// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 400, fieldHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// ball variables
var ball, paddle1, paddle2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// game-related variables
var score1 = 0, score2 = 0;
// score
var maxScore = 5;

var soundX, soundY, soundZ;


// ------- GAME FUNCTIONS -------------- //


function setup()
{
	// update the winer
	document.getElementById("winnerBoard").innerHTML = "Who can get  score " + maxScore + " wins!";
	
	//  reset game
	score1 = 0;
	score2 = 0;
	
	// again
	createScene();

	

	defaultBallScale = ball.scale;
	
	// and let's get cracking!
	draw();
}

function createScene()
{
	// set the scene size
	var WIDTH = 800,
	  HEIGHT = 450;

	// set some camera attributes
	var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.8,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// create a WebGL renderer, camera and a scene
	
	renderer = new THREE.WebGLRenderer();
	camera =
	new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);
	
	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 320;
	
	
	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane 
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// create the paddle2's material
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xe60909
		});
	// create the plane's material	
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xec8a51
		});
	// create the table's material
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x9036da
		});
	// create the pillar's material
	var pillarMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x0edd7c
		});
	// create the ground's material
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x51ec73
		});
		
		
	// create the playing surface plane
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);
	  
	scene.add(plane);
	plane.receiveShadow = true;	
	
	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,	// this creates the feel of a billiards table, with a lining
		planeHeight * 1.03,
		100,				// an arbitrary depth, the camera can't see much of it anyway
		planeQuality,
		planeQuality,
		1),

	  tableMaterial);
	table.position.z = -51;	// we sink the table into the ground by 50 units. The extra 1 is so the plane can be seen
	scene.add(table);
	table.receiveShadow = true;	
		
	// // set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var radius = 10,
		segments = 6,
		rings = 6;
		
	// // create the sphere's material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xdb3e3e
		});
		
	// Create a ball with sphere geometry
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// // add the sphere to the scene
	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	// set ball above the table surface
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	// // set up the paddle vars
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// // add the sphere to the scene
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;
	
	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);
	  
	// // add the sphere to the scene
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	
	// set paddles on each side of the table
	paddle1.position.x = -fieldWidth/2 + paddleWidth;
	paddle2.position.x = fieldWidth/2 - paddleWidth;
	
	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
		

	// finally we finish by adding a ground plane
	// to show off pretty shadows
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry( 
	  1000, 
	  1000, 
	  3, 
	  1, 
	  1,
	  1 ),

	  groundMaterial);
    // set ground to arbitrary z position to best show off shadowing
	ground.position.z = -5;

	scene.add(ground);		
		
	// // create a point light
	pointLight =
	  new THREE.PointLight(0xF8D898);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);
		
	// add a spot light
	// this is important for casting shadows
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// draw THREE.JS scene
	renderer.render(scene, camera);
	// loop draw function call
	requestAnimationFrame(draw);
	
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
}

function ballPhysics()
{
	// if ball goes off the 'left' side (Player's side)
	if (ball.position.x <= -fieldWidth/2)
	{	
		// Player2 scores
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(2);
		matchScoreCheck();	
	}
	
	// if ball goes off the 'right' side 
	if (ball.position.x >= fieldWidth/2)
	{	
		// Player1 scores
		score1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset ball to center
		resetBall(1);
		matchScoreCheck();	
	}
	
	// if ball goes off the top side (side of table)
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	// if ball goes off the bottom side (side of table)
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	// update ball position over time
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// limit ball's y-speed to 2x the x-speed
	// this is so the ball doesn't speed from left to right super fast
	// keeps game playable for humans
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// Handles player2 paddle movement 
function opponentPaddleMovement()
{
	// move left
	if (Key.isDown(Key.O))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle2.position.y < fieldHeight * 0.45)
		{
			paddle2DirY = paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle2DirY = 0;
			paddle2.scale.x += (10 - paddle2.scale.x) * 0.2;
		}
	}	
	// move right
	else if (Key.isDown(Key.L))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle2.position.y > -fieldHeight * 0.45)
		{
			paddle2DirY = -paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle2DirY = 0;
			paddle2.scale.x += (10 - paddle2.scale.x) * 0.2;
		}
	}
	// else don't move paddle
	else
	{
		// stop the paddle
		paddle2DirY = 0;
	}
	
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
	paddle2.scale.x += (1 - paddle2.scale.x) * 0.2;	
	paddle2.position.y += paddle2DirY;
	
}


// Handles player1 paddle movement
function playerPaddleMovement()
{
	// move left
	if (Key.isDown(Key.W))		
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
			paddle1.scale.x += (10 - paddle1.scale.x) * 0.2;
		}
	}	
	// move right
	else if (Key.isDown(Key.S))
	{
		// if paddle is not touching the side of table
		// we move
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		// else we don't move and stretch the paddle
		// to indicate we can't move
		else
		{
			paddle1DirY = 0;
			paddle1.scale.x += (10 - paddle1.scale.x) * 0.2;
		}
	}
	// else don't move paddle
	else
	{
		// stop the paddle
		paddle1DirY = 0;
	}
	
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
	paddle1.scale.x += (1 - paddle1.scale.x) * 0.2;	
	paddle1.position.y += paddle1DirY;
}

// Handles camera and lighting logic
function cameraPhysics()
{
	// we can easily notice shadows if we dynamically move lights during the game
	spotLight.position.x = ball.position.x * 2;
	spotLight.position.y = ball.position.y * 2;
	

}

// Handles paddle collision logic
var firstColission = true;

function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// if ball is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// and if ball is aligned with paddle1 on y plane
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				if (firstColission) {
					firstColission = false;
				}
				//paddle1.scale.y = 15;
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle1DirY * 0.7;

				console.log(ball.scale);
				if (ball.scale.x <= 0.4) {
					ball.scale = defaultBallScale;
				}
				else {
					decreaseBallSize();
				}
			}
		}
	}
	
	// OPPONENT PADDLE LOGIC	
	
	// if ball is aligned with paddle2 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		// and if ball is aligned with paddle2 on y plane
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			// and if ball is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
				
				//paddle2.scale.y = 15;	
				// switch direction of ball travel to create bounce
				ballDirX = -ballDirX;
				// we impact ball angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the ball to beat the opponent
				ballDirY -= paddle2DirY * 0.7;
				
				if (ball.scale.x <= 0.4) {
					ball.scale = defaultBallScale;
				}
				else {
					decreaseBallSize();
				}
			}
		}
	}
}

function resetBall(loser)
{
	// position the ball in the center of the table
	ball.position.x = 0;
	ball.position.y = 0;
	
	// if player lost the last point, we send the ball to opponent
	if (loser == 1)
	{
		ballDirX = -1;
	}
	// else if opponent lost, we send ball to player
	else
	{
		ballDirX = 1;
	}
	
	// set the ball to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}

var bounceTime = 0;
// checks if either player or opponent has reached 5 points
function matchScoreCheck()
{
	// if player has 5 points
	if (score1 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player1 wins!";		
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		document.getElementById('RefreshButton').className="refreshButton";
		// make paddle bounce up and down
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// enlarge and squish paddle to emulate joy
		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	// else if opponent has 5 points
	else if (score2 >= maxScore)
	{
		// stop the ball
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player2 wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
		document.getElementById('RefreshButton').className="refreshButton";
		// make paddle bounce up and down
		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
		// enlarge and squish paddle to emulate joy
		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}

function decreaseBallSize() {
	ball.scale.x -= 0.15;
	ball.scale.y -= 0.15;
	ball.scale.z -= 0.15;
}

function changeSpeed() {
	var myrange = document.getElementById("level");
	ballSpeed = myrange.value;
	paddleSpeed = 3 * myrange.value;
}