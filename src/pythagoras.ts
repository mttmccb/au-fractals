import { bindable, bindingMode, computedFrom } from 'aurelia-framework';
import { interpolateViridis } from 'd3-scale';

function deg(radians) {
  return radians * (180 / Math.PI);
};

const memoizedCalc = function (): (any) => { nextRight: number, nextLeft: number, A: number, B: number } {
  const memo = {};

  const key = ({ w, heightFactor, lean }) => [w, heightFactor, lean].join('-');

  return (args) => {
    const memoKey = key(args);

    if (memo[memoKey]) {
      return memo[memoKey];
    } else {
      const { w, heightFactor, lean } = args;

      const trigH = heightFactor * w;

      const result = {
        nextRight: Math.sqrt(trigH ** 2 + (w * (.5 + lean)) ** 2),
        nextLeft: Math.sqrt(trigH ** 2 + (w * (.5 - lean)) ** 2),
        A: deg(Math.atan(trigH / ((.5 - lean) * w))),
        B: deg(Math.atan(trigH / ((.5 + lean) * w)))
      };

      memo[memoKey] = result;
      return result;
    }
  }
} ();

export class Pythagoras {
  @bindable({ defaultBindingMode: bindingMode.oneTime) w: number;
  @bindable({ defaultBindingMode: bindingMode.oneTime) x: number;
  @bindable({ defaultBindingMode: bindingMode.oneTime) y: number;
  @bindable({ defaultBindingMode: bindingMode.oneTime) heightFactor: number;
  @bindable({ defaultBindingMode: bindingMode.oneTime) lean: number;
  @bindable({ defaultBindingMode: bindingMode.oneTime) left: boolean;
  @bindable({ defaultBindingMode: bindingMode.oneTime) right: boolean;
  @bindable({ defaultBindingMode: bindingMode.oneTime) lvl: number;
  @bindable({ defaultBindingMode: bindingMode.oneTime) maxlvl: number;

  nextRight: number;
  nextLeft: number;
  A: number;
  B: number;

  constructor() {
    const calc = memoizedCalc({
      w: this.w,
      heightFactor: this.heightFactor,
      lean: this.lean
    });
    this.nextRight = calc.nextRight;
    this.nextLeft = calc.nextLeft;
    this.A = calc.A;
    this.B = calc.B;
  }

  get transform() {
    return `translate(${this.x} ${this.y}) ${this.getRotate()}`;
  }

  private getRotate() {
    if (this.left) {
      return `rotate(${-this.A} 0 ${this.w})`;
    } else if (this.right) {
      return `rotate(${this.B} ${this.w} ${this.w})`;
    } else {
      return '';
    }
  }

  getFill() {
    return interpolateViridis(this.lvl / this.maxlvl);
  }
}
