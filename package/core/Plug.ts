import Canvas from '../core/Canvas';
import backgroundImage from '../assets/sky.jpg';
import backgroundSand from '../assets/sand.jpg';
import { DamConfig, SensorConfig } from '../types';
class Plug {
  container: HTMLElement;
  drawingSize: DamConfig;

  sealevelPoint: [number, number];
  scale: { x: number; y: number };
  sensorsData: SensorConfig[];
  canvasList: {
    background: HTMLCanvasElement | undefined;
    dam: HTMLCanvasElement | undefined;
    gate: HTMLCanvasElement | undefined;
    seaLevel: HTMLCanvasElement | undefined;
    seaLevelLabel: HTMLCanvasElement | undefined;
    sensors: HTMLCanvasElement | undefined;
    sensorsLabel: HTMLCanvasElement | undefined;
    wetline: HTMLCanvasElement | undefined;
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.canvasList = {
      background: undefined,
      dam: undefined,
      gate: undefined,
      seaLevel: undefined,
      seaLevelLabel: undefined,
      sensors: undefined,
      sensorsLabel: undefined,
      wetline: undefined,
    };
    this.drawingSize = {
      damHeight: 0,
      damLeftWidth: 0,
      damRightWidth: 0,
      damTopWidth: 0,
    };
    this.scale = {
      x: 1,
      y: 1,
    };
    this.sealevelPoint = [0, 0];
    this.sensorsData = [];
  }
  //初始化作图尺寸
  onInitialzeScale(config: DamConfig) {
    const { clientWidth, clientHeight } = this.container;
    const X_SCALE = clientWidth / (config.damLeftWidth + config.damRightWidth);
    const Y_SCALE = (clientHeight / config.damHeight) * 0.8;
    this.drawingSize = {
      damHeight: config.damHeight * Y_SCALE,
      damLeftWidth: config.damLeftWidth * X_SCALE,
      damRightWidth: config.damRightWidth * X_SCALE,
      damTopWidth: config.damTopWidth * X_SCALE,
    };
    this.scale = {
      x: X_SCALE,
      y: Y_SCALE,
    };
  }
  //初始化容器
  onInitializeContainer() {
    const POSITION_LIST = ['fixed', 'relative', 'absolute', 'sticky'];
    const flag = !POSITION_LIST.includes(this.container.style.position);
    flag && (this.container.style.position = 'relative');
  }
  //初始化背景
  onInitializeBackground() {
    const { canvas, context } = Canvas.createCanvas(this.container, { className: 'mf-background' });
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = backgroundImage;
    this.canvasList.background = canvas;
  }
  //初始化大坝
  async onInitialzeDam() {
    const { damHeight, damLeftWidth, damRightWidth, damTopWidth } = this.drawingSize;
    const { canvas, context } = Canvas.createCanvas(this.container, { className: 'mf-dam', coordinateConvert: true });
    const coordinates: [number, number][] = [
      [0, 0],
      [damLeftWidth - damTopWidth / 2, damHeight],
      [damLeftWidth + damTopWidth / 2, damHeight],
      [damLeftWidth + damRightWidth, 0],
    ];
    Canvas.polygon(context, coordinates);
    const image = await Canvas.loadImage(backgroundSand);
    //@ts-ignore
    context.fillStyle = context.createPattern(image, 'repeat');
    context.strokeStyle = '#d2b491';
    context.fill();
    context.stroke();
    this.canvasList.dam = canvas;
  }
  //初始化水闸
  onInitialzeGate() {
    const { damLeftWidth, damHeight } = this.drawingSize;
    const { canvas, context } = Canvas.createCanvas(this.container, { className: 'mf-gate', coordinateConvert: true });
    const GATE_WIDTH = 10;
    context.fillStyle = '#3c3c3d';
    context.fillRect(damLeftWidth - GATE_WIDTH / 2, 0, GATE_WIDTH, damHeight);
    this.canvasList.gate = canvas;
  }
  //初始化海平面
  onInitialzeSeaLevel(seaLevel: number) {
    const { damHeight, damLeftWidth, damTopWidth } = this.drawingSize;
    //通过斜率求出海面和大坝交点的横坐标
    const x1 = damLeftWidth - damTopWidth / 2;
    const y1 = damHeight;
    const y2 = seaLevel * this.scale.y;
    const x2 = y2 * (x1 / y1);
    const { canvas, context } = Canvas.createCanvas(this.container, {
      className: 'mf-seaLevel',
      coordinateConvert: true,
    });
    Canvas.polygon(context, [
      [0, 0],
      [0, y2],
      [x2, y2],
    ]);
    context.fillStyle = 'rgba(78, 99, 227,1)';
    context.fill();
    this.sealevelPoint = [x2, y2];
    this.canvasList.seaLevel = canvas;
  }
  //初始化海平面label
  onInitialzeSeaLevelLabel(seaLevel: number) {
    const { damHeight } = this.drawingSize;
    const { canvas, context } = Canvas.createCanvas(this.container, { className: 'mf-sealevel-label' });
    const x = this.sealevelPoint[0] / 2;
    const y = damHeight / 0.85 - this.sealevelPoint[1];
    context.fillText(`当前水位:${seaLevel}(m)`, x, y);
    this.canvasList.seaLevelLabel = canvas;
  }
  //初始化传感器数据
  onInitialzeSensorsData(config: SensorConfig[]) {
    this.sensorsData = config.sort((a, b) => a.distance - b.distance);
  }
  //初始化传感器
  onInitialzeSensors() {
    const { damLeftWidth, damHeight, damTopWidth, damRightWidth } = this.drawingSize;
    const { canvas, context } = Canvas.createCanvas(this.container, {
      className: 'mf-sensor',
      coordinateConvert: true,
    });
    const SENSOR_WIDTH = 8;
    const coordinates: [number, number][] = [
      [0, 0],
      [damLeftWidth - damTopWidth / 2, damHeight],
      [damLeftWidth + damTopWidth / 2, damHeight],
      [damLeftWidth + damRightWidth, 0],
    ];
    Canvas.polygon(context, coordinates);
    context.clip();
    this.sensorsData.forEach((sensor) => {
      const x = sensor.distance * this.scale.x + damLeftWidth;
      context.fillStyle = '#fff';
      context.fillRect(x - SENSOR_WIDTH / 2, 10, SENSOR_WIDTH, damHeight);
      context.fillStyle = '#3c3c3d';
      context.fillRect(x - SENSOR_WIDTH / 2 + 1, 12, SENSOR_WIDTH - 2, 8);
      Canvas.polygon(context, [
        [x, 20],
        [x, damHeight],
      ]);
      context.lineWidth = 1;
      context.strokeStyle = '#dddddd';
      context.stroke();
    });
    this.canvasList.sensors = canvas;
  }
  //初始化浸润面
  onInitialzeWetline() {
    const { damLeftWidth, damRightWidth, damHeight } = this.drawingSize;
    const { canvas, context } = Canvas.createCanvas(this.container, {
      className: 'mf-wetline',
      coordinateConvert: true,
    });
    const { x: X_SCALE, y: Y_SCALE } = this.scale;

    const coordinates: [number, number][] = this.sensorsData.map(({ distance, value }) => [
      distance * X_SCALE + damLeftWidth,
      value * Y_SCALE,
    ]);
    coordinates.unshift([0, 0], this.sealevelPoint);
    coordinates.push([damRightWidth + damLeftWidth, 0]);
    Canvas.polygon(context, coordinates);
    context.fillStyle = 'rgba(78, 99, 227,.5)';
    context.fill();
    context.clip();

    this.sensorsData.forEach((sensor) => {
      const x = sensor.distance * X_SCALE + damLeftWidth;
      Canvas.polygon(context, [
        [x, 20],
        [x, damHeight],
      ]);
      context.lineWidth = 1;
      context.strokeStyle = '#5263db';
      context.stroke();
    });
    this.canvasList.wetline = canvas;
  }
  //初始化传感器注释
  onInitialzeSensorsLabel() {
    const { damLeftWidth, damHeight } = this.drawingSize;
    const { x: X_SCALE, y: Y_SCALE } = this.scale;
    const { canvas, context } = Canvas.createCanvas(this.container, { className: 'mf-sensors-label' });
    this.sensorsData.forEach(({ distance, value, name }) => {
      const x = distance * X_SCALE + damLeftWidth;
      const y = (damHeight - value * Y_SCALE) / 0.85;
      context.fillText(`${value}(m)`, x, y);
      context.fillText(`${name}`, x, damHeight / 0.81);
    });
    this.canvasList.sensorsLabel = canvas;
  }
  //更新海平面
  onUpdateSeaLevel(seaValue: number) {
    const { seaLevel, seaLevelLabel, sensors, sensorsLabel, wetline } = this.canvasList;
    [seaLevel, seaLevelLabel, sensors, sensorsLabel, wetline].forEach((canvas) => {
      canvas && this.container.removeChild(canvas);
    });
    this.onInitialzeSeaLevel(seaValue);
    this.onInitialzeSeaLevelLabel(seaValue);
    this.onInitialzeSensors();
    this.onInitialzeWetline();
    this.onInitialzeSensorsLabel();
  }
  //全量更新传感器
  updateSensors(config: SensorConfig[]) {
    const { sensors, sensorsLabel, wetline } = this.canvasList;
    [sensors, sensorsLabel, wetline].forEach((canvas) => {
      canvas && this.container.removeChild(canvas);
    });
    this.onInitialzeSensorsData(config);
    this.onInitialzeSensors();
    this.onInitialzeWetline();
    this.onInitialzeSensorsLabel();
  }
  //更新单个传感器
  updateSensor(data: SensorConfig) {
    const index = this.sensorsData.findIndex(({ name }) => data.name === name);
    if (index < 0) return void 0;
    this.sensorsData[index] = data;
    const { sensors, sensorsLabel, wetline } = this.canvasList;
    [sensors, sensorsLabel, wetline].forEach((canvas) => {
      canvas && this.container.removeChild(canvas);
    });
    this.onInitialzeSensors();
    this.onInitialzeWetline();
    this.onInitialzeSensorsLabel();
    return void 0;
  }
}
export default Plug;
