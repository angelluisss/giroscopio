let sound;
let salto;
let aceleracion;
let bocaabajo;
let reposo;

let alpha = 0;
let beta = 0;
let gamma = 0;

let bocaAbajoStart = null; // Tiempo cuando entra a la posición
let reposoPlayed = false;

function preload() {
  sound = loadSound('cancion.mp3');
  salto = loadSound('audiosalto.mp3');
  aceleracion = loadSound('audioaceleracion.mp3');
  bocaabajo = loadSound('audiobocaabajo.mp3');
  reposo = loadSound('audioreposo.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textAlign(LEFT, TOP);

  let btn = createButton("🔊 Activar audio");
  btn.position(20, 120);
  btn.mousePressed(() => {
    userStartAudio();
    console.log("Audio habilitado");
  });

  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {

    DeviceOrientationEvent.requestPermission().then(response => {
      if (response === "granted") {
        window.addEventListener("deviceorientation", readOrientation);
      }
    });

  } else {
    window.addEventListener("deviceorientation", readOrientation);
  }
}

function draw() {
  background(200);

  text(`Alpha: ${alpha}`, 20, 20);
  text(`Beta: ${beta}`, 20, 50);
  text(`Gamma: ${gamma}`, 20, 80);

  // ----- 1. Sonido salto (beta > 45°) -----
  if (beta > 45 && beta < 160) {
    stopAllExcept(salto);
    salto.play();
    resetBocaAbajoTimer();
  }

  // ----- 2. Sonido aceleración (beta < -20°) -----
  else if (beta < -20) {
    stopAllExcept(aceleracion);
    aceleracion.play();
    resetBocaAbajoTimer();
  }

  // ----- 3. Sonido boca abajo (beta entre 165° y 195°) -----
  else if (beta >= 165 && beta <= 195) {

    stopAllExcept(bocaabajo);

    if (!bocaabajo.isPlaying()) bocaabajo.play();

    // Iniciar temporizador si no ha comenzado
    if (bocaAbajoStart === null) {
      bocaAbajoStart = millis();
      reposoPlayed = false;
    }

    // Si lleva más de 25s en posición boca abajo → reproduce reposo
    let elapsed = (millis() - bocaAbajoStart) / 1000;
    if (elapsed >= 25 && !reposoPlayed) {
      stopAllExcept(reposo);
      reposo.play();
      reposoPlayed = true;
    }
  }

  // ----- 4. Cualquier otra posición -----
  else {
    stopAll();
    resetBocaAbajoTimer();
  }
}

// -------- FUNCIONES AUXILIARES --------

function stopAll() {
  sound.stop();
  salto.stop();
  aceleracion.stop();
  bocaabajo.stop();
  reposo.stop();
}

function stopAllExcept(audio) {
  if (audio !== sound) sound.stop();
  if (audio !== salto) salto.stop();
  if (audio !== aceleracion) aceleracion.stop();
  if (audio !== bocaabajo) bocaabajo.stop();
  if (audio !== reposo) reposo.stop();
}

function resetBocaAbajoTimer() {
  bocaAbajoStart = null;
  reposoPlayed = false;
}

function readOrientation(e) {
  alpha = e.alpha;
  beta = e.beta;
  gamma = e.gamma;
}
