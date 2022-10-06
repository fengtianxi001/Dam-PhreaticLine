import { DamConfig, SensorConfig } from './types';
// import Canvas from './core/Canvas';
import Plug from './core/Plug';

class DamPhreaticLine extends Plug {
  container: HTMLElement;
  constructor(container: HTMLElement) {
    super(container);
    container.style.position = 'relative';
    this.container = container;
  }
  initialize(config: DamConfig) {
    this.onInitializeBackground();
    this.onInitialzeScale(config);
    this.onInitialzeDam(config);
    this.onInitialzeGate(config);
  }
  addSensors(config: SensorConfig[]) {
    this.onInitialzeSensors(config);
    this.onInitialzeSeaLevel();
    this.onInitialzeWetline(config);
    this.onInitialzeComment(config);
  }
  clearSensors() {
    const sensorCanvas = document.querySelector('.sensor');
    sensorCanvas && this.container.removeChild(sensorCanvas);
    const wetlineCanvas = document.querySelector('.wetline');
    wetlineCanvas && this.container.removeChild(wetlineCanvas);
    const commentCanvas = document.querySelector('.comment');
    commentCanvas && this.container.removeChild(commentCanvas);
  }
  //   updateSensor(config: SensorConfig) {}
}

export default DamPhreaticLine;
