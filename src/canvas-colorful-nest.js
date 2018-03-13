/**
 * Copyright (c) 2018 Chaoticvirus
 * GitHub: https://github.com/Chaoticvirus
**/

! function() {

    function get_attribute(node, attr, default_value) {
        return node.getAttribute(attr) || default_value;
    }

    function get_by_tagname(name) {
        return document.getElementsByTagName(name);
    }

    // Get configuration
    function get_config_option() {
        var scripts = get_by_tagname("script"),
        script_len = scripts.length,
        script = scripts[script_len - 1];
        return {
            z: get_attribute(script, "zIndex", -1), //z-index
            o: get_attribute(script, "opacity", 0.15), //opacity
            n: get_attribute(script, "count", 150), //count
            s: get_attribute(script, "speed", 0.8), //speed
            l: get_attribute(script, "lines", 3), //lines
        };
    }

    // Set canvas width/height
    function set_canvas_size() {
        canvas_width = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, 
        canvas_height = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    function ascend(x,y){
      return x[1] - y[1];
    }
  
    function draw_canvas() {
      // Clear the canvas for redrawing
      context.clearRect(0, 0, canvas_width, canvas_height);
      var e, i, d, x_dist, y_dist, dist, hue = 0;
      // Array.forEach(function(item,index){...}[,target_function ]);
      random_points.forEach(function(r, idx) {
        speed = config.s,
        lines = config.l,
        points = [],
        // Move
        r.x += r.xa * speed,
        r.y += r.ya * speed,
        // Out of border will rebound
        r.xa *= r.x > canvas_width || r.x < 0 ? -1 : 1, 
        r.ya *= r.y > canvas_height || r.y < 0 ? -1 : 1,
        // Draw a point with size (1,1)
        context.fillRect(r.x - 0.5, r.y - 0.5, 1, 1);
        for (i = 0; i < all_array.length; i++) {
          e = all_array[i];
          if (null !== e.x && null !== e.y && i !== idx) {
            x_dist = r.x - e.x;
            y_dist = r.y - e.y;
            dist = Math.sqrt(x_dist * x_dist + y_dist * y_dist);
            dist < e.max && (points.push([i,dist]));
          }
        }
        as_points = points.sort(ascend);
        j = lines > as_points.length ? as_points.length : lines;
        context.beginPath();
        for (i = 0; i < j; i++) {
          e = all_array[as_points[i][0]],
          d = (e.max - as_points[i][1]) / e.max,
          e === current_point && dist >= e.max / 2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist), // cursor event
          context.strokeStyle = 'hsl('+ hue +', 100%, 65%)',
          context.lineWidth = e === current_point ? (d * 2.5) : (d / 2),
          context.moveTo(r.x, r.y),
          context.lineTo(e.x, e.y),
          context.stroke()
        }
        hue = hue > 360 ? 0 : (hue + 100);
      }), frame_func(draw_canvas);
    }

    // Add a canvas to html body
    var the_canvas = document.createElement("canvas"),
    config = get_config_option(),
    canvas_id = "canvas-colorful-nest", //canvas id
    context = the_canvas.getContext("2d"),
    canvas_width,
    canvas_height,
    frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame
    || function(func) {
        window.setTimeout(func, 1000 / 60);
    }, 
    random = Math.random,
    current_point = {
        x: null,
        y: null,
        max: 500 // radius for cursor to trigger event
    },
    all_array;
    the_canvas.id = canvas_id;
    the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
    get_by_tagname("body")[0].appendChild(the_canvas);
  
    // Init canvas
    set_canvas_size();
    // After the window size changes, it will trigger the resize event
    window.onresize = set_canvas_size
    // Get the current cursor position while moving on window
    window.onmousemove = function(e) {
      e = e || window.event;
      current_point.x = e.clientX;
      current_point.y = e.clientY;
    },
    // Clear the current position while the cursor out of the window
    window.onmouseout = function() {
      current_point.x = null;
      current_point.y = null;
    };
    // Init points
    for (var random_points = [], i = 0; config.n > i; i++) {
      // Set random position
      var x = random() * canvas_width,
      y = random() * canvas_height,
      // Set random direction
      xa = 2 * random() - 1,
      ya = 2 * random() - 1;
      random_points.push({
        x: x,
        y: y,
        xa: xa,
        ya: ya,
        max: 500 //Line maximum length
      });
    }
    all_array = random_points.concat([current_point]);
    frame_func(draw_canvas);
  }();
