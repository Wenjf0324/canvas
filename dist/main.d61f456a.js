// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var brush = document.getElementById("brush");
var eraser = document.getElementById("eraser");
var save = document.getElementById("save");
var clear = document.getElementById("clear");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var eraserEnabled = false;
var painting = false;
var lastPoint; //设置画布的宽高为屏幕的宽高

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight; //检测是否支持触屏

var isTouchDevice = ("ontouchstart" in document.documentElement);

if (isTouchDevice) {
  canvas.ontouchstart = function (e) {
    //获取第一个触碰点
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;

    if (eraserEnabled) {
      ctx.clearRect(x - 15, y - 15, 30, 30);
    }

    lastPoint = [x, y];
  };

  canvas.ontouchmove = function (e) {
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;

    if (eraserEnabled) {
      ctx.clearRect(x - 15, y - 15, 30, 30);
    } else {
      drawLine(lastPoint[0], lastPoint[1], x, y);
    }

    lastPoint = [x, y]; //更新上一次的坐标点
  };
} else {
  canvas.onmousedown = function (e) {
    painting = true;
    var x = e.clientX;
    var y = e.clientY;

    if (eraserEnabled) {
      ctx.clearRect(x - 15, y - 15, 30, 30);
    }

    lastPoint = [x, y]; //初始化lastPoint
  };

  canvas.onmousemove = function (e) {
    var x = e.clientX;
    var y = e.clientY;

    if (painting) {
      if (eraserEnabled) {
        ctx.clearRect(x - 15, y - 15, 30, 30);
      } else {
        drawLine(lastPoint[0], lastPoint[1], x, y);
      }

      lastPoint = [x, y]; //更新上一次的坐标点
    }
  };

  canvas.onmouseup = function () {
    painting = false;
  };
} //画线函数


function drawLine(x1, y1, x2, y2) {
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
} //点击画笔


brush.onclick = function () {
  eraserEnabled = false;
  brush.classList.add("active");
  eraser.classList.remove("active");
}; //点击橡皮擦


eraser.onclick = function () {
  eraserEnabled = true;
  eraser.classList.add("active");
  brush.classList.remove("active");
}; //点击保存


save.onclick = function () {
  var imgUrl = canvas.toDataURL("image/png");
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.href = imgUrl;
  a.download = "mypic" + new Date().getTime();
  a.target = "_blank";
  a.click();
}; //点击清屏


clear.onclick = function () {
  ctx.fillStyle = "#cdedba";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}; //选择画笔颜色


var events = {
  ".black": "black",
  ".red": "red",
  ".yellow": "yellow",
  ".green": "green",
  ".blue": "blue"
};

function selectColor() {
  var _loop = function _loop(key) {
    if (events.hasOwnProperty(key)) {
      document.querySelector(key).onclick = function () {
        eraserEnabled = false;
        ctx.strokeStyle = events[key];
        brush.classList.add("active");
        eraser.classList.remove("active");
        var colorList = this.parentNode.children;

        for (var i = 0; i < colorList.length; i++) {
          colorList[i].classList.remove("selected");
        }

        this.classList.add("selected");
      };
    }
  };

  for (var key in events) {
    _loop(key);
  }
}

selectColor();
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.d61f456a.js.map