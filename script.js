const grid = document.getElementById('grid');
const gridSizeInput = document.getElementById('gridSize');
const randomizeBtn = document.getElementById('randomize');
const darkModeBtn = document.getElementById('darkModeToggle');
const colorPicker = document.getElementById('colorPicker');

let colors = ['#ddd', '#5a9bf6', '#f67e5a', '#5af69b'];
let mouseDown = false;
let tiles = [];

document.body.onmousedown = () => {
  mouseDown = true;
  document.body.style.overflow = 'hidden'; // prevent scroll during drag
};

document.body.onmouseup = () => {
  mouseDown = false;
  document.body.style.overflow = 'auto'; // re-enable scroll
};

function createGrid(size) {
  if (size < 3) size = 3;
  if (size > 5) size = 5;
  gridSizeInput.value = size;

  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;
  tiles = [];

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.colorIndex = 0;
    tile.style.backgroundColor = colors[0];

    tile.addEventListener('click', e => {
      cycleColor(tile);
      createRipple(tile, e);
    });

    tile.addEventListener('mouseover', () => {
      if (mouseDown) {
        cycleColor(tile);
        createRipple(tile);
      }
    });

    tiles.push(tile);
    grid.appendChild(tile);
  }
}

function cycleColor(tile) {
  let idx = Number(tile.dataset.colorIndex);
  idx = (idx + 1) % colors.length;
  tile.dataset.colorIndex = idx;
  tile.style.backgroundColor = colors[idx];
  tile.style.transform = 'scale(1.1)';
  setTimeout(() => (tile.style.transform = 'scale(1)'), 150);
}

function createRipple(tile, event) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  tile.appendChild(ripple);

  const rect = tile.getBoundingClientRect();
  const x = event ? event.clientX - rect.left : rect.width / 2;
  const y = event ? event.clientY - rect.top : rect.height / 2;

  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  setTimeout(() => ripple.remove(), 600);
}

randomizeBtn.addEventListener('click', () => {
  tiles.forEach(tile => {
    let randIdx = Math.floor(Math.random() * colors.length);
    tile.dataset.colorIndex = randIdx;
    tile.style.backgroundColor = colors[randIdx];
  });
});

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

colorPicker.addEventListener('change', () => {
  const newColor = colorPicker.value;
  if (!colors.includes(newColor)) {
    colors.push(newColor);
  }
});

// Multi-touch support

grid.addEventListener('touchstart', e => {
  e.preventDefault();
  [...e.touches].forEach(touch => toggleTileAtTouch(touch));
});

grid.addEventListener('touchmove', e => {
  e.preventDefault();
  [...e.touches].forEach(touch => toggleTileAtTouch(touch));
});

function toggleTileAtTouch(touch) {
  const elem = document.elementFromPoint(touch.clientX, touch.clientY);
  if (elem && elem.classList.contains('tile')) {
    cycleColor(elem);
    createRipple(elem);
  }
}

// Grid size input change

gridSizeInput.addEventListener('input', () => {
  let size = parseInt(gridSizeInput.value);
  if (isNaN(size)) size = 5;
  createGrid(size);
});

// Initialize

createGrid(parseInt(gridSizeInput.value));
