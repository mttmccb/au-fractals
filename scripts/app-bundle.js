define('app',["require", "exports", "d3-selection", "d3-scale"], function (require, exports, d3_selection_1, d3_scale_1) {
    "use strict";
    var App = (function () {
        function App() {
            this.width = 1280;
            this.height = 600;
            this.currentMax = 0;
            this.baseW = 80;
            this.heightFactor = 0;
            this.lean = 0;
            this.running = false;
            this.realMax = 11;
        }
        App.prototype.attached = function () {
            var _this = this;
            d3_selection_1.select(this.svg)
                .on('mousemove', function () { return _this.mouseMove(); });
            this.next();
        };
        App.prototype.next = function () {
            var _this = this;
            if (this.currentMax < this.realMax) {
                this.currentMax++;
                setTimeout(function () { return _this.next(); }, 500);
            }
        };
        App.prototype.mouseMove = function () {
            var _a = d3_selection_1.mouse(this.svg), x = _a[0], y = _a[1];
            var scaleFactor = d3_scale_1.scaleLinear()
                .domain([this.height, 0])
                .range([0, .8]);
            var scaleLean = d3_scale_1.scaleLinear()
                .domain([0, this.width / 2, this.width])
                .range([.5, 0, -.5]);
            this.heightFactor = scaleFactor(y);
            this.lean = scaleLean(x);
        };
        return App;
    }());
    exports.App = App;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        longStackTraces: environment_1.default.debug,
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pythagoras',["require", "exports", "aurelia-framework", "d3-scale"], function (require, exports, aurelia_framework_1, d3_scale_1) {
    "use strict";
    function deg(radians) {
        return radians * (180 / Math.PI);
    }
    ;
    var memoizedCalc = function () {
        var memo = {};
        var key = function (_a) {
            var w = _a.w, heightFactor = _a.heightFactor, lean = _a.lean;
            return [w, heightFactor, lean].join('-');
        };
        return function (args) {
            var memoKey = key(args);
            if (memo[memoKey]) {
                return memo[memoKey];
            }
            else {
                var w = args.w, heightFactor = args.heightFactor, lean = args.lean;
                var trigH = heightFactor * w;
                var result = {
                    nextRight: Math.sqrt(Math.pow(trigH, 2) + Math.pow((w * (.5 + lean)), 2)),
                    nextLeft: Math.sqrt(Math.pow(trigH, 2) + Math.pow((w * (.5 - lean)), 2)),
                    A: deg(Math.atan(trigH / ((.5 - lean) * w))),
                    B: deg(Math.atan(trigH / ((.5 + lean) * w)))
                };
                memo[memoKey] = result;
                return result;
            }
        };
    }();
    var Pythagoras = (function () {
        function Pythagoras() {
            var calc = memoizedCalc({
                w: this.w,
                heightFactor: this.heightFactor,
                lean: this.lean
            });
            this.nextRight = calc.nextRight;
            this.nextLeft = calc.nextLeft;
            this.A = calc.A;
            this.B = calc.B;
        }
        Object.defineProperty(Pythagoras.prototype, "transform", {
            get: function () {
                return "translate(" + this.x + " " + this.y + ") " + this.getRotate();
            },
            enumerable: true,
            configurable: true
        });
        Pythagoras.prototype.getRotate = function () {
            if (this.left) {
                return "rotate(" + -this.A + " 0 " + this.w + ")";
            }
            else if (this.right) {
                return "rotate(" + this.B + " " + this.w + " " + this.w + ")";
            }
            else {
                return '';
            }
        };
        Pythagoras.prototype.getFill = function () {
            return d3_scale_1.interpolateViridis(this.lvl / this.maxlvl);
        };
        return Pythagoras;
    }());
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "w", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "x", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "y", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "heightFactor", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "lean", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Boolean)
    ], Pythagoras.prototype, "left", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Boolean)
    ], Pythagoras.prototype, "right", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "lvl", void 0);
    __decorate([
        aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.oneTime }),
        __metadata("design:type", Number)
    ], Pythagoras.prototype, "maxlvl", void 0);
    exports.Pythagoras = Pythagoras;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./app.css\"></require>\n  <require from=\"./pythagoras\"></require>\n  <div class=\"App-header\">\n    <h2>This is a dancing Pythagoras tree</h2>\n  </div>\n  <p class=\"App-intro\">\n    <svg ref=\"svg\" width.bind=\"width\" height.bind=\"height\" style=\"border: 1px solid lightgray\">\n      <pythagoras containerless w.bind=\"baseW\" height-factor.bind=\"heightFactor\" lean.bind=\"lean\" x.bind=\"width / 2 - 40\" y.bind=\"height - baseW\"\n        lvl.bind=\"0\" maxlvl.bind=\"currentMax\"></pythagoras>\n    </svg>\n  </p>\n</template>\n"; });
define('text!app.css', ['module'], function(module) { module.exports = ".App {\n  text-align: center;\n}\n.App-logo {\n  animation: App-logo-spin infinite 20s linear;\n  height: 80px;\n}\n.App-header {\n  background-color: #222;\n  height: 150px;\n  padding: 20px;\n  color: white;\n}\n.App-intro {\n  font-size: large;\n}\n@keyframes App-logo-spin {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n"; });
define('text!pythagoras.html', ['module'], function(module) { module.exports = "<template>\n  <g transform.bind=\"transform\">\n  <rect width.bind=\"w\" height.bind=\"w\" x=\"0\" y=\"0\" css=\"fill: ${getFill()}\"></rect>\n  <pythagoras containerless if.bind=\"lvl < maxlvl - 1 && nextLeft >= 1\" w.bind=\"nextLeft\" x=\"0\" y.bind=\"-nextLeft\" lvl.bind=\"lvl + 1\" maxlvl.bind=\"maxlvl\"\n    height-factor.bind=\"heightFactor\" lean.bind=\"lean\" left.bind=\"true\"></pythagoras>\n  <pythagoras containerless if.bind=\"lvl < maxlvl - 1 && nextRight >= 1\" w.bind=\"nextRight\" x.bind=\"w - nextRight\" y.bind=\"-nextRight\" lvl.bind=\"lvl + 1\"\n    maxlvl.bind=\"maxlvl\" height-factor.bind=\"heightFactor\" lean.bind=\"lean\" right.bind=\"true\"></pythagoras>\n  </g>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map