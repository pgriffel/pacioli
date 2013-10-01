// Shell rendering
// Paul Griffioen, 2013

// ----------------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------------

// Global Objects
var camera, renderer, scene         // Canvas rendering machinery
var body, axes                      // Graphical objects to render
var shell                           // Model to render

// Camera state
var rotationX = -0.25;
var rotationY = 0.1;
var offsetX = 0;
var offsetY = 200;
var zoom = 0.05;
var camera_distance = 1000;

// Mouse and Touch handling
var animating, moving, rotating, circling;
var lastX, lastY;

// Misc
var scaleFudge = 1;

// ----------------------------------------------------------------------------
// Shell Canvas
// ----------------------------------------------------------------------------

function initializeCanvas(canvas, params, graphics) {

    var width = window.innerWidth;
    var height = window.innerHeight;

    // Check for WebGL support
    if (graphics.webgl && ! Detector.webgl) {
	alert('WebGL seems unavailable. Rendering will probably not work.');
    }

    // Create the global camera
    if (graphics.perspective) {
	camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 10000);
    } else {
	camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, -1000, 1000);
    }

    // Create the global renderer
    if (graphics.webgl) {
	renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    } else {
	renderer = new THREE.CanvasRenderer({canvas: canvas});
    }
    renderer.setSize(width, height);

    // Create the global scene
    scene = new THREE.Scene();
    addLight(scene);

    // Attach the event handlers for user gestures
    addEventHandlers(canvas);

    // Force creation of new axes on next use
    axes = undefined;
}

function updateShell(params, graphics) {
    shell = {curves: computeShell(params)};
    updateBody(params, graphics);
}

function updateBody(params, graphics) {

    // Create a new body
    var replacement = newBody(shell.curves, graphics);

    // Copy properties if possible and remove the old body if necessary
    if (body != undefined) {
       replacement.rotation = body.rotation;
       scene.remove(body);
    }

    // Add the new body to the scene and make it the current body
    scene.add(replacement);
    body = replacement;
}

function orientAxisLabels(axes, direction) {

    // Rotate each axis label to the asked direction
    if (axes != undefined) {
	for (var i = 0; i < axes.labels.length; i++) {
	    axes.labels[i].rotation.y = direction;
	}
    }
}

function toggleAxes(on) {

    // Create axes if necessary
    if (axes == undefined) {
	axes = newAxes(100);
    }

    // Add or remove the axes object to or from the scene
    if (on) {
	scene.add(axes.object);
    } else {
	scene.remove(axes.object);
    }
}

// ----------------------------------------------------------------------------
// Animation
// ----------------------------------------------------------------------------

function animate() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    // Adjust the camera position
    camera.position.x = zoom * scaleFudge * camera_distance * Math.cos(rotationY) * Math.cos(rotationX);
    camera.position.z = zoom * scaleFudge * camera_distance * Math.cos(rotationY) * -Math.sin(rotationX);
    camera.position.y = zoom * scaleFudge * camera_distance * Math.sin(rotationY);

    // Adjust the screen offset
    if (camera instanceof THREE.PerspectiveCamera) {
       camera.setViewOffset(width, height, offsetX, offsetY, width, height);
    } else {
       camera.left = zoom *  scaleFudge * (offsetX - width/2);
       camera.right = zoom * scaleFudge * (offsetX + width/2);
       camera.top = zoom * scaleFudge * (-offsetY + height/2);
       camera.bottom = zoom * scaleFudge * (-offsetY - height/2);
    }

    // Make the camera look at the body and do the necessary update.
    camera.lookAt(body.position);
    camera.updateProjectionMatrix();

    // Rotate each label towards the user
    if (axes != undefined) orientAxisLabels(axes, rotationX + Math.PI/2);

    // Rendered the scene
    renderer.render(scene, camera);

    // Loop the animation. Note: three.js includes requestAnimationFrame shim
    if (animating) requestAnimationFrame(animate);
}

function orientUp() {

    // Find a point on the coiling axis
    var pos = _axisPoint(shell.curves);
    var vec = new THREE.Vector3(pos[0], pos[2], pos[1]);

    // Find rotation axis and angle from the point to a negative point on the vertical axis
    var focus = new THREE.Vector3(0, -1, 0);
    var axis = new THREE.Vector3().cross(vec, focus);
    var angle = Math.atan2(axis.length(), focus.dot(vec));

    // Rotate the object
    var rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), angle);
    body.rotation.setEulerFromRotationMatrix(rotObjectMatrix);

    // Update the UI
    requestAnimationFrame(animate);
}

