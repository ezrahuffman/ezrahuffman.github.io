/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cart.js":
/*!*****************!*\
  !*** ./cart.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\r\n\r\n\r\n\r\nconst visibleHeightAtZDepth = (depth, camera) => {\r\n    // camera not at z\r\n    const cameraOffset = camera.position.z;\r\n    if(depth < cameraOffset) depth -= cameraOffset;\r\n    else depth += cameraOffset;\r\n\r\n    //vertical fov in radians\r\n    const vFov = camera.fov * Math.PI / 180;\r\n\r\n    return 2 * Math.abs(depth) * Math.tan(vFov/2);\r\n};\r\n\r\nconst visibleWidthAtZDepth = (depth, camera) => {\r\n    const height = visibleHeightAtZDepth(depth, camera);\r\n    return height * camera.aspect;\r\n};\r\n\r\n\r\n\r\nconst camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 500);\r\ncamera.position.z = 100;\r\ncamera.lookAt(0, 0, 0);\r\n\r\nwindow.addEventListener('resize', function () {\r\n    let width = window.innerWidth;\r\n    let height = window.innerHeight;\r\n    renderer.setSize(width,height);\r\n    camera.aspect = width / height;\r\n    camera.updateProjectionMatrix();\r\n    \r\n    //reset walls \r\n    worldWidth = visibleWidthAtZDepth(0, camera);\r\n    worldHeight = visibleHeightAtZDepth(0, camera);\r\n    wall.position.x += worldWidth/2 ;\r\n    wall2.position.x -= worldWidth/2 ;\r\n});\r\n\r\nlet clock = new three__WEBPACK_IMPORTED_MODULE_0__.Clock();\r\n\r\nconst renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();\r\nrenderer.setSize(window.innerWidth, window.innerHeight);\r\ndocument.body.appendChild(renderer.domElement);\r\n\r\n\r\nconst scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();\r\nscene.background = new three__WEBPACK_IMPORTED_MODULE_0__.Color( 0xbfe3dd );\r\n\r\nlet worldWidth = visibleWidthAtZDepth(0, camera);\r\nlet worldHeight = visibleHeightAtZDepth(0, camera);\r\n\r\nconst mass1_slider = document.getElementById('mass1');\r\nconst mass2_slider = document.getElementById('mass2');\r\n//const scaleSlider = document.getElementById('scale');\r\n\r\nlet v = 50;\r\nlet v2 = -50;\r\n\r\nlet m1 = 1;\r\nlet m2 = 1000;\r\n// make cart\r\nconst cartWidth = 5;\r\nconst cartHeight = 5;\r\nconst cartGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(cartWidth, cartHeight);\r\nconst material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({color: 0xb07021});\r\nconst material2 = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({color: 0x000000});\r\nconst cart = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(cartGeometry, material);\r\ncart.position.x += cartWidth/2 + .2;\r\nscene.add( cart );\r\nconst cart2 = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(cartGeometry, material2);\r\ncart2.position.x -= cartWidth/2 + .2;\r\nscene.add( cart2 );\r\n\r\n// make floor \r\nconst floorWidth = window.innerWidth;\r\nconst floorHeight = window.innerHeight/2;\r\nconst floorGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(floorWidth, floorHeight);\r\nconst floorMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({color: 0x363331});\r\nconst floor = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(floorGeometry, floorMaterial);\r\nfloor.position.y -= floorHeight/2 + cartHeight/2 ;\r\nscene.add( floor );\r\n\r\n\r\n// make wall \r\nconst wallWidth = 20;\r\nconst wallHeight = window.innerHeight;\r\nconst wallGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(wallWidth, wallHeight);\r\nconst wallMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({color: 0x363331});\r\nconst wall = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(wallGeometry, wallMaterial);\r\nconsole.log(window.innerWidth);\r\nwall.position.x += worldWidth/2 ;\r\nscene.add( wall);\r\n\r\n// make wall \r\n\r\nconst wallLeft = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(wallGeometry, wallMaterial);\r\nconsole.log(window.innerWidth);\r\nwallLeft.position.x -= worldWidth/2 ;\r\nscene.add( wallLeft);\r\n\r\n\r\nfunction resolveCartCollision(cart1, cart2){\r\n    const denominator = m1 + m2;\r\n    const numarator = (2 * m1 * v) + (m2 * v2) - (m1 * v2);\r\n    const v2_f = numarator/denominator;\r\n    const v1_f = ((m1 * v) + (m2 * v2) - (m2 * v2_f))/m1;\r\n\r\n    v = v1_f;\r\n    v2 = v2_f;\r\n}\r\n\r\n\r\nfunction collision(w1, o1, w2, o2){\r\n    if ((o1.position.x + (w1/2)) >= (o2.position.x - (w2/2)) && (o1.position.x + (w1/2)) <= (o2.position.x + (w2/2))){\r\n        return true;\r\n    }\r\n    if ((o1.position.x - (w1/2)) <= (o2.position.x + (w2/2)) && (o1.position.x - (w1/2)) >= (o2.position.x - (w2/2))  ){\r\n        return true;\r\n    }\r\n    return false;\r\n}\r\n\r\n\r\n\r\nfunction update_physics(delta){\r\n    // calculate physics\r\n    if(collision(cartWidth, cart, wallWidth, wall)){\r\n        //solveCollision(cart, wall);\r\n        v *= -1;\r\n    }\r\n    if(collision(cartWidth, cart, wallWidth, wallLeft)){\r\n        //solveCollision(cart, wall);\r\n        v *= -1; \r\n    }\r\n    if(collision(cartWidth, cart2, wallWidth, wall)){\r\n        //solveCollision(cart, wall);\r\n        v2 *= -1;\r\n    }\r\n    if(collision(cartWidth, cart2, wallWidth, wallLeft)){\r\n        //solveCollision(cart, wall);\r\n        v2 *= -1;\r\n    }\r\n    if(collision(cartWidth, cart2, cartWidth, cart)){\r\n        //solveCollision(cart, wall);\r\n        resolveCartCollision(cart, cart2);\r\n        console.log(\"v: \" + v+ \", v2: \" + v2);\r\n    }\r\n    cart.position.x += v * delta;\r\n    cart2.position.x += v2 * delta;\r\n    \r\n}\r\n\r\nfunction getSliderValues(){\r\n    m1 = parseFloat(mass1_slider.value);\r\n    m2 = parseFloat(mass2_slider.value);\r\n}\r\n\r\nconst physicsSubsteps = 4;\r\nfunction animate() {\r\n    \r\n   getSliderValues();\r\n\r\n    const delta = clock.getDelta();\r\n\r\n    const subDelta = delta/physicsSubsteps;\r\n    for (let index = 0; index < physicsSubsteps; index++) {\r\n        update_physics(subDelta);\r\n    }\r\n\r\n    renderer.render( scene, camera );\r\n}\r\n\r\n\r\nrenderer.setAnimationLoop(animate);\r\n// Lines\r\n// const lineMaterial = new THREE.LineBasicMaterial({color : 0x0000ff});\r\n\r\n// const points = [];\r\n// points.push( new THREE.Vector3(-10, 0, 0));\r\n// points.push( new THREE.Vector3(0, 10, 0));\r\n// points.push( new THREE.Vector3(10, 0, 0));\r\n\r\n// const geometry = new THREE.BufferGeometry().setFromPoints(points);\r\n\r\n// const line = new THREE.Line(geometry, lineMaterial);\r\n// scene.add(line);\r\n// renderer.render(scene, camera);\r\n\r\n// if(WebGL.isWebGL2Available()){\r\n//     animate()\r\n// }\r\n// else{\r\n//     const warning = WebGL.getWebGL2ErrorMessage();\r\n//     document.getElementById('container').appendChild(warning)\r\n// }\n\n//# sourceURL=webpack://portfolio-website/./cart.js?");

/***/ }),

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./cart.js");
/******/ 	
/******/ })()
;