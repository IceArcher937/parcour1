/**
 * @author spite / https://github.com/spite
 */
/*global THREE, console */
var buttonsPressedArray = [];
var buttonsPressedArray2 = [];

THREE.GamepadControls = function ( onTick, moveObject, object, scale, turnSpeed, controllerNumber ) {
  
  this.onTick = onTick;
  this.turnSpeed = turnSpeed || 1.5;
  this.scale = scale;
  this.controllerNumber = controllerNumber;
  this.moveObject = moveObject;
  //this.fakeObject = new THREE.Object3D();

	this.rotMatrix = new THREE.Matrix4();
	this.dir = new THREE.Vector3( 0, 0, 1 );
	this.tmpVector = new THREE.Vector3();
	this.object = object;
	this.lon = -90;
	this.lat = 0;
	this.target = new THREE.Vector3();
	this.threshold = 0.1;

	this.init = function(){

		var gamepadSupportAvailable = navigator.getGamepads ||
		!!navigator.webkitGetGamepads ||
		!!navigator.webkitGamepads;

		if (!gamepadSupportAvailable) {
			console.log( 'NOT SUPPORTED' );
		} else {
			if ('ongamepadconnected' in window) {
				window.addEventListener('gamepadconnected', onGamepadConnect.bind( this ), false);
				window.addEventListener('gamepaddisconnected', gamepadSupport.onGamepadDisconnect.bind( this ), false);
			} else {
				//this.startPolling();
			}
		}
	};

	this.startPolling = function() {

		if (!this.ticking) {
			this.ticking = true;
			this.tick();
		}
	};

	this.stopPolling = function() {
		this.ticking = false;
	};

	this.tick = function() {
		this.pollStatus();
		this.scheduleNextTick();
		this.onTick();
		
	};

	this.scheduleNextTick = function() {

		if (this.ticking) {
			requestAnimationFrame( this.tick.bind( this ) );
		}
	};

	this.pollStatus = function() {

		this.pollGamepads();

	};

	this.filter = function( v ) {

		return ( Math.abs( v ) > this.threshold ) ? v : 0;

	};

	this.pollGamepads = function() {

		var rawGamepads =
		(navigator.getGamepads && navigator.getGamepads()) ||
		(navigator.webkitGetGamepads && navigator.webkitGetGamepads());


		if( rawGamepads && rawGamepads[ this.controllerNumber ] ) {

			var g = rawGamepads[ this.controllerNumber ];
			
			this.lon += this.filter( g.axes[ 2 ] )  * this.turnSpeed;
			this.lat -= this.filter( g.axes[ 3 ] )  * this.turnSpeed;
			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			var phi = ( 90 - this.lat ) * Math.PI / 180;
			var theta = this.lon * Math.PI / 180;

			this.target.x = 10 * Math.sin( phi ) * Math.cos( theta );
			this.target.y = 10 * Math.cos( phi );
			this.target.z = 10 * Math.sin( phi ) * Math.sin( theta );

			this.target.add( this.object.position );
			//this.object.lookAt( this.target );
			if( this.controllerNumber === 0 ) {
			  camera.lookAt( this.target );
			} else {
			  camera2.lookAt( this.target );
			}

			this.rotMatrix.extractRotation( this.object.matrix );
			this.dir.set(
				this.filter( g.axes[ 0 ] ),
				0,
				this.filter( g.axes[ 1 ] )
			);
			this.dir.multiplyScalar( 0.1 * this.scale );
			
			//if( isSprinting ) {
			  //this.dir.z *= 1.4;
			//}
			
			this.dir.applyMatrix4( this.rotMatrix );
			
			this.direction = this.dir;
			
			if( this.controllerNumber === 0 ) {
			  

		  	GamePadControls.filter(this.moveObject.x);
		  	GamePadControls.filter(this.moveObject.z);

		  	this.dir.y = 0;
		  	this.moveObject.add( this.dir.multiplyScalar(0.2) );
		  	this.moveObject.multiplyScalar( 0.9 );
			
		  } else {
		    

		  	GamePadControls2.filter(this.moveObject.x);
		  	GamePadControls2.filter(this.moveObject.z);

		  	this.dir.y = 0;
		  	this.moveObject.add( this.dir.multiplyScalar(0.2) );
		  	this.moveObject.multiplyScalar( 0.9 );
		    
		  }


		}

	};

	this.init();
	console.log(navigator.getGamepads());
	
	
  if( this.controllerNumber === 0 ) {
    
    controllerIntervalId = setInterval(function() {
    if( (navigator.getGamepads()[0]) ) {
      clearInterval( controllerIntervalId );
      controllersRunning++;
      GamePadControls.startPolling();
      buttonsPressedArrayInit();
    }
    
  } , 1000 );
    
  } else {
    
    controllerIntervalId2 = setInterval(function() {
    if( (navigator.getGamepads()[1]) ) {
      clearInterval( controllerIntervalId2 );
      controllersRunning++;
      GamePadControls2.startPolling();
      buttonsPressedArrayInit2();
    }
    
  } , 1000 );
  
  
  }
};

THREE.GamepadControls.prototype = Object.create( THREE.EventDispatcher.prototype );


function buttonsPressedArrayInit() {
  buttonsPressedArray = navigator.getGamepads()[0].buttons;
  buttonsPressedArrayUpdate();
}
function buttonsPressedArrayInit2() {
  buttonsPressedArray2 = navigator.getGamepads()[1].buttons;
  buttonsPressedArrayUpdate2();
}

function buttonsPressedArrayUpdate() {
  
  buttonsPressedArray = navigator.getGamepads()[0].buttons;
  
  if( buttonsPressedArray[0].pressed && canJump ) {
    
    moveVector.y = Math.max(750, moveVector.y);
    canJump = false;
  }
  if( swordSwinging1 ) {
    swordSwinging1 = false;
  }
  if( buttonsPressedArray[7].pressed && canSwing1 ) {
    canSwing1 = false;
    swordSwinging1 = true;
    setTimeout(function() { canSwing1 = true; }, 2000 );
  }
  
  setTimeout( function() { buttonsPressedArrayUpdate(); } , 10 );
}
function buttonsPressedArrayUpdate2() {
  
  buttonsPressedArray2.length = 0;
  buttonsPressedArray2 = navigator.getGamepads()[1].buttons;
  
  if( buttonsPressedArray2[0].pressed && canJump2 ) {
    
    moveVector2.setY( Math.max(350, moveVector2.y) );
    canJump2 = false;
  }
  if( swordSwinging2 ) {
    swordSwingin2 = false;
  }
  if( buttonsPressedArray2[7].pressed && canSwing2 ) {
    canSwing2 = false;
    swordSwinging2 = true;
    setTimeout(function() { canSwing2 = true; }, 2000 );
  }
  
  setTimeout( function() { buttonsPressedArrayUpdate2(); } , 10 );
}
