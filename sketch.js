let sound;
let salto;
let aceleracion;
let bocaabajo;
let reposo;

let alpha = 0;
let beta = 0;
let gamma = 0;

let bocaAbajoStart = null; 
let currentState = ""; // 👉 previene solapamientos
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

  if (DeviceOrientationEvent.requestPermission) {
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

  // ------------------------------
  // 1. BETA > 45° → SALTO
  // ------------------------------
  if (beta > 45 && beta < 160) {
    enterState("salto", salto);
    resetBocaAbajoTimer();
    return;
  }

  // ------------------------------
  // 2. BETA < -20° → ACELERACIÓN
  // ------------------------------
  if (beta < -20) {
    enterState("aceleracion", aceleracion);
    resetBocaAbajoTimer();
    return;
  }

  // ------------------------------
  // 3. BETA ENTRE 165° Y 195° → BOCA ABAJO
  // ------------------------------
  if (beta >= 165 && beta <= 195) {
    enterState("bocaabajo", bocaabajo);

    if (bocaAbajoStart === null) {
      bocaAbajoStart = millis();
      reposoPlayed = false;
    }

    let elapsed = (millis() - bocaAbajoStart) / 1000;

    if (elapsed >= 25 && !reposoPlayed) {
      enterState("reposo", reposo);
      reposoPlayed = true;
    }

    return;
  }

  // ------------------------------
  // 4. SI NO ESTÁ EN NINGUNA POSICIÓN
  // ------------------------------
  enterState("ninguno");
  resetBocaAbajoTimer();
}

// ❗ Maneja entradas a estados SIN repetición ni solapamiento
function enterState(state, soundToPlay = null) {
  if (currentState !== state) {
    currentState = state;
    stopAllSounds();

    if (soundToPlay) {
      soundToPlay.play();
    }
  }
}

// ❗ Detiene TODOS los sonidos
function stopAllSounds() {
  salto.stop();
  aceleracion.stop();
  bocaabajo.stop();
  reposo.stop();
}

// ❗ Reinicia el contador de 25s boca abajo
function resetBocaAbajoTimer() {
  bocaAbajoStart = null;
  reposoPlayed = false;
}

function readOrientation(e) {
  alpha = e.alpha;
  beta = e.beta;
  gamma = e.gamma;
}
