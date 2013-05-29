// Namespace declaration
var mm = mm || { };

/**
 * Pulse ready callback, makes sure the HTML content is loaded before starting
 * the game.
 */
pulse.ready(function() {
  pulse.physics.friction = 0.0;
  pulse.physics.restitution = 0.0;
  pulse.physics.WORLD.SetGravity(new Box2D.Common.Math.b2Vec2(0, 7));

  // The base engine object for this demo with passed in id of game div
  var engine = new pulse.Engine({
    gameWindow: 'gameWindow', size: {width: 600, height: 400}
  });

  // The main scene for the demo
  var scene = new pulse.Scene();

  // Parallax background layers
  var bg1 = new pulse.Layer({
    size: { width: 6000, height: 300 },
    physics : { isEnabled: false }
  });
  bg1.anchor = { x: 0, y: 0 };
  bg1.position.y = 250;

  var bg2 = new pulse.Layer({
    size: { width: 6000, height: 600 },
    physics : { isEnabled: false }
  });
  bg2.anchor = { x: 0, y: 0 };
  bg2.position.y = -200;

  // Level layer object extends from layer see layer.js
  var level = new mm.Level({
    size: {width: 6000, height: 800},
    physics : { isEnabled: false }
  });
  level.anchor = { x: 0, y: 0 };
  level.position.y = -400;

  /**
   * The mm layer, he's on a seperate layer so we don't redraw everything
   * when he moves
   */
  var manLayer = new pulse.Layer({
    size: {width: 6000, height: 800},
    physics : { isEnabled: false }
  });
  manLayer.anchor = { x: 0, y: 0 };
  manLayer.position.y = -400;

  // Layer for the UI, text
  var uiLayer = new pulse.Layer({
    size: {width : 600, height: 400},
    physics : { isEnabled: false }
  });
  uiLayer.position = {x: 300, y: 200};

  // Texture for the mountain and for the clouds
  var bg1Texture = new pulse.Texture( { filename: 'mountain.png' });
  var bg2Texture = new pulse.Texture( { filename: 'clouds.png' });

  // Add 10 sprites to the background for multiple mountains and clouds
  for(var i = 0; i < 10; i++) {
    var bgTile = new pulse.Sprite({
      src: bg1Texture,
      physics : { isEnabled: false }
    });
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 700 * i - 1;
    
    bg1.addNode(bgTile);
    
    bgTile = new pulse.Sprite({
      src: bg2Texture,
      physics : { isEnabled: false }
    });
    bgTile.anchor = { x: 0, y: 0 };
    bgTile.position.x = 600 * i;
    
    bg2.addNode(bgTile);
  }

  // The man, along with initalized position
  var man = new mm.Megaman({
    position : {x : 75,y : 550},
  });

  manLayer.addNode(man);

  var debugLayer = new pulse.Layer({
    name: 'Debug_Layer',
    size: { width: 6000, height: 800 }
  });

  debugLayer.anchor = { x: 0, y: 0 };
  debugLayer.position = { x: 0, y: -400 };

  // Add the layers to our scene
  scene.addLayer(bg2);
  scene.addLayer(bg1);
  scene.addLayer(level);
  scene.addLayer(manLayer);
  scene.addLayer(uiLayer);
  scene.addLayer(debugLayer);

  var debugDraw = new Box2D.Dynamics.b2DebugDraw();
  debugDraw.SetSprite(debugLayer.canvas.getContext('2d'));
  debugDraw.SetDrawScale(100);
  debugDraw.SetFillAlpha(0.3);
  debugDraw.SetLineThickness(1.0);
  debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
  
  // Uncomment to enable physics debug drawing. (1 of 2)
  //pulse.physics.WORLD.SetDebugDraw(debugDraw);

  // Add the scene to the engine scene manager and activate it
  engine.scenes.addScene(scene);
  engine.scenes.activateScene(scene);

  var arrowLeft = false;
  var arrowRight = false;
  var arrowUp = false;
  var arrowDown = false;

  var speed = 0.15;

  /**
   * Updates the camera and parallax backgrounds based on position of man
   */
  function updateCamera() {

    var nx = 300 - Math.max(man.position.x, 300);
    var dx = level.position.x - nx;
    var ny = 200 - Math.min(man.position.y, 600);
    var dy = level.position.y - ny;

    level.position.x -= dx;
    manLayer.position.x -= dx;
    bg1.position.x -= dx / 2;
    bg2.position.x -= dx / 3;

    level.position.y -= dy;
    manLayer.position.y -= dy;
    bg1.position.y -= dy / 2;
    bg2.position.y -= dy / 3;

    debugLayer.position.x -= dx;
    debugLayer.position.y -= dy;
  }

  /**
   * Update callback from engine on each update loop
   * @param  {pulse.SceneManager} sceneManager scene manager for the engine
   * @param  {Number} elapsed the time since last update loop
   */
  function update(sceneManager, elapsed) {
    
    // update the Box2D physics world
    //world.Step(elapsed / 1000, 10);

    // Uncomment to enable physics debug drawing. (2 of 2)
    //pulse.physics.WORLD.DrawDebugData();
    
    /**
     * If the left arrow is down update the state of the man if needed
     */
    if(arrowLeft) {
      if(man.direction == mm.Megaman.Direction.Right) {
        man.direction = mm.Megaman.Direction.Left;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }

      // Box2d wake up call
      man._physics.body.SetAwake(true);

      // Gives the man a linear velocity in the direction on the move
      man._physics.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(-2, man._physics.body.GetLinearVelocity().y));
    }
    
    /**
     * If the right arrow is down update the state of the man if needed
     */
    if(arrowRight) {
      if(man.direction == mm.Megaman.Direction.Left) {
        man.direction = mm.Megaman.Direction.Right;
      }
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Running;
      }

      // Box2d wake up call
      man._physics.body.SetAwake(true);

      // Gives the man a linear velocity in the direction on the move
      man._physics.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(2, man._physics.body.GetLinearVelocity().y));
    }

    // Update the camera based on the position of the man
    updateCamera();

    // If the man has fallen to his dealth reset set him
    if(man.position.y > 2000) {
      // Box2d wake up call
      man._physics.body.SetAwake(true);

      // Set position and remove any linear velocity
      man._physics.body.SetPositionAndAngle(
        new Box2D.Common.Math.b2Vec2(50 * pulse.physics.FACTOR, 600 * pulse.physics.FACTOR), 0.0
      );

      //man.position = {x : 50,y : 650};
      man._physics.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, 0));

      // Set the man's state to beam him in
      man.state = mm.Megaman.State.Intro;
    }

    // If no arrow button is pressed than set the man to Idle
    if(!arrowLeft && !arrowRight) {
      if(man.state == mm.Megaman.State.Running) {
        man.state = mm.Megaman.State.Idle;
      }
    }
  }

  /**
   * Binds the key down event on this scene
   * We keep the state of the button in side the handler
   */
  scene.events.bind('keydown', function(e) {
    if(e.keyCode == 37) {
      arrowLeft = true;
    }
    if(e.keyCode == 39) {
      arrowRight = true;
    }
    if(e.keyCode == 38) {
      arrowUp = true;
    }
    if(e.keyCode == 40) {
      arrowDown = true;
    }
    // Special cases
    if(e.keyCode == 13) {
      man.state = mm.Megaman.State.Intro;
    }
    if(e.keyCode == 73) {
      man.state = mm.Megaman.State.Idle;
    }
    if(e.keyCode == 83) {
      man.state = mm.Megaman.State.Smile;
    }
    // Jump with space key
    if(e.keyCode == 32) {
      if(man.state != mm.Megaman.State.Jumping) {
        man.state = mm.Megaman.State.Jumping;
        // Apply an impulse in Box2D
        man._physics.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(0, -0.8), man._physics.body.GetPosition());
      }
    }
  });

  /**
   * Update the state of the keys
   */
  scene.events.bind('keyup', function(e) {
    if(e.keyCode == 37) {
      man._physics.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, man._physics.body.GetLinearVelocity().y));
      arrowLeft = false;
    }
    if(e.keyCode == 39) {
      man._physics.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(0, man._physics.body.GetLinearVelocity().y));
      arrowRight = false;
    }
    if(e.keyCode == 38) {
      arrowUp = false;
    }
    if(e.keyCode == 40) {
      arrowDown = false;
    }
  });

  // Start the game engine and tell it run at 50fps if possible
  engine.go(30, update);
});