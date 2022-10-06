import DamPhreaticLine from '../package/index';

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
  seaLevel: 100,
});

instance.addSensors([
  {
    name: '#1',
    value: 80,
    distance: -30,
  },
  {
    name: '#2',
    value: 70,
    distance: -20,
  },
  {
    name: '#3',
    value: 40,
    distance: 10,
  },
  {
    name: '#4',
    value: 20,
    distance: 50,
  },
  {
    name: '#5',
    value: 10,
    distance: 80,
  },
]);

setTimeout(() => {
  instance.clearSensors();
}, 1000);
