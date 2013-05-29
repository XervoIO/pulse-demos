// Namespace declaration
var mm = mm || {};

/**
 * Platform brick class that handles placement, size and texture
 */
mm.Brick = pulse.Sprite.extend({
  /**
   * Initializes the brick
   * @param  {pulse.Texture} texture The texture to use for the brick
   * @param  {pulse.Layer} layer The layer the brick should be added to
   */
  init: function(texture, layer) {
    this.layer = layer;
    this._super({
      src: texture,
      physics: {
        isEnabled: false
      }
    });
    this.size = {
      width: mm.Brick.Size.width,
      height: mm.Brick.Size.height
    };
  }
});

// Creating brick textures and setting them to static members
mm.Brick.GroundTextureLeft = new pulse.Texture( { filename: 'brick_ground_left.png'} );
mm.Brick.GroundTextureRight = new pulse.Texture( { filename: 'brick_ground_right.png'} );
mm.Brick.PlatformTexture = new pulse.Texture( { filename: 'brick_platform.png'} );
mm.Brick.PlatformTextureLeft = new pulse.Texture( { filename: 'brick_platform_left.png'} );
mm.Brick.PlatformTextureRight = new pulse.Texture( { filename: 'brick_platform_right.png'} );
mm.Brick.GroundTexture = new pulse.Texture( { filename: 'brick_ground.png'} );
mm.Brick.GroundTopTexture = new pulse.Texture( { filename: 'ground_top.png'} );

// Setting the size for bricks as a static member
mm.Brick.Size = { width: 25, height: 25 };

/**
 * Level class that handles creating the platforms and ground chunks
 * @class Level
 */
mm.Level = pulse.Layer.extend({
  /**
   * Initializes the level based off of mm.Level.Layout
   * @param  {object} params parameter object
   * @config {b2World} world Box2D world
   */
  init: function(params) {
    this._super(params);
    
    for(var idx in mm.Level.Layout) {
      // Platform
      if(mm.Level.Layout[idx].p) {
        var platform = new mm.Platform(mm.Level.Layout[idx].p, this);
      }
      // Chunk
      else if(mm.Level.Layout[idx].c) {
        var chunk = new mm.Chunk(mm.Level.Layout[idx].c, this);
      }
    }
  }
});

/**
 * Static function for creating a platforms
 * @param  {object} params parameter object
 * @config {number} size The size, width and height, of the platform to create
 * @config {number} x The x position to start the platform
 * @config {number} y the y position to start the platform
 * @param {pulse.Layer} layer The layer to add the platform to
 */
mm.Platform = function(params, layer) {

  var startPos;
  var endPos;

  // loop through the width of the platform
  for(var i = 0; i < params.size.width; i++) {

    // determine the texture based on the position in the platform
    var texture = mm.Brick.PlatformTexture;
    if(i === 0) {
      texture = mm.Brick.PlatformTextureLeft;
    }
    else if (i == params.size.width - 1) {
      texture = mm.Brick.PlatformTextureRight;
    }
    
    // create a brick and set its position
    var brick = new mm.Brick(texture, layer);

    brick.position.x =
      (mm.Brick.Size.width - 1) * params.x + i *
      (mm.Brick.Size.width - 1);

    brick.position.y = layer.size.height -
      ((mm.Brick.Size.height) * params.y) -
      (mm.Brick.Size.height / 2);

    if(i === 0)
      startPos = brick.position;

    endPos = brick.position;

    // add the brick to the layer
    layer.addNode(brick);
  }

  // Create a dummy sprite for physics.
  var physicsSprite = new pulse.Sprite({
    src: 'blank.png',
    physics: {
      isStatic: true
    },
    size: { 
      width: (endPos.x - startPos.x) + mm.Brick.Size.width,
      height: mm.Brick.Size.height
    }
  });

  physicsSprite.position = {
    x: (startPos.x) + ((endPos.x - startPos.x) / 2),
    y: startPos.y
  };

  layer.addNode(physicsSprite);
};

/**
 * Static function for creating a chunk of land
 * @param  {object} params parameter object
 * @config {number} width The width of the chunk to create
 * @config {number} height The height of the chunk to create
 * @config {number} x The x position to start the chunk
 * @config {number} y the y position to start the chunk
 * @param {pulse.Layer} layer The layer to add the chunk to
 */
