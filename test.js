const fs = require('fs');
const name = '001fb101b0135e7f917d7b3bb627565e';
const buffer = fs.readFileSync(`./uploads/${name}`);

const data = buffer.slice(44, buffer.length);
const chunks = data.length / 4;

const lines = [];
for (let it = 0; it < chunks; it++) {
  const start = it * 4;
  const end = start + 4;
  const chunk = data.slice(start, end);
  const [a, b, c, d] = chunk;

  // const [channelA, channelB] = [chunk.slice(0, 2), chunk.slice(2, 4)];
  // console.log(chunk);
  // console.log([channelA[0],channelA[1]], [channelB[0],channelB[1]])
  // console.log(`${a} ${b}`);
  // // console.log([-(a+b), c+d]);

  lines.push([a, c]);
  lines.push([b, d]);
}
const left = {};
const right = {};

lines.map(([first, last]) => {
  if (!left[first]) left[first] = 0;
  left[first]++;

  if (!right[last]) right[last] = 0;
  right[last]++;
});

fs.writeFileSync('left.txt', Object.keys(left).map(key => `${key}\t${left[key]}`).join('\n'))
fs.writeFileSync('right.txt', Object.keys(right).map(key => `${key}\t${right[key]}`).join('\n'))


