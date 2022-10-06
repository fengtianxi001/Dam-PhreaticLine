class Canvas {
  static createCanvas(
    container: HTMLElement,
    config?: { index?: string; coordinateConvert?: boolean; className: string }
  ) {
    const { clientWidth, clientHeight } = container;
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (config) {
      if (config?.index) {
        canvas.style.zIndex = config.index;
      }
      //更换画布的坐标原点 => 左下角
      if (config.coordinateConvert) {
        context.scale(1, -1);
        context.translate(0, -1 * clientHeight);
      }
      if (config.className) {
        canvas.className = config.className;
      }
    }
    container.appendChild(canvas);
    return {
      canvas,
      context,
    };
  }
  static polygon(context: CanvasRenderingContext2D, coordinates: [number, number][]) {
    if (coordinates.length >= 2) {
      const _coordinates = [...coordinates];
      context.beginPath();
      const [fx, fy] = _coordinates.shift() as [number, number];
      context.moveTo(fx, fy);
      _coordinates.forEach(([x, y]) => {
        context.lineTo(x, y);
      });
      context.closePath();
    } else {
      console.error('polygon坐标需要多于3个点位');
    }
  }
  static loadImage(url: string) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = url;
    });
  }
}

export default Canvas;
