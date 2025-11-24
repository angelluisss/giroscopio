let salto, bocaabajo, reposo;
let betaValue = 0;

let currentAudio = null;
let lastOrientationStart = 0;
let inUpsideDown = false;

function preload() {
  salto = loadSound("audiosalto.mp3");
  bocaabajo = loadSound("audiobocaabajo.mp3");
  reposo = loadSound("audioreposo.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // botón de permiso
  let boton = createButton("Activar sensores y audio");
  boton.position(20, 20);
  boton.mousePressed(() => {
    getAudioContext().resume();
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission();
    }
  });
}

function draw() {
  background(0);
  textSize(25);
  fill(255);
  text("Beta: " + nf(betaValue, 1, 2), 20, 100);

  checkOrientationLogic();
}

function deviceMoved() {
  betaValue = rotationX;
}

function checkOrientationLogic() {
  let now = millis();

  // -------------------------------
  // NO AL OVERLAP DE AUDIOS
  // -------------------------------
  if (currentAudio && currentAudio.isPlaying()) {
    return;
  } else {
    currentAudio = null;
  }

  // -------------------------------------
  // 1. BETA > 45° → SALTO
  // -------------------------------------
  if (betaValue > 45) {
    playOnce(salto);
    resetUpsideDownTimer();
    return;
  }

  // -------------------------------------
  // 2. BETA ENTRE 165 Y 195 → BOCA ABAJO
  // -------------------------------------
  if (betaValue >= 165 && betaValue <= 195) {

    if (!inUpsideDown) {
      inUpsideDown = true;
      lastOrientationStart = now;
      playOnce(bocaabajo);
    } else {
      if (now - lastOrientationStart > 25000) {
        playOnce(reposo);
      }
    }

    return;
  }

  // si sale del rango boca abajo:
  resetUpsideDownTimer();
}

function resetUpsideDownTimer() {
  inUpsideDown = false;
}

function playOnce(sound) {
  if (!sound.isPlaying()) {
    currentAudio = sound;
    sound.play();
  }
}
