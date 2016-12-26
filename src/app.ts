import { select as d3select, mouse as d3mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

export class App {
  width = 1280;
  height = 600;
  currentMax = 0;
  baseW = 80;
  heightFactor = 0;
  lean = 0;

  running = false;
  realMax = 11;

  attached() {
    d3select(this.svg)
      .on('mousemove', () => this.mouseMove());
    this.next();
  }

  private next() {
    if (this.currentMax < this.realMax) {
      this.currentMax++;
      setTimeout(() => this.next(), 500);
    }
  }

  private mouseMove() {
    const [x, y] = d3mouse(this.svg);
    const scaleFactor = scaleLinear()
      .domain([this.height, 0])
      .range([0, .8]);
    const scaleLean = scaleLinear()
      .domain([0, this.width / 2, this.width])
      .range([.5, 0, -.5]);
    this.heightFactor = scaleFactor(y);
    this.lean = scaleLean(x);
  }

}