function zoomOut() {
    zoom *= 1.2;
    requestAnimationFrame(animate);
}

function zoomIn() {
    zoom /= 1.2;
    requestAnimationFrame(animate);
}

function moveCamera(dx, dy) {
    offsetX += dx;
    offsetY += dy;
}

function rotateCamera(dx, dy) {
    rotationX = rotationX + dx;
    // If rotation gets -pi/2 or pi/2 then canvas in firefox with
    // ortho camera and axes on hangs. The 1.57 is just below pi/2 and
    // avoids the problem.
    //rotationY = Math.min(Math.max(rotationY + dy, -Math.PI/2), Math.PI/2);
    rotationY = Math.min(Math.max(rotationY + dy, -1.57), 1.57);
}

function rotateBody(dx, dy) {

    // The vertical axis and the axis perpendicular to it and to the user direction
    var axis1 = new THREE.Vector3(0,1,0);
    var axis2 = new THREE.Vector3().cross( axis1, camera.position );

    // Make rotation matrices around the two axes
    var rotObjectMatrix1 = new THREE.Matrix4();
    var rotObjectMatrix2 = new THREE.Matrix4();
    rotObjectMatrix1.makeRotationAxis(axis1.normalize(), dx);
    rotObjectMatrix2.makeRotationAxis(axis2.normalize(), dy);

    // Apply the matrices to the body
    rotObjectMatrix1.multiplySelf(body.matrix);
    rotObjectMatrix2.multiplySelf(rotObjectMatrix1);
    body.rotation.setEulerFromRotationMatrix(rotObjectMatrix2);
}

// ----------------------------------------------------------------------------
// The Model
// ----------------------------------------------------------------------------

function computeShell(params) {

    // Read the user's parameter settings
    var growth = user2pacioli(params.growth.value, 1, 1);
    var offset_unit = params.offset_unit.value;
    var offset = user2pacioli(params.offset.value, offset_unit, 'metre');
    var upward_unit = params.upward_unit.value;
    var upward = user2pacioli(params.upward.value, upward_unit, 'metre');
    var outward_unit = params.outward_unit.value;
    var outward = user2pacioli(params.outward.value, outward_unit, 'metre');
    var scale = user2pacioli(params.scale.value, 1, 1);
    var orientation_unit = params.orientation_unit.value;
    var orientation = user2pacioli(params.orientation.value, orientation_unit, 'radian');
    var rotation_x_unit = params.rotation_x_unit.value;
    var rotation_x = user2pacioli(params.rotation_x.value, rotation_x_unit, 'radian');
    var rotation_y_unit = params.rotation_y_unit.value;
    var rotation_y = user2pacioli(params.rotation_y.value, rotation_y_unit, 'radian');
    var rotation_z_unit = params.rotation_z_unit.value;
    var rotation_z = user2pacioli(params.rotation_z.value, rotation_z_unit, 'radian');
    var ticks = user2pacioli(params.segments.value, 1, 1);

    // Read the aperture
    var pairs = params.aperture.value.split(',');
    var aperture_angle_unit = 'degree';
    var aperture_distance_unit = 'millimetre';
    if (pairs[0] == "circle") {
	var initial_aperture = _circle_path(user2pacioli(pairs[1], 1, 1),
	user2pacioli(pairs[2], aperture_distance_unit, 'metre'));
    } else if (pairs[0] == "rectangle") {
	var initial_aperture = _rectangle_path(user2pacioli(pairs[1], aperture_distance_unit, 'metre'),
	user2pacioli(pairs[2], aperture_distance_unit, 'metre'));
    } else {
	var initial_aperture = new Array();
	for (var i=0; i < pairs.length; i += 2) {
	    initial_aperture.push([user2pacioli(pairs[i], aperture_angle_unit, 'radian'),
	    user2pacioli(pairs[i+1], aperture_distance_unit, 'metre')]);
	}
    }

    // Compute the shells's segments
    return _shell_curves(initial_aperture,
			 _geom_vec(offset, [[0.0]], [[0.0]]),
			 _geom_vec(outward, [[0.0]], upward),
			 scale, orientation,
			 growth,
			 rotation_x, rotation_y, rotation_z,
			 ticks,
			 scaleFudge);
}

