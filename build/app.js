(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));
var App = (function () {
    function App() {
        var _this = this;
        this.speed = 4;
        this.length = 1;
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.cellSize = Math.round(this.width / 20);
        if (!Number.isInteger(this.canvas.width / this.cellSize)) {
            throw new Error('Canvas width is not divisible by cell size');
        }
        else if (!Number.isInteger(this.canvas.height / this.cellSize)) {
            throw new Error('Canvas height is not divisible by cell size');
        }
        // Initialize segments
        this.reset();
        // Set up controls
        document.addEventListener('keydown', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var previousDirection = _this.segments[0].direction;
            switch (event.key) {
                case 'ArrowUp':
                    _this.segments[0].direction = Direction.UP;
                    break;
                case 'ArrowDown':
                    _this.segments[0].direction = Direction.DOWN;
                    break;
                case 'ArrowLeft':
                    _this.segments[0].direction = Direction.LEFT;
                    break;
                case 'ArrowRight':
                    _this.segments[0].direction = Direction.RIGHT;
                    break;
            }
            if (_this.segments[0].direction !== previousDirection) {
                _this.turningPoints.push(__assign({}, _this.segments[0]));
            }
        });
        // Start game loop
        var interval = setInterval(function () {
            _this.tick();
            _this.draw();
        }, 1000 / this.speed);
        this.draw();
    }
    App.prototype.reset = function () {
        this.segments = [{
                direction: Direction.LEFT,
                x: this.width - this.cellSize,
                y: 0
            }];
        this.turningPoints = [];
        this.dropFood();
    };
    App.prototype.grow = function (count) {
        for (var i = 0; i < count; i++) {
            var newSegment = __assign({}, this.segments[this.segments.length - 1]);
            newSegment.delay = i + 1;
            this.segments.push(newSegment);
        }
    };
    App.prototype.dropFood = function () {
        this.food = {
            x: Math.round(Math.random() * ((this.width - this.cellSize) / this.cellSize)) * this.cellSize,
            y: Math.round(Math.random() * ((this.height - this.cellSize) / this.cellSize)) * this.cellSize
        };
    };
    App.prototype.tick = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var segment = this_1.segments[i];
            if (segment.delay && segment.delay > 0) {
                segment.delay--;
                return "continue";
            }
            var turningPoint = this_1.turningPoints.filter(function (value) {
                if (value.x === segment.x && value.y === segment.y) {
                    return true;
                }
                return false;
            })[0];
            if (turningPoint) {
                segment.direction = turningPoint.direction;
                // Remove first turning point when the last segment passes over it
                if (i === this_1.segments.length - 1) {
                    this_1.turningPoints.shift();
                }
            }
            // Move the segment in current direction
            switch (segment.direction) {
                case Direction.UP:
                    segment.y -= this_1.cellSize;
                    break;
                case Direction.DOWN:
                    segment.y += this_1.cellSize;
                    break;
                case Direction.LEFT:
                    segment.x -= this_1.cellSize;
                    break;
                case Direction.RIGHT:
                    segment.x += this_1.cellSize;
                    break;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.segments.length; i++) {
            _loop_1(i);
        }
        // Check for fail state
        if (this.segments[0].x < 0
            || this.segments[0].x > this.width - this.cellSize
            || this.segments[0].y < 0
            || this.segments[0].y > this.height - this.cellSize
            || this.segments.filter(function (value) {
                if (value.x === _this.segments[0].x && value.y === _this.segments[0].y) {
                    return true;
                }
                return false;
            }).length > 1) {
            this.reset();
            return;
        }
        // Eat food?
        if (this.food
            && this.segments[0].x === this.food.x
            && this.segments[0].y === this.food.y) {
            this.food = null;
            this.grow(2);
        }
        if (!this.food) {
            this.dropFood();
        }
    };
    App.prototype.draw = function () {
        this.context.clearRect(0, 0, this.width, this.height);
        if (this.food) {
            this.context.fillStyle = 'red';
            this.context.fillRect(this.food.x, this.food.y, this.cellSize, this.cellSize);
        }
        this.context.fillStyle = 'black';
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            this.context.fillRect(segment.x, segment.y, this.cellSize, this.cellSize);
        }
    };
    return App;
}());
new App();

},{}]},{},[1]);
