pulse.ready(function() {

   var engine = new pulse.Engine( { gameWindow: 'game-window', size: { width: 640, height: 480 } } );

   var scene = new pulse.Scene();

   var layer = new pulse.Layer();
   layer.anchor = { x: 0, y: 0 };

   scene.addLayer(layer);
   engine.scenes.addScene(scene);

   engine.scenes.activateScene(scene);

   // Add 5 balls
   for(var i = 0; i < 5; i++) {
      var ball = new Ball();
      ball.position = { x: 100, y: 100 };
      layer.addNode(ball);
   }

   var label = new pulse.CanvasLabel( { text: 'Click to add more balls', fontSize: 12 });
   label.position = { x: 100, y: 20 };
   layer.addNode(label);

   layer.events.bind('mousedown', function(args) {
      var ball = new Ball();
      ball.position = { x: args.position.x, y: args.position.y };
      layer.addNode(ball);
   });

   var count = 0;

   engine.go(30, function() {
      /*
      count++;
      if(count > 2) {
         var ball = new Ball();
         ball.position = { x: 100, y: 100 };
         layer.addNode(ball);
         count = 0;
      }
      */
   });

});