/* A THREE.js 3D space for Pacioli 
 *
 * Copyright (c) 2013 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var scaleFudge = 1;
   
var Pacioli = Pacioli || {};

Pacioli.Space = function (parent, options) {

    this.parent = parent
    this.animating = false
    this.options = {}
    this.body = null
    this.axes = null

    this.copyOptions(options || {})

    this.mouseInfo = {
        moving: false,
        rotating: false,
        circling: false,
        lastX: null,
        lastY: null
    }

    this.cameraInfo = {
        rotationX: -0.25,
        rotationY: 0.1,
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
        distance: 10
    }

    this.init()
}

Pacioli.Space.prototype.setOptions = function (options) {
    this.copyOptions(options)
    var hasAxes = (this.axes !== null)
    this.init()
    if (hasAxes) {
        this.showAxes()
    }
    this.draw()
}

Pacioli.Space.prototype.copyOptions = function (options) { 
    this.options = {
        webgl: options.webgl === true || (options.webgl !== false && this.options.webgl === true) || false,
        perspective: options.perspective === true || (options.perspective !== false && this.options.perspective === true) || false,
        axisSize: options.axisSize || this.options.axisSize || 10,
        width: options.width || this.options.width || 640,
        height: options.height || this.options.height || 360,
        unit: options.unit || this.options.unit || Pacioli.unit()
    }
}

Pacioli.Space.prototype.init = function () {

    // Make the parent node empty
    while (this.parent.firstChild) {
        this.parent.removeChild(this.parent.firstChild)
    }

    // Create the canvas element
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.options.width
    this.canvas.height = this.options.height
    //this.canvas.style.border = "1px solid black"
    //this.canvas.style.outline = 1 
    this.canvas.tabIndex = 1
    this.canvas.className = "space"
    this.canvas.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
    this.canvas.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
    this.canvas.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
    this.canvas.addEventListener('mouseout', this.onDocumentMouseOut.bind(this), false);
    this.canvas.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
    this.canvas.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
    this.canvas.addEventListener('DOMMouseScroll', this.onMouseWheel.bind(this), false);
    //this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    //this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    //this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    //this.canvas.addEventListener('touchcancel', this.onTouchCancel.bind(this), false);
    //this.canvas.addEventListener('touchleave', this.onTouchLeave.bind(this), false);
    this.parent.appendChild(this.canvas)

    var width = this.canvas.width
    var height = this.canvas.height

    // Create the camera
    if (this.options.perspective) {
	this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 10000);
    } else {
	this.camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, -1000, 1000);
    }

    // Create the renderer
    if (this.options.webgl) {
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
    } else {
	this.renderer = new THREE.CanvasRenderer({canvas: this.canvas});
    }
    this.renderer.setSize(width, height);

    // Create the scene
    this.scene = new THREE.Scene();

    // Remove any axes. This forces creation on first use.
    this.axes = null

    // Replace the body. Not sure if this is necessary. See comment about axes above.
    var replacement = new THREE.Object3D()
    if (this.body !== null) {
        replacement.rotation = this.body.rotation;
    }
    this.body = replacement
    this.scene.add(this.body)
}

Pacioli.Space.prototype.draw = function () {
    requestAnimationFrame(this.animate.bind(this));
}

Pacioli.Space.prototype.drawfast = function () {
    var self = this
    requestAnimationFrame(self.animatefast.bind(self));
}

Pacioli.Space.prototype.animatefast = function () {
    spaceTimeoutID = null
    this.renderer.render(this.scene, this.camera);
}

Pacioli.Space.prototype.animate = function () {
spaceTimeoutID = null
    var width = this.canvas.width
    var height = this.canvas.height

    var camera = this.camera
    var cameraInfo = this.cameraInfo

    // Adjust the camera position
    var dist = cameraInfo.zoom * scaleFudge * cameraInfo.distance
    camera.position.x = dist * Math.cos(cameraInfo.rotationY) * Math.cos(cameraInfo.rotationX);
    camera.position.z = dist * Math.cos(cameraInfo.rotationY) * -Math.sin(cameraInfo.rotationX);
    camera.position.y = dist * Math.sin(cameraInfo.rotationY);

    // Adjust the screen offset
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.setViewOffset(width, height, cameraInfo.offsetX, cameraInfo.offsetY, width, height);
    } else {
        var factor = cameraInfo.zoom * scaleFudge /cameraInfo.distance
        camera.left = factor * (cameraInfo.offsetX - width/2);
        camera.right = factor * (cameraInfo.offsetX + width/2);
        camera.top = factor * (-cameraInfo.offsetY + height/2);
        camera.bottom = factor * (-cameraInfo.offsetY - height/2);
    }

    // Make the camera look at the origin and do the necessary update.
    camera.lookAt(this.body.position);
    camera.updateProjectionMatrix();

    // Rotate each label towards the user
    if (this.axes != undefined) this.orientAxisLabels(cameraInfo.rotationX + Math.PI/2);

    // Rendered the scene
    this.renderer.render(this.scene, camera);

    // Loop the animation. Note: three.js includes requestAnimationFrame shim
    if (this.animating) { 
        this.draw() 
    }
}

Pacioli.Space.prototype.focus = function () {
    this.canvas.focus()
}

Pacioli.Space.prototype.move = function (dx, dy) {
    this.moveCamera(dx, dy)
    this.draw()
}

Pacioli.Space.prototype.resize = function (width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.draw()
}

Pacioli.Space.prototype.showAxes = function () {
    if (this.axes === null) {
        this.axes = newAxes(this.options.axisSize, this.options.unit.isDimensionless() ? "  " : " (" + this.options.unit.symbolized().toText() + ")");
        this.scene.add(this.axes.object);
        this.draw()
    }
}

Pacioli.Space.prototype.hideAxes = function () {
    if (this.axes !== null) {
	this.scene.remove(this.axes.object);
        this.axes = null
        this.draw()
    }
}

Pacioli.Space.prototype.orientAxisLabels = function (direction) {
    if (this.axes !== null) {
	for (var i = 0; i < this.axes.labels.length; i++) {
	    this.axes.labels[i].rotation.y = direction;
	}
    }
}

Pacioli.Space.prototype.onDocumentKeyDown = function (event) {

    function handleArrow(moveX, moveY, rotateX, rotateY) {
	if (event.shiftKey && ! event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    this.moveCamera(moveX, moveY);
	} else if (! event.shiftKey && ! event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    this.rotateCamera(rotateX, rotateY);
	} else if (! event.shiftKey && event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    this.handleRotateBody(rotateX, rotateY);
	}
	this.draw();
    }

    switch (event.which) {
	case 61: this.zoomIn(); break;
	case 173: this.zoomOut(); break;
	case 37: handleArrow.call(this, 20, 0, 0.1, 0); break;
	case 38: handleArrow.call(this, 0, 20, 0, -0.1); break;
	case 39: handleArrow.call(this, -20, 0, -0.1, 0); break;
	case 40: handleArrow.call(this, 0, -20, 0, 0.1); break;
    }
}

Pacioli.Space.prototype.onDocumentMouseDown = function (event) {

    var info = this.mouseInfo

    info.lastX = event.clientX
    info.lastY = event.clientY
    info.circling = ! event.shiftKey && ! event.ctrlKey && ! event.altKey;
    info.rotating = ! event.shiftKey && event.ctrlKey && ! event.altKey;
    info.moving = event.shiftKey && ! event.ctrlKey && ! event.altKey;
    if (info.rotating || info.circling || info.moving) {
	event.preventDefault();
	this.animating = true;
	this.draw()
    }
    event.target.focus();
}


Pacioli.Space.prototype.onMouseWheel = function (event) {
    event.preventDefault();
    var data = event.wheelDelta || -event.detail;
    if (0 < Number(data)) {
        this.zoomIn();
    } else {
        this.zoomOut();
    }
}

Pacioli.Space.prototype.onDocumentMouseMove = function (event) {

    var info = this.mouseInfo

    // Calculate the movement
    var dx = info.lastX - event.clientX;
    var dy = info.lastY - event.clientY;

    // Adjust the view
    if (info.circling) this.rotateCamera(0.01 * dx,  -0.003 * dy);
    if (info.rotating) this.handleRotateBody(0.01 * dx, -0.003 * dy);
    if (info.moving) this.moveCamera(dx, dy);

    // Prevent default behavior
    if (info.rotating || info.circling || info.moving) event.preventDefault();

    // Update the last known position
    info.lastX = event.clientX;
    info.lastY = event.clientY;
}

Pacioli.Space.prototype.onDocumentMouseUp = function (event) {
    var info = this.mouseInfo
    if (info.rotating || info.circling || info.moving) {
	event.preventDefault();
	this.animating = false;
	info.moving = false;
	info.rotating = false;
	info.circling = false;
    }
}

Pacioli.Space.prototype.onDocumentMouseOut = function (event) {
    var info = this.mouseInfo
    if (info.rotating || info.circling || info.moving) {
	event.preventDefault();
	this.animating = false;
	info.moving = false;
	info.rotating = false;
	info.circling = false;
    }
}

Pacioli.Space.prototype.zoomOut = function () {
    this.cameraInfo.zoom *= 1.2;
    this.draw()
}

Pacioli.Space.prototype.zoomIn = function () {
    this.cameraInfo.zoom /= 1.2;
    this.draw()
}

Pacioli.Space.prototype.moveCamera = function (dx, dy) {
    this.cameraInfo.offsetX += dx;
    this.cameraInfo.offsetY += dy;
}

Pacioli.Space.prototype.rotateCamera = function (dx, dy) {
    this.cameraInfo.rotationX = this.cameraInfo.rotationX + dx;
    // If rotation gets -pi/2 or pi/2 then canvas in firefox with
    // ortho camera and axes on hangs. The 1.57 is just below pi/2 and
    // avoids the problem.
    //rotationY = Math.min(Math.max(rotationY + dy, -Math.PI/2), Math.PI/2);
    this.cameraInfo.rotationY = Math.min(Math.max(this.cameraInfo.rotationY + dy, -1.57), 1.57);
}

Pacioli.Space.prototype.handleRotateBody = function(dx, dy) {

    // The vertical axis and the axis perpendicular to it and to the user direction
    var axis1 = new THREE.Vector3(0,1,0);
    var axis2 = new THREE.Vector3().cross(axis1, this.camera.position);
    
    // Make rotation matrices around the two axes
    var rotObjectMatrix1 = new THREE.Matrix4();
    var rotObjectMatrix2 = new THREE.Matrix4();
    rotObjectMatrix1.makeRotationAxis(axis1.normalize(), dx);
    rotObjectMatrix2.makeRotationAxis(axis2.normalize(), dy);

    // Apply the matrices to the body
    rotObjectMatrix1.multiplySelf(this.body.matrix);
    rotObjectMatrix2.multiplySelf(rotObjectMatrix1);
    this.body.rotation.setEulerFromRotationMatrix(rotObjectMatrix2);
}

// todo: find out how to rotate multiple times. Currently each rotation
//       overwrites the previous rotation. Can the rotation on body be effectuated?
//       Check this after upgrade to new THREE version. The handleRotation can reuse 
//       this function
Pacioli.Space.prototype.rotateBody = function(axis, angle) {
    var rotObjectMatrix = new THREE.Matrix4()
    rotObjectMatrix.makeRotationAxis(axis.normalize(), angle)
    this.body.rotation.setEulerFromRotationMatrix(rotObjectMatrix)
}

Pacioli.Space.prototype.remove = function (body) {
    this.body.remove(body)
}

Pacioli.Space.prototype.addMesh = function (mesh, options) {

    var graphics = options || {}

    // Create the proper material
    var material = graphics.material || "normal";
    var transparent = graphics.transparent || false;
    var webgl = this.options.webgl
    var wireframe = graphics.wireframe || false
    var transparent = graphics.transparent || false
    var props = {
	overdraw: !(webgl || wireframe || transparent),
	wireframe: wireframe,
	side: THREE.DoubleSide,
	transparent: transparent,
	opacity: (transparent) ? 0.5 : 1.0
    };

    if (material == "normal") {
	var material = new THREE.MeshNormalMaterial(props);
    } else if (material == "Lambert") {
	var material = new THREE.MeshLambertMaterial(props);
    } else if (material == "Phong") {
	var material = new THREE.MeshPhongMaterial(props);
    } else {
	props['color'] = 0Xaaaaff;
	var material = new THREE.MeshBasicMaterial(props);
    }

    // Create a mesh object with the material and add it to the body
    var meshObject = Pacioli.mesh2THREE(mesh, material, this.options.unit)
    this.body.add(meshObject);

    // Return the mesh object to the caller as reference
    return meshObject;
}



Pacioli.Space.prototype.clear = function () {
    while (0 < this.body.children.length) {
        this.body.remove(this.body.children[0])
    }
}

Pacioli.Space.prototype.addCurve = function (points, graphics) {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0xaaaaaa, transparent: true, opacity:0.3});

    var factor = points.type.param.param.multiplier.conversionFactor(this.options.unit)

    for (var i = 0; i < points.value.length; i++) {
	var point = points.value[i];
        geometry.vertices.push(Pacioli.vec2THREE(point, factor))
    }

    var lineObject = new THREE.Line(geometry, material);
    this.body.add(lineObject);

    return lineObject
}

Pacioli.vec2THREE = function (vector, factor) {
    return new THREE.Vector3(Pacioli.getNumber(vector, 0, 0) * factor,
                             Pacioli.getNumber(vector, 2, 0) * factor,
                             Pacioli.getNumber(vector, 1, 0) * factor);
}


Pacioli.mesh2THREE = function (mesh, material, unit) {

    var factor = mesh.type.param[0].param.param.multiplier.conversionFactor(unit)
 
    var geometry = new THREE.Geometry();

    var vertices = mesh.value[0]
    for (var i = 0; i < vertices.length; i++) {
	geometry.vertices.push(Pacioli.vec2THREE(vertices[i], factor));
    }

    var faces = mesh.value[1]
    for (var i = 0; i < faces.length; i++) {
	var face = faces[i]
	geometry.faces.push(new THREE.Face4(Pacioli.getNumber(face[0], 0, 0),
                                            Pacioli.getNumber(face[1], 0, 0),
                                            Pacioli.getNumber(face[2], 0, 0),
                                            Pacioli.getNumber(face[3], 0, 0)))
    }

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeCentroids();

    return new THREE.Mesh(geometry, material);
}

function addLight(scene) {

    // Add ambient light to the scene
    scene.add(new THREE.AmbientLight(0x555555));

    // Add a point light to the scene
    var light1 = new THREE.DirectionalLight(0xaaaaFF, 0.5);
    light1.position.set(100, 100, 100);
    light1.target = body;
    scene.add(light1);

    // Add a point light to the scene
    var light2 = new THREE.DirectionalLight(0xaaaaff, 0.5);
    light2.position.set(-100, -100, 100);
    light2.target = body;
    scene.add(light2);
}

function newAxes(n, unit) {

    // Create the new axes object
    var axes = {
	object: new THREE.Object3D(),    // Container for axes elements
	labels: []                       // Labels to be oriented towards the user during animation
    }

    // Create the axes material
    var material = new THREE.LineBasicMaterial({color: 0xbbbbbb});

    function addAxisLine(from, to) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(from[0], from[1], from[2]));
	geometry.vertices.push(new THREE.Vector3(to[0], to[1], to[2]));
	axes.object.add(new THREE.Line(geometry, material));
    }

    function addLabel(text, size, position) {
	var label = newLabel(text, size);
	axes.object.add(label);
	axes.labels.push(label);
	label.position.x = position[0];
	label.position.y = position[1] + scaleFudge*0.5;
	label.position.z = position[2];
    }

    // Add the axes' lines
    addAxisLine([-n * scaleFudge, 0, 0], [n * scaleFudge, 0, 0]);
    addAxisLine([0, -n * scaleFudge, 0], [0, n * scaleFudge, 0]);
    addAxisLine([0, 0, -n * scaleFudge], [0, 0, n * scaleFudge]);

    // Add the axes' labels
    addLabel("x" + unit, 0.1, [n, 0, 0]);
    addLabel("y" + unit, 0.1, [0, 0, n]);
    addLabel("z" + unit, 0.1, [0, n, 0]);

    // Add the tickmarks
    for (var i = -n; i <= n; i ++) {

	if (i != 0) {

	    // The tickmark lines
	    var thickness = i % 10 == 0 ? 0.4 : i % 5 == 0 ? 0.2 : 0.1;
	    addAxisLine([i*scaleFudge, 0, -thickness*scaleFudge], [i*scaleFudge, 0, thickness*scaleFudge]);
	    addAxisLine([-thickness*scaleFudge, i*scaleFudge, 0], [thickness*scaleFudge, i*scaleFudge, 0]);
	    addAxisLine([0, -thickness*scaleFudge, i*scaleFudge], [0, thickness*scaleFudge, i*scaleFudge]);

	    // The tickmark numbers
	    if (i % 10 == 0) {
		addLabel(i, 0.05, [i, 0, 0]);
		addLabel(i, 0.05, [0, i, 0]);
		addLabel(i, 0.05, [0, 0, i]);
	    }
	}
    }

    // Return the new axes object
    return axes;
}

function newLabel(text, size) {

    // Write the text on a new canvas.
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = context.measureText(text).width;

    // Create a picture of the text. It must be square to maintain
    // size ratios and large enough to hold the text. Assume the width
    // is larger than the height.
    canvas.width = width;
    canvas.height = width;
    context.textBaseline = 'top';
    context.fillText(text, 0, 0);

    // Put the canvas in a texture and make a plane.
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    var cover = new THREE.MeshBasicMaterial({map: texture, transparent: true, side: THREE.DoubleSide});
    var shape = new THREE.PlaneGeometry(width*size, width*size);

    // Create the label
    var label = new THREE.Mesh(shape, cover);
    label.needsUpdate = true;
    return label;
}

//function onTouchStart(event) {
//    event.preventDefault();
//    var touch = event.touches[0];
//    lastX = touch.pageX;
//    lastY = touch.pageY;
//    moving = false;
//    circling = false;
//    rotating = true;
//    animating = true;
//    requestAnimationFrame(animate);
//    //event.target.focus();
//}
//
//function onTouchMove(event) {
//    event.preventDefault();
//    var touch = event.touches[0];
//
//    var dx = lastX - event.clientX;
//    var dy = lastY - event.clientY;
//
//    if (moving) moveCamera(dx, dy);
//    if (rotating) rotateBody(0.01 * dx, -0.003 * dy);
//    if (circling) rotateCamera(0.01 * dx, -0.003 * dy);
//
//    lastX = touch.pageX;
//    lastY = touch.pageY;
//}
//
//function onTouchEnd(event) {
//    event.preventDefault();
//    animating = false;
//    moving = false;
//    rotating = false;
//    circling = false;
//}
//
//function onTouchCancel(event) {
//    event.preventDefault();
//    animating = false;
//    moving = false;
//    rotating = false;
//    circling = false;
//}
//
//function onTouchLeave(event) {
//    event.preventDefault();
//    animating = false;
//    moving = false;
//    rotating = false;
//    circling = false;
//}