mm.Chunk = function(params, layer) {
  // Loop through the width and height of the chunk to create all the bricks
  for(var rowIdx = 0; rowIdx < params.size.width; rowIdx++) {
    for(var colIdx = 0; colIdx < params.size.height; colIdx++) {

      // Determine if the brick is on the top layer of the chunk
      var top = colIdx == params.size.height - 1;

      // Determine the texture based on location of the brick
      var texture = mm.Brick.GroundTexture;
      if(top) {
        texture = mm.Brick.GroundTopTexture;
      }
      else if(rowIdx === 0) {
        texture = mm.Brick.GroundTextureLeft;
      }
      else if(rowIdx == params.size.width - 1) {
        texture = mm.Brick.GroundTextureRight;
      }

      // Create new brick and set its position
      var brick = new mm.Brick(texture, layer);
      brick._physics.fixDef.restitution = 0;
      
      brick.position.y =
        layer.size.height -
        colIdx * mm.Brick.Size.height + colIdx;

      brick.position.x =
        (mm.Brick.Size.width - 1) *
        (params.x + rowIdx);


      // Add the brick to the layer
      layer.addNode(brick);
    }
  }

  // Create a dummy sprite for physics.
  var physicsSprite = new pulse.Sprite({
    src: 'blank.png',
    physics: {
      isStatic: true
    },
    size: { 
      width: params.size.width * mm.Brick.Size.width - params.size.width,
      height: params.size.height * mm.Brick.Size.height - params.size.height
    }
  });

  physicsSprite.position = {
    x: params.x * mm.Brick.Size.width - params.x + (physicsSprite.size.width / 2) - mm.Brick.Size.width / 2,
    y: layer.size.height - physicsSprite.size.height / 2 + mm.Brick.Size.height / 2
  };

  layer.addNode(physicsSprite);
};

/**
 * Static list of the layout for the level for the demo
 * @type {Array}
 */
mm.Level.Layout = [
 // Chunks - the ground
 { c: { size: {width: 12, height: 2}, x: 0}}, // A
 { c: { size: {width: 4, height: 2}, x: 16}}, // B
 { c: { size: {width: 4, height: 3}, x: 20}}, // C
 { c: { size: {width: 4, height: 9}, x: 24}}, // D
 { c: { size: {width: 4, height: 4}, x: 30}}, // E
 { c: { size: {width: 4, height: 3}, x: 34}}, // F
 { c: { size: {width: 4, height: 2}, x: 38}}, // G
 { c: { size: {width: 4, height: 15}, x: 60}}, // H
 { c: { size: {width: 6, height: 17}, x: 64}}, // I
 { c: { size: {width: 4, height: 13}, x: 70}}, // J
 { c: { size: {width: 30, height: 2}, x: 96}}, // K
 { c: { size: {width: 8, height: 23}, x: 138}}, // L
 
 
 // Platforms
 { p: { size: {width: 4}, x: 6, y: 5}},    // a
 { p: { size: {width: 2}, x: 13, y: 7}},   // b
 { p: { size: {width: 2}, x: 19, y: 6}},   // c
 { p: { size: {width: 4}, x: 46, y: 4}},   // d
 { p: { size: {width: 4}, x: 53, y: 6}},   // e
 { p: { size: {width: 4}, x: 46, y: 9}},   // f
 { p: { size: {width: 2}, x: 50, y: 13}},  // g
 { p: { size: {width: 2}, x: 56, y: 16}},  // h
 { p: { size: {width: 2}, x: 34, y: 7}},   // i
 { p: { size: {width: 2}, x: 82, y: 11}},  // j
 { p: { size: {width: 2}, x: 90, y: 5}},   // k
 { p: { size: {width: 2}, x: 86, y: 8}},   // l
 { p: { size: {width: 4}, x: 128, y: 5}},   // m
 { p: { size: {width: 4}, x: 120, y: 9}},   // n
 { p: { size: {width: 4}, x: 112, y: 13}},   // o
 { p: { size: {width: 4}, x: 120, y: 17}},   // p
 { p: { size: {width: 4}, x: 128, y: 21}}   // q
];