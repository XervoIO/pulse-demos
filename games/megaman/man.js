// Namespace declaration
var mm = mm || {};

/**
 * Megaman class that handles moving and animating the man
 */
mm.Megaman = pulse.Sprite.extend({
  /**
   * Initializes the man
   * @param  {object} params parameters for the man
   */
  init : function(params) {
    if(!params) {
      params = {};
    }

    // Specify a position offset - we want megaman to
    // overload the ground a little.
    params.physics = { 
      positionOffset  : { x: 0, y: -5 }
    };

    params.src = mm.Megaman.texture;

    this._super(params);

    this.size = {
      width : 55,
      height : 60
    };

    // Override some physical properties.
    this._physics.bodyDef.fixedRotation = true;
    this._physics.bodyDef.allowSleep = true;
    this._physics.fixDef.restitution = 0;

    this._physics.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    this._physics.fixDef.shape.SetAsBox(
      (this.size.width - 15) / 2 * pulse.physics.FACTOR,
      (this.size.height - 15) / 2 * pulse.physics.FACTOR);

    this.position = {
      x : params.position.x || 0,
      y : params.position.y || 0
    };

    // Set a frame rate for animations
    var animationFrameRate = 20;
    var _self = this;

    this.textureFrame.width = 55;
    this.textureFrame.height = 60;

    // Save the original frame
    this._private.oframe = {
      x: 0,
      y: 0,
      width : 55,
      height : 60
    };

    //Init states
    this.state = mm.Megaman.State.Idle;
    this._private.statePrevious = mm.Megaman.State.Idle;

    this.direction = mm.Megaman.Direction.Right;
    this._private.directionPrevious = mm.Megaman.Direction.Right;

    // Create animation for the beaming in intro
    var introAction = new pulse.AnimateAction({
      name : 'intro',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [22,22,22,22,22,22,22,22,22,22,22,23,24,25,26,27,28,29],
      frameRate : animationFrameRate,
      plays : 1
    });
    
    // When animation is complete set state back to Idle
    introAction.events.bind('complete', function(){
      _self.state = mm.Megaman.State.Idle;
    });

    // Add the animation
    this.addAction(introAction);

    // Create animation for running
    var runningAction = new pulse.AnimateAction({
      name : 'running',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [7,8,9,10,11,12,13,14,15,16],
      frameRate : animationFrameRate
    });

    // Add the animation
    this.addAction(runningAction);

    // Create animation for jumping
    var jumpAction = new pulse.AnimateAction({
      name : 'jumping',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [17,18,19,20,21],
      frameRate : animationFrameRate,
      plays : 1
    });

    // Add the animation
    this.addAction(jumpAction);

    // Create animation for the head twitch smile thingy
    var smileAction = new pulse.AnimateAction({
      name : 'smile',
      size : {width:55, height:60},
      bounds : {x: 2000, y: 60},
      frames : [1,2,3,4,5,6],
      frameRate : animationFrameRate,
      plays : 1
    });

    // When animation is complete set state back to Idle
    smileAction.events.bind('complete', function(){
      _self.state = mm.Megaman.State.Idle;
    });

    // Add the animation
    this.addAction(smileAction);
  },

  /**
   * Resets all animations on the man
   */
  reset : function() {
    for(var n in this.runningActions) {
      this.runningActions[n].stop();
    }
  },

  /**
   * Update function that runs on every update loop, we updated positions and
   * check for any change in state to react to it
   * @param  {number} elapsed the time elapsed since last update
   */
  update : function(elapsed) {

    // If the man is jumping make sure the correct state is set
    if(this._physics.body.GetLinearVelocity().y > 0.01 ||
       this._physics.body.GetLinearVelocity().y < -0.01) {
      if(this.state != mm.Megaman.State.Intro) {
        this.state = mm.Megaman.State.Jumping;
      }
    } else {
      // Jump complete or wasn't jumping, check if was jumping and update
      // state accordingly
      this._physics.body.SetLinearVelocity(
        new Box2D.Common.Math.b2Vec2(this._physics.body.GetLinearVelocity().x, 0)
      );
      if(this.state == mm.Megaman.State.Jumping) {
        this.state = mm.Megaman.State.Idle;
      }
    }

    // Check if man has changed state
    if(this.state != this._private.statePrevious) {
      this.updateState(this.state);
      this._private.statePrevious = this.state;
    }

    // Check if man is pointed in a new direction
    if(this.direction != this._private.directionPrevious) {
      this.scale.x = this.direction;
      this._private.directionPrevious = this.direction;
    }

    this._super(elapsed);
  },

  /**
   * Updating animations based on change in state
   * @param  {string} state The new state
   */
  updateState : function(state) {
    this.reset();

    switch(state) {
      case mm.Megaman.State.Idle:
        this.textureFrame = this._private.oframe;
        this.updated = true;
        break;
      case mm.Megaman.State.Intro:
        this.runAction('intro', this._private.oframe);
        break;
      case mm.Megaman.State.Running:
        this.runAction('running', this._private.oframe);
        break;
      case mm.Megaman.State.Jumping:
        this.runAction('jumping');
        break;
      case mm.Megaman.State.Smile:
        this.runAction('smile', this._private.oframe);
        break;
    }
  }

});

// Static member to hold possible states
mm.Megaman.State = {};
mm.Megaman.State.Idle = 'idle';
mm.Megaman.State.Intro = 'intro';
mm.Megaman.State.Running = 'running';
mm.Megaman.State.Jumping = 'jumping';
mm.Megaman.State.Smile = 'smiling';

// Static member to hold possible directions
mm.Megaman.Direction = {};
mm.Megaman.Direction.Right = 1;
mm.Megaman.Direction.Left = -1;

// Static member to hold texture atlas for the man
mm.Megaman.texture = new pulse.Texture({filename: 'man.png'});