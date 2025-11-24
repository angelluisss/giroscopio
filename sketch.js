let sound;
let alpha = 0;
let beta = 0;
let gamma = 0;

function preload() {
  sound = loadSound('cancion.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textAlign(LEFT, TOP);

  if (DeviceOrientationEvent.requestPermission) {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener('deviceorientation', readOrientation);
      }
    });
  } else {
    window.addEventListener('deviceorientation', readOrientation);
  }
}

function draw() {
  background(200);
  text(`Alpha: ${alpha}`, 20, 20);
  text(`Beta: ${beta}`, 20, 50);
  text(`Gamma: ${gamma}`, 20, 80);

  if (alpha > 90) {
    if (!sound.isPlaying()) {
      sound.play();
    }
  } else {
    if (sound.isPlaying()) {
      sound.stop();
    }
  }
}

function readOrientation(e) {
  alpha = e.alpha;
  beta = e.beta;
  gamma = e.gamma;

  function setup() {
  createCanvas(windowWidth, windowHeight);
  let btn = createButton("Activar audio");
  btn.position(20, 120);
  btn.mousePressed(() => {
    userStartAudio();
    sound.play();
    sound.stop();
  });

  // ... resto
}

}
