(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["aframe-joysticks-movement-component"] = factory();
	else
		root["aframe-joysticks-movement-component"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__VRControls__ = __webpack_require__(2);
/* A straight up copy of Don McCurdy's gamepad-controls
 * https://github.com/donmccurdy/aframe-gamepad-controls
 * with the addition of factoring hmd rotation when determining movement vector,
 * so forward is always the direction you are facing, and right stick rotation
 * with oculus and vive controllers
 * */



var MAX_DELTA = 200, // ms
  PI_2 = Math.PI / 2;

var JOYSTICK_EPS = 0.2;

AFRAME.registerComponent('joysticks-movement', {
    schema: {
      lookEnabled:       { default: true },
      flyEnabled:        { default: false },
      invertAxisY:       { default: false },

      // Constants
      easing: {default: 20},
      acceleration: {default: 65},
      sensitivity: {default: 0.075},

      // Control axes
      pitchAxis: {default: 'x', oneOf: ['x', 'y', 'z']},
      yawAxis: {default: 'y', oneOf: ['x', 'y', 'z']},
      rollAxis: {default: 'z', oneOf: ['x', 'y', 'z']},

      // Debugging
      debug: {default: false}
    },

    types: {GAMEPAD: 'gamepad', OCULUS: 'oculus-touch', VIVE: 'vive'},

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init: function () {
      // Movement
      this.velocity = new THREE.Vector3(0, 0, 0);
      this.direction = new THREE.Vector3(0, 0, 0);

      // Rotation
      this.pitch = new THREE.Object3D();
      this.yaw = new THREE.Object3D();
      this.yaw.position.y = 10;
      this.yaw.add(this.pitch);

    },

    tick: function (t, dt) {
      this.updateRotation(dt);
      this.updatePosition(dt);
    },

    updatePosition: function (dt) {
      var data = this.data;
      var acceleration = data.acceleration;
      var easing = data.easing;
      var velocity = this.velocity;
      var rollAxis = data.rollAxis;
      var pitchAxis = data.pitchAxis;
      var el = this.el;
      var gamepad = this.getGamepad();

      // If data has changed or FPS is too low
      // we reset the velocity
      if (dt > MAX_DELTA) {
        velocity[rollAxis] = 0;
        velocity[pitchAxis] = 0;
        return;
      }

      velocity[rollAxis] -= velocity[rollAxis] * easing * dt / 1000;
      velocity[pitchAxis] -= velocity[pitchAxis] * easing * dt / 1000;

      var position = el.getAttribute('position');

      if (gamepad) {
        var dpad = this.getDpad(),
          inputX = dpad.x || this.getJoystick(0).x,
          inputY = dpad.y || this.getJoystick(0).y;
        if (Math.abs(inputX) > JOYSTICK_EPS) {
          velocity[pitchAxis] += inputX * acceleration * dt / 1000;
        }
        if (Math.abs(inputY) > JOYSTICK_EPS) {
          velocity[rollAxis] += inputY * acceleration * dt / 1000;
        }
      }

      var movementVector = this.getMovementVector(dt);

      el.object3D.translateX(movementVector.x);
      el.object3D.translateY(movementVector.y);
      el.object3D.translateZ(movementVector.z);

      el.setAttribute('position', {
        x: position.x + movementVector.x,
        y: position.y + movementVector.y,
        z: position.z + movementVector.z
      });
    },

    /**
     * Returns the state of the dpad as a THREE.Vector2.
     * @return {THREE.Vector2}
     */
    getDpad: function () {
      var gamepad = this.getGamepad();
      if (!gamepad.buttons[GamepadButton.DPAD_RIGHT]) {
        return new THREE.Vector2();
      }
      return new THREE.Vector2(
        (gamepad.buttons[GamepadButton.DPAD_RIGHT].pressed ? 1 : 0)
        + (gamepad.buttons[GamepadButton.DPAD_LEFT].pressed ? -1 : 0),
        (gamepad.buttons[GamepadButton.DPAD_UP].pressed ? -1 : 0)
        + (gamepad.buttons[GamepadButton.DPAD_DOWN].pressed ? 1 : 0)
      );
    },

    getMovementVector: function (dt) {
      if (this._getMovementVector) {
        return this._getMovementVector(dt);
      }

      var euler = new THREE.Euler(0, 0, 0, 'YXZ'),
        rotation = new THREE.Vector3();
      var dolly = new THREE.Object3D();
      var controls = new __WEBPACK_IMPORTED_MODULE_0__VRControls__["a" /* default */](dolly);
      var hmdEuler = new THREE.Euler();


      this._getMovementVector = function (dt) {

        controls.update();
        hmdEuler.setFromQuaternion(dolly.quaternion, 'YXZ');
        hmdEuler.z = 0;

        rotation.copy(this.el.getAttribute('rotation'));
        this.direction.copy(this.velocity);
        this.direction.multiplyScalar(dt / 1000);
        if (!rotation && !hmdEuler) {
          return this.direction;
        }
        if (!this.data.flyEnabled) {
          rotation.x = 0;
          hmdEuler.x = 0;
        }
        euler.set(
          THREE.Math.degToRad(rotation.x),
          THREE.Math.degToRad(rotation.y),
          0
        );
        this.direction.applyEuler(euler);
        this.direction.applyEuler(hmdEuler);
        return this.direction;
      };

      return this._getMovementVector(dt);
    },

    updateRotation: function () {
      if (this._updateRotation) {
        return this._updateRotation();
      }

      var initialRotation = new THREE.Vector3(),
        prevInitialRotation = new THREE.Vector3(),
        prevFinalRotation = new THREE.Vector3();

      var tCurrent,
        tLastLocalActivity = 0,
        tLastExternalActivity = 0;

      var ROTATION_EPS = 0.0001,
        DEBOUNCE = 500;

      this._updateRotation = function () {
        if (!this.data.lookEnabled || !this.getGamepad()) {
          return;
        }

        tCurrent = Date.now();
        initialRotation.copy(this.el.getAttribute('rotation') || initialRotation);

        // If initial rotation for this frame is different from last frame, and
        // doesn't match last gamepad state, assume an external component is
        // active on this element.
        if (initialRotation.distanceToSquared(prevInitialRotation) > ROTATION_EPS
          && initialRotation.distanceToSquared(prevFinalRotation) > ROTATION_EPS) {
          prevInitialRotation.copy(initialRotation);
          tLastExternalActivity = tCurrent;
          return;
        }

        prevInitialRotation.copy(initialRotation);

        // If external controls have been active in last 500ms, wait.
        if (tCurrent - tLastExternalActivity < DEBOUNCE) {
          return;
        }

        var lookVector = this.getJoystick(1);
        if (Math.abs(lookVector.x) <= JOYSTICK_EPS) lookVector.x = 0;
        if (Math.abs(lookVector.y) <= JOYSTICK_EPS) lookVector.y = 0;
        if (this.data.invertAxisY) lookVector.y = -lookVector.y;

        // If external controls have been active more recently than gamepad,
        // and gamepad hasn't moved, don't overwrite the existing rotation.
        if (tLastExternalActivity > tLastLocalActivity && !lookVector.lengthSq()) {
          return;
        }

        var sensitivity = this.data.sensitivity;
        var checkType = this.checkControllerType();
        if ( checkType && checkType.type != this.types.GAMEPAD ) {
          var act = !this.lastAction;
          if (!lookVector.lengthSq()) {
            this.lastAction = false;
          } else {
            this.lastAction = true;
          }

          if (!act) {
            return;
          }
          sensitivity = sensitivity * 10;
        }

        lookVector.multiplyScalar(sensitivity);
        this.yaw.rotation.y -= lookVector.x;
        this.pitch.rotation.x -= lookVector.y;
        this.pitch.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitch.rotation.x));

        this.el.setAttribute('rotation', {
          x: THREE.Math.radToDeg(this.pitch.rotation.x),
          y: THREE.Math.radToDeg(this.yaw.rotation.y),
          z: 0
        });
        prevFinalRotation.copy(this.el.getAttribute('rotation'));
        tLastLocalActivity = tCurrent;
      };

      return this._updateRotation();
    },



    checkControllerType: function () {
      var typeFound = this.types.GAMEPAD;
      var indexFound = 0;
      var gamepads = navigator.getGamepads && navigator.getGamepads();
      var i = 0;
      if (gamepads) {
        for (;i < gamepads.length; i++) {
          var gamepad = gamepads[i];
          if (gamepad) {
            if (gamepad.id.indexOf('Oculus Touch') === 0) {
              typeFound = this.types.OCULUS;
              indexFound = i;
              break;
            }
            if (gamepad.id.indexOf('OpenVR Gamepad') === 0) {
              typeFound = this.types.VIVE;
              indexFound = i;
              break;
            }
            indexFound = i;
          }
        }
          return { index: indexFound, type: typeFound};
      }
      return false;
    },


    getGamepad: function () {
      var type = this.checkControllerType();
      return type
        && navigator.getGamepads()[type.index];
    },

    /**
     * Returns the state of the given joystick (0 or 1) as a THREE.Vector2. For oculus or vive assumes
     * that the stick in the second position is actually the first stick of the second
     * gamepad AND that the vertical axis should be ignored.
     * @param  {number} id The joystick (0, 1) for which to find state.
     * @return {THREE.Vector2}
     */
    getJoystick: function (index) {
      var gamepad = this.getGamepad();
      switch (index) {
        case 0:
          return new THREE.Vector2(gamepad.axes[0], gamepad.axes[1]);
        case 1:
          var type = this.checkControllerType();
          if (type.type === this.types.GAMEPAD) {
            return new THREE.Vector2(gamepad.axes[2], gamepad.axes[3]);
          } else {
            gamepad = navigator.getGamepads()[type.index+1];
            return new THREE.Vector2(gamepad.axes[0], 0);
          }
        default:
          throw new Error('Unexpected joystick index "%d".', index);
      }
    }
  }
);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*I copied this from
* https://github.com/mrdoob/three.js/blob/87cd4caca11544c0914d3828b299c8939bc981b2/examples/js/controls/VRControls.js
* */
/* harmony default export */ __webpack_exports__["a"] = (function (object, onError) {
  var scope = this;
  var vrDisplay, vrDisplays;
  var standingMatrix = new THREE.Matrix4();
  var frameData = null;
  if ('VRFrameData' in window) {
    frameData = new VRFrameData();
  }

  function gotVRDisplays(displays) {
    vrDisplays = displays;
    if (displays.length > 0) {
      vrDisplay = displays[0];
    } else {
      if (onError) onError('VR input not available.');
    }
  }

  if (navigator.getVRDisplays) {
    navigator.getVRDisplays().then(gotVRDisplays).catch(function () {
      console.warn('THREE.VRControls: Unable to get VR Displays');
    });
  }

  // the Rift SDK returns the position in meters
  // this scale factor allows the user to define how meters
  // are converted to scene units.

  this.scale = 1;

  // If true will use "standing space" coordinate system where y=0 is the
  // floor and x=0, z=0 is the center of the room.
  this.standing = false;

  // Distance from the users eyes to the floor in meters. Used when
  // standing=true but the VRDisplay doesn't provide stageParameters.
  this.userHeight = 1.6;

  this.getVRDisplay = function () {
    return vrDisplay;
  };

  this.setVRDisplay = function (value) {
    vrDisplay = value;
  };

  this.getVRDisplays = function () {
    console.warn('THREE.VRControls: getVRDisplays() is being deprecated.');
    return vrDisplays;
  };

  this.getStandingMatrix = function () {
    return standingMatrix;
  };

  this.update = function () {
    if (vrDisplay) {
      var pose;
      if (vrDisplay.getFrameData) {
        vrDisplay.getFrameData(frameData);
        pose = frameData.pose;
      } else if (vrDisplay.getPose) {
        pose = vrDisplay.getPose();
      }

      if (pose.orientation !== null) {
        object.quaternion.fromArray(pose.orientation);
      }

      if (pose.position !== null) {
        object.position.fromArray(pose.position);
      } else {
        object.position.set(0, 0, 0);
      }

      if (this.standing) {
        if (vrDisplay.stageParameters) {
          object.updateMatrix();
          standingMatrix.fromArray(vrDisplay.stageParameters.sittingToStandingTransform);
          object.applyMatrix(standingMatrix);
        } else {
          object.position.setY(object.position.y + this.userHeight);
        }
      }

      object.position.multiplyScalar(scope.scale);
    }
  };

  this.dispose = function () {
    vrDisplay = null;
  };

});;

/***/ })
/******/ ]);
});