pulse.ready(function() {
   
   var engine = new pulse.Engine( { gameWindow: 'game-window', size: { width: 640, height: 480 } });

   var scene = new pulse.Scene();

   var layer = new pulse.Layer( { physics : { isEnabled: false }});
   layer.anchor = { x: 0, y: 0 };

   //
   // Setup the walls.
   //
   var bottom = new pulse.Sprite( {
      src: 'block.png',
      physics: {
         basicShape : 'box',
         isStatic : true
      },
      size : { width: 640, height: 16 }
   });

   var leftSide = new pulse.Sprite( {
      src: 'block.png',
      physics: {
         basicShape: 'box',
         isStatic: true
      },
      size: { width: 16, height: 200 }
   });

   var rightSide = new pulse.Sprite( {
      src: 'block.png',
      physics: {
         basicShape: 'box',
         isStatic: true
      },
      size: { width: 16, height: 200 }
   });

   leftSide.position = { x: 20, y: 400 };
   rightSide.position = { x: 620, y: 400 };
   bottom.position = { x: 320, y: 460 };

   layer.addNode(bottom);
   layer.addNode(leftSide);
   layer.addNode(rightSide);

   // Add a few pieces so they fall when the app is first loaded.
   var convexToRemove = createConvex({ x: 300, y: 0 });

   layer.addNode(createCircle({ x: 103, y: 75 }));
   layer.addNode(createBox({ x: 100, y: 50 }));
   layer.addNode(convexToRemove);
   layer.addNode(createCircle({ x: 300, y: -100 }));

   scene.addLayer(layer);
   engine.scenes.addScene(scene);
   engine.scenes.activateScene(scene);

   var typeDropdown = document.getElementById('shape-type');

   // When the user clicks, add a new shape based on the dropdown selection.
   layer.on('mouseup', function(args) {

      if(typeDropdown.selectedIndex === 0) {
         layer.addNode(createBox(args.position));
      }
      else if(typeDropdown.selectedIndex === 1) {
         layer.addNode(createCircle(args.position));
      }
      else if(typeDropdown.selectedIndex === 2) {
         layer.addNode(createConvex(args.position));
      }
   });

   engine.go(30);
});

var createBox = function(pos) {
   var box = new pulse.Sprite({ 
      src: 'box.png',
      size: { width: 40, height: 40 },
      physics: {
         basicShape : 'box'
      }
   });

   box.position = { x: pos.x, y: pos.y };

   return box;
};

var createCircle = function(pos) {
   var circle = new pulse.Sprite({
      src: 'ball.png',
      size: { width: 24, height: 24 },
      physics: {
         basicShape : 'circle'
      }
   });

   circle.position = { x: pos.x, y: pos.y };

   return circle;
};

var createConvex = function(pos) {

   // Create a custom fixture to hold the custom shape.
   var fixDef = new Box2D.Dynamics.b2FixtureDef();
   fixDef.density = pulse.physics.density;
   fixDef.friction = pulse.physics.friction;
   fixDef.restitution = pulse.physics.restitution;

   // Define the shape as a polygon.
   fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();

   // Define the points in clockwise order relative to the center of the object.
   var points = [
      { x: -42, y: -14 },
      { x: -19, y: -42 },
      { x: 20, y: -40 },
      { x: 33, y: -18 },
      { x: 41, y: 32 },
      { x: 10, y: 41 },
      { x: -39, y: 13 }
   ];

   // Convert the points to an array of b2Vec2 objects.
   var vecs = [];
   for(var i = 0; i < 7; i++) {
      var point = new Box2D.Common.Math.b2Vec2();

      // Multiply the positions by the physics factor.
      // Pulse and Box2D use different units of measurement.  Box2D
      // expects numbers much smaller than pixel dimensions.
      point.Set(
         points[i].x * pulse.physics.FACTOR,
         points[i].y * pulse.physics.FACTOR);

      vecs.push(point);
   }

   // Assign the points to the shape.
   fixDef.shape.SetAsArray(vecs, vecs.length);

   // Create the sprite.
   var convex = new pulse.Sprite({ 
      src: 'shape.png', 
      size: { width: 84, height: 84 },
      physics: {
         fixDef : fixDef
      }
   });
   convex.position = { x: pos.x, y: pos.y };

   return convex;
};




