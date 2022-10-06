import Canvas from '../core/Canvas';
import backgroundImage from '../assets/sky.jpg';
import backgroundSand from '../assets/123.jpg';
import { DamConfig, SensorConfig } from '../types';
class Plug {
  container: HTMLElement;
  X_SCALE: number;
  Y_SCALE: number;
  sensorCanvas: HTMLCanvasElement | undefined;
  config: DamConfig;
  GPoint: [number, number];

  constructor(container: HTMLElement) {
    this.container = container;
    this.X_SCALE = 1;
    this.Y_SCALE = 1;
    this.sensorCanvas = undefined;
    this.GPoint = [0, 0];
    this.config = {
      damHeight: 0,
      damLeftWidth: 0,
      damRightWidth: 0,
      damTopWidth: 0,
      seaLevel: 0,
    };
  }
  //初始化容器
  onInitializeContainer() {
    const POSITION_LIST = ['fixed', 'relative', 'absolute', 'sticky'];
    if (!POSITION_LIST.includes(this.container.style.position)) {
      this.container.style.position = 'relative';
    }
  }
  //初始化背景
  onInitializeBackground() {
    const { canvas, context } = Canvas.createCanvas(this.container, { className: 'background' });
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = backgroundImage;
    return canvas;
  }
  //初始化比例尺
  onInitialzeScale(config: DamConfig) {
    this.config = config;
    const { clientWidth, clientHeight } = this.container;
    this.X_SCALE = clientWidth / (config.damLeftWidth + config.damRightWidth);
    this.Y_SCALE = (clientHeight / config.damHeight) * 0.8;
    console.log(clientHeight, config.damHeight, this.Y_SCALE);
  }
  //坐标比例尺转换
  convertScale(coordinate: [number, number]) {
    const [x, y] = coordinate;
    return [x * this.X_SCALE, y * this.Y_SCALE] as [number, number];
  }
  //初始化大坝
  onInitialzeDam(config: DamConfig) {
    // const { container, convertScale } = this;
    const { damHeight, damLeftWidth, damRightWidth, damTopWidth } = config;
    const { context } = Canvas.createCanvas(this.container, { className: 'dam', coordinateConvert: true });
    const coordinates: [number, number][] = [
      [0, 0],
      this.convertScale([damLeftWidth - damTopWidth / 2, damHeight]),
      this.convertScale([damLeftWidth + damTopWidth / 2, damHeight]),
      this.convertScale([damLeftWidth + damRightWidth, 0]),
    ];

    Canvas.polygon(context, coordinates);
    Canvas.loadImage(backgroundSand).then((image) => {
      //@ts-ignore
      context.fillStyle = context.createPattern(image, 'repeat');
      context.fill();
      context.strokeStyle = '#d2b491';
      //   context.lineWidth = 4;
      context.stroke();
    });
  }
  //初始化水闸
  onInitialzeGate(config: DamConfig) {
    const { damLeftWidth, damHeight } = config;
    const { context } = Canvas.createCanvas(this.container, { className: 'gate', coordinateConvert: true });
    const gateWidth = 10;
    const x = damLeftWidth * this.X_SCALE;
    const h = damHeight * this.Y_SCALE;
    context.fillStyle = '#3c3c3d';
    context.fillRect(x - gateWidth / 2, 0, gateWidth, h);
  }
  //初始化传感器
  onInitialzeSensors(config: SensorConfig[]) {
    const { damLeftWidth, damHeight, damTopWidth, damRightWidth } = this.config;
    const { context } = Canvas.createCanvas(this.container, { className: 'sensor', coordinateConvert: true });
    const sensorWidth = 8;

    const coordinates: [number, number][] = [
      [0, 0],
      this.convertScale([damLeftWidth - damTopWidth / 2, damHeight]),
      this.convertScale([damLeftWidth + damTopWidth / 2, damHeight]),
      this.convertScale([damLeftWidth + damRightWidth, 0]),
    ];
    Canvas.polygon(context, coordinates);
    context.clip();
    config.forEach((sensor) => {
      const x = (sensor.distance + damLeftWidth) * this.X_SCALE;
      context.fillStyle = '#fff';
      context.fillRect(x - sensorWidth / 2, 10, sensorWidth, damHeight * this.Y_SCALE);
      context.fillStyle = '#3c3c3d';
      context.fillRect(x - sensorWidth / 2 + 1, 12, sensorWidth - 2, 8);
      Canvas.polygon(context, [
        [x, 20],
        [x, damHeight * this.Y_SCALE],
      ]);
      context.lineWidth = 1;
      context.strokeStyle = '#dddddd';
      context.stroke();
    });
  }
  //初始化海平面
  onInitialzeSeaLevel() {
    const { seaLevel, damHeight, damLeftWidth, damTopWidth } = this.config;
    const h = seaLevel * this.Y_SCALE;
    const pointA = this.convertScale([damLeftWidth - damTopWidth / 2, damHeight]);
    const k = pointA[1] / pointA[0];
    const x = h / k;
    const { context } = Canvas.createCanvas(this.container, { className: 'seaLevel', coordinateConvert: true });
    Canvas.polygon(context, [
      [0, 0],
      [0, h],
      [x, h],
    ]);
    context.fillStyle = 'rgba(78, 99, 227,1)';
    context.fill();
    this.GPoint = [x, h];
  }
  //初始化浸润面
  onInitialzeWetline(config: SensorConfig[]) {
    const { damLeftWidth, damRightWidth, damHeight } = this.config;
    const { context } = Canvas.createCanvas(this.container, { className: 'wetline', coordinateConvert: true });
    const coords = config
      .sort((a, b) => a.distance - b.distance)
      .map((cur) => {
        const x = (cur.distance + damLeftWidth) * this.X_SCALE;
        const y = cur.value * this.Y_SCALE;
        return [x, y];
      });
    //@ts-ignore
    Canvas.polygon(context, [[0, 0], this.GPoint, ...coords, [(damRightWidth + damLeftWidth) * this.X_SCALE, 0]]);
    context.fillStyle = 'rgba(78, 99, 227,.5)';
    context.fill();
    context.clip();
    config.forEach((sensor) => {
      const x = (sensor.distance + damLeftWidth) * this.X_SCALE;
      Canvas.polygon(context, [
        [x, 20],
        [x, damHeight * this.Y_SCALE],
      ]);
      context.lineWidth = 1;
      context.strokeStyle = '#5263db';
      context.stroke();
    });
  }
  //初始化注释
  onInitialzeComment(config: SensorConfig[]) {
    const { damLeftWidth, damRightWidth, damHeight } = this.config;
    const { context } = Canvas.createCanvas(this.container, { className: 'comment' });
    context.fillText('当前水位123', this.GPoint[0] / 2, this.GPoint[1]);
    config
      .sort((a, b) => a.distance - b.distance)
      .forEach((cur) => {
        const x = (cur.distance + damLeftWidth) * this.X_SCALE;
        const y = ((damHeight - cur.value) * this.Y_SCALE) / 0.85;
        context.fillText(`${cur.value}m`, x, y);
        context.fillText(`${cur.name}`, x, (damHeight * this.Y_SCALE) / 0.81);
        // return [x, y];
      });
  }
}
export default Plug;