function shellInfo(shell, params) {

    function conv(x) {
	return pacioli2num(x, 1, 1);
    }

    function cumulative(data) {
	x = [];
	total = 0;
	for (var i = 0; i < data.length; i++) {
	    total = total + data[i];
	    x.push(total);
	}
	return x;
    }

    if (shell.info == undefined) {
	var body = shell.curves;
	var n = body.length;

	var body_area = _body_area_histogram(body).map(conv);
	var body_volume = _body_volume_histogram(body).map(conv);

	info = {
	    aperture_area: _aperture_area_histogram(body).map(conv),
	    body_area: body_area,
	    body_area_cumulative: cumulative(body_area),
	    body_volume: body_volume,
	    body_volume_cumulative: cumulative(body_volume),
	    growth_factor: _growth_factor_histogram([[params.growth.value]], [[n]]).map(conv)
	}

	shell.info = info
    }

    return shell.info;
}

// ----------------------------------------------------------------------------
// Graphical objects
// ----------------------------------------------------------------------------

function newBody(shell, graphics) {

    var body = new THREE.Object3D();

    // Create material used for each segment
    var material = graphics.material;
    var transparent = graphics.transparent;
    var props = {
	overdraw: !(graphics.webgl || graphics.wireframe || graphics.transparent),
	wireframe: graphics.wireframe,
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

    // Add the segments to the body
    for (var i = 0; i < shell.length-1; i++) {
	var m = new THREE.Mesh(segmentGeometry(shell[i], shell[i+1]), material);
	body.add(m);
	// The surface for volume and area computations:
	//var m = new THREE.Mesh(surfaceGeometry(_segment_closed_surface(shell[i], shell[i+1])), material);
	//body.add(m);
    }

    // Add lines for the apertures
    if (0 < shell.length) {
	body.add(newCurve(shell[shell.length-1]));
    }
    body.add(newCurve(shell[0]));

    return body;
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

function newAxes(n) {

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
    addLabel("x (mm)", 0.1, [n, 0, 0]);
    addLabel("y (mm)", 0.1, [0, 0, n]);
    addLabel("z (mm)", 0.1, [0, n, 0]);

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

// ----------------------------------------------------------------------------
// Event Handlers
// ----------------------------------------------------------------------------

function addEventHandlers(canvas) {
    canvas.addEventListener('mousedown', onDocumentMouseDown, false);
    canvas.addEventListener('mousemove', onDocumentMouseMove, false);
    canvas.addEventListener('mouseup', onDocumentMouseUp, false);
    canvas.addEventListener('mouseout', onDocumentMouseOut, false);
    canvas.addEventListener('keydown', onDocumentKeyDown, false);
    canvas.addEventListener('mousewheel', onMouseWheel, false);
    canvas.addEventListener('DOMMouseScroll', onMouseWheel, false);
    canvas.addEventListener('touchstart', onTouchStart, false);
    canvas.addEventListener('touchmove', onTouchMove, false);
    canvas.addEventListener('touchend', onTouchEnd, false);
    canvas.addEventListener('touchcancel', onTouchCancel, false);
    canvas.addEventListener('touchleave', onTouchLeave, false);
}

function onMouseWheel(event) {
    event.preventDefault();
    var data = event.wheelDelta || -event.detail;
    if (0 < Number(data)) {
      zoomIn();
    } else {
      zoomOut();
    }
}

function onDocumentKeyDown(event) {

    function handleArrow(moveX, moveY, rotateX, rotateY) {
	if (event.shiftKey && ! event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    moveCamera(moveX, moveY);
	} else if (! event.shiftKey && ! event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    rotateCamera(rotateX, rotateY);
	} else if (! event.shiftKey && event.ctrlKey && ! event.altKey) {
	    event.preventDefault();
	    rotateBody(rotateX, rotateY);
	}
	requestAnimationFrame(animate);
    }

    switch (event.which) {
	case 65: zoomIn(); break;
	case 83: zoomOut(); break;
	case 71: increaseSegments(); break;
	case 85: orientUp(); break;
	case 37: handleArrow(20, 0, 0.1, 0); break;
	case 38: handleArrow(0, 20, 0, -0.1); break;
	case 39: handleArrow(-20, 0, -0.1, 0); break;
	case 40: handleArrow(0, -20, 0, 0.1); break;
    }
}

function onDocumentMouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    circling = ! event.shiftKey && ! event.ctrlKey && ! event.altKey;
    rotating = ! event.shiftKey && event.ctrlKey && ! event.altKey;
    moving = event.shiftKey && ! event.ctrlKey && ! event.altKey;
    if (rotating || circling || moving) {
	event.preventDefault();
	animating = true;
	requestAnimationFrame(animate);
    }
    event.target.focus();
}

function onDocumentMouseMove(event) {

    // Calculate the movement
    var dx = lastX - event.clientX;
    var dy = lastY - event.clientY;

    // Adjust the view
    if (circling) rotateCamera(0.01 * dx,  -0.003 * dy);
    if (rotating) rotateBody(0.01 * dx, -0.003 * dy);
    if (moving) moveCamera(dx, dy);

    // Prevent default behavior
    if (rotating || circling || moving) event.preventDefault();

    // Update the last known position
    lastX = event.clientX;
    lastY = event.clientY;
}

function onDocumentMouseUp(event) {
    if (rotating || circling || moving) {
	event.preventDefault();
	animating = false;
	moving = false;
	rotating = false;
	circling = false;
    }
}

function onDocumentMouseOut(event) {
    if (rotating || circling || moving) {
	event.preventDefault();
	animating = false;
	moving = false;
	rotating = false;
	circling = false;
    }
}

function onTouchStart(event) {
    event.preventDefault();
    var touch = event.touches[0];
    lastX = touch.pageX;
    lastY = touch.pageY;
    moving = false;
    rotating = true;
    animating = true;
    requestAnimationFrame(animate);
    event.target.focus();
}

function onTouchMove(event) {
    event.preventDefault();
    var touch = event.touches[0];

    var dx = lastX - event.clientX;
    var dy = lastY - event.clientY;

    if (moving) moveCamera(dx, dy);
    if (rotating) rotateBody(0.01 * dx, -0.003 * dy);
    if (circling) rotateCamera(0.01 * dx, -0.003 * dy);

    lastX = touch.pageX;
    lastY = touch.pageY;
}

function onTouchEnd(event) {
    event.preventDefault();
    animating = false;
    moving = false;
    rotating = false;
    circling = false;
}

function onTouchCancel(event) {
    event.preventDefault();
    animating = false;
    moving = false;
    rotating = false;
    circling = false;
}

function onTouchLeave(event) {
    event.preventDefault();
    animating = false;
    moving = false;
    rotating = false;
    circling = false;
}

// ----------------------------------------------------------------------------
// Utilities
//
// segmentGeometry(curveFrom, curveTo)
//   A geometry object representing a segment outlined by a curve that moves
//   between two positions. Arguments curveFrom and curveTo must be equally
//   sized arrays of position vectors. The edges between corresponding positions
//   are face edges.
// ----------------------------------------------------------------------------

function pacioli2user(number, from, to) {
    return pacioli2num(number, from, to);
}

function user2pacioli(text, from, to) {
    return num2pacioli(Number(text), from, to);
}

function segmentGeometry(curveFrom, curveTo) {

    var geometry = new THREE.Geometry();
    var n = curveFrom.length;

    for (var i = 0; i < n; i++) {
	var from = curveFrom[i];
	var to = curveTo[i];
	geometry.vertices.push(new THREE.Vector3(from[0][0], from[2][0], from[1][0]));
	geometry.vertices.push(new THREE.Vector3(to[0][0], to[2][0], to[1][0]));
    }

    for (var i = 0; i < n-1; i++) {
	var offset = 2*i;
	geometry.faces.push(new THREE.Face4(offset, offset+1, offset+3, offset+2));
    }

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeCentroids();

    return geometry;
}


function surfaceGeometry(triangles) {

    var geometry = new THREE.Geometry();
    var n = triangles.length;

    for (var k = 0; k < n; k++) {
	var triangle = triangles[k];
	for (var i = 0; i < 3; i++) {
	    var position = triangle[i];
	    geometry.vertices.push(new THREE.Vector3(position[0][0], position[2][0], position[1][0]));
	}
	geometry.faces.push(new THREE.Face3(3*k, 3*k+1, 3*k+2));
    }

    geometry.mergeVertices();
    geometry.computeFaceNormals();
    geometry.computeCentroids();

    return geometry;
}

function newCurve(curve) {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: 0xaaaaaa, transparent: true, opacity:0.3});
    for (var i = 0; i < curve.length; i++) {
	var point = curve[i];
	geometry.vertices.push(new THREE.Vector3(point[0][0], point[2][0], point[1][0]));
    }
    return new THREE.Line(geometry, material);
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
