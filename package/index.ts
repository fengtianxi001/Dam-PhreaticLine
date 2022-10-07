import { DamConfig, SensorConfig } from './types';
import Plug from './core/Plug';
class DamPhreaticLine extends Plug {
  container: HTMLElement;
  constructor(container: HTMLElement) {
    super(container);
    this.container = container;
  }
  initialize(config: DamConfig) {
    this.onInitialzeScale(config);
    this.onInitializeContainer();
    this.onInitializeBackground();
    this.onInitialzeDam();
    this.onInitialzeGate();
  }
  addSeaLevel(seaLevel: number) {
    this.onInitialzeSeaLevel(seaLevel);
    this.onInitialzeSeaLevelLabel(seaLevel);
  }
  addSensors(config: SensorConfig[]) {
    this.onInitialzeSensorsData(config);
    this.onInitialzeSensors();
    this.onInitialzeWetline();
    this.onInitialzeSensorsLabel();
  }
}

export default DamPhreaticLine;
