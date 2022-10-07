#

# Dam Phreatic Line

> 大坝浸润线横截面展示

## 0. 效果展示
![效果图](https://github.com/fengtianxi001/Dam-Phreatic-Line/blob/master/screenshot.png)

## 1. 项目说明：

- 传入`大坝高度`、`大坝迎水面宽度`、`大坝背水面宽度`、`大坝坝顶宽度` 等四个参数来绘制大坝形状

- 传入`渗压传感器数据`绘制传感器点位及渗流面

## 2.使用方式

> 1. 初始化大坝形状

```javascript
const container = document.getElementById('container');
const instance = new DamPhreaticLine(container);
instance.initialize({
  damHeight: 100,
  damLeftWidth: 200,
  damRightWidth: 300,
  damTopWidth: 50,
});
```

> 2. 传入传感器数据

```javascript
instance.addSeaLevel(100);
instance.addSensors([
  {
    name: '#001',
    value: 30,
    distance: -10,
  },
  {
    name: '#002',
    value: 20,
    distance: 10,
  },
]);
```

## 3.API

#### initialize

| 参数            | 说明              | 类型     | 默认值 |
| --------------- | ----------------- | -------- | ------ |
| `damHeight`     | 大坝高度(m)       | `number` | -      |
| `damLeftWidth`  | 大坝迎水面宽度(m) | `number` | -      |
| `damRightWidth` | 大坝背水面宽度(m) | `number` | -      |
| `damTopWidth`   | 大坝坝顶宽度(m)   | `number` | -      |
| `seaLevel`      | 坝外水位          | `number` | -      |

#### addSensor

| 参数       | 说明                                                    | 类型     | 默认值 |
| ---------- | ------------------------------------------------------- | -------- | ------ |
| `name`     | 传感器名称                                              | `string` | -      |
| `value`    | 传感器值(m)                                             | `number` | -      |
| `distance` | 传感器距离闸门的距离(m), 闸门位置以迎水坡和背水坡为界。 | `number` | -      |

- distance: 有效值为 `[-damLeftWidth, +damRightWidth]`。假如迎水坡宽度为`200`，背水坡宽度为`100`, 则取值范围为`[-200, 100]`, `0`表示在闸门处。

#### methods

| 方法名称      | 描述           | 参数                             |
| ------------- | -------------- | -------------------------------- |
| updateSensor  | 更新单个传感器 | `{name, value, distance}`        |
| updateSensors | 全量更新传感器 | `Array<{name, value, distance}>` |
