import DamPhreaticLine from '../package/index';
// import DamPhreaticLine from '../dist/index.js';

//init Dom
const app = document.getElementById('app');
const container = document.createElement('div');
container.style.width = '1200px';
container.style.height = '300px';
app?.appendChild(container);

const instance = new DamPhreaticLine(container);
//addDam
instance.initialize({
  damHeight: 150,
  damLeftWidth: 150,
  damRightWidth: 150,
  damTopWidth: 20,
});
instance.addSeaLevel(100);
instance.addSensors([
  {
    name: '#1',
    value: 80,
    distance: -30,
  },
  {
    name: '#2',
    value: 50,
    distance: -20,
  },
  {
    name: '#3',
    value: 30,
    distance: 10,
  },
  {
    name: '#4',
    value: 20,
    distance: 50,
  },
  {
    name: '#5',
    value: 0,
    distance: 80,
  },
]);

setTimeout(() => {
  // instance.onUpdateSeaLevel(120);
  instance.onUpdateSensor({
    name: '#1',
    value: 70,
    distance: -30,
  });
}, 1000);

setTimeout(() => {
  instance.onUpdateSeaLevel(120);
  instance.onUpdateSensors([
    {
      name: '#1',
      value: 50,
      distance: -30,
    },
    {
      name: '#2',
      value: 20,
      distance: -20,
    },
    {
      name: '#3',
      value: 10,
      distance: 10,
    },
    {
      name: '#4',
      value: 0,
      distance: 50,
    },
    {
      name: '#5',
      value: 0,
      distance: 80,
    },
  ]);
}, 2000);
