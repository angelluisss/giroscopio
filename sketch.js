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

  // BOTÓN PARA ACTIVAR AUDIO (OBLIGATORIO EN CELULAR)
  let btn = createButton("🔊 Activar audio");
  btn.position(20, 120);
  btn.mousePressed(() => {
    userStartAudio(); 
    console.log("Audio habilitado");
  });

  // PERMISO PARA USAR GIROSCOPIO EN iPHONE
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {

    DeviceOrientationEvent.requestPermission().then(response => {
      if (response === "granted") {
        window.addEventListener("deviceorientation", readOrientation);
      } else {
        alert("No se otorgó permiso para acceder al giroscopio.");
      }
    });

  } else {
    // ANDROID / PC
    window.addEventListener("deviceorientation", readOrientation);
  }
}

function draw() {
  background(200);

  // Mostrar valores del giroscopio
  text(`Alpha: ${alpha}`, 20, 20);
  text(`Beta: ${beta}`, 20, 50);
  text(`Gamma: ${gamma}`, 20, 80);

  // Activar sonido si el celular se gira
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
}
