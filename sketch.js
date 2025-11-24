let salto, bocaabajo, reposo;
let betaValue = 0;

let currentAudio = null;
let lastUpsideDownStart = 0;
let isUpsideDown = false;


let lastAudioTime = 0; // cooldown de 2 segundos
let COOLDOWN = 2000;   // en ms
let REPOSO_TIME = 25000; // 25 s

function preload() {
  salto = loadSound("audiosalto.mp3");
  bocaabajo = loadSound("audiobocaabajo.mp3");
  reposo = loadSound("audioreposo.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  let boton = createButton("Activar sensores y audio");
  boton.position(20, 20);
  boton.mousePressed(() => {
    getAudioContext().resume();
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission();
    }
  });

  textSize(26);
  fill(255);
}

function draw() {
  background(30);

  text("Beta: " + nf(betaValue, 1, 2), 20, 80);

  drawUpsideDownTimer();
  handleLogic();
}

function deviceMoved() {
  betaValue = rotationX;
}

function handleLogic() {
  let now = millis();

  // -------------------------
  // COOLDOWN GLOBAL
  // -------------------------
  if (now - lastAudioTime < COOLDOWN) return;

  // No permitir overlap de audios
  if (currentAudio && currentAudio.isPlaying()) return;
  currentAudio = null;

  // -----------------------------
  // 📌 REGLA 1: SALTO
  // beta entre 45° y 180°
  // -----------------------------
  if (betaValue > 45 && betaValue < 180) {
    // Solo si NO está boca abajo
    if (!(betaValue >= 165 && betaValue <= 195)) {
      playOnce(salto);
      resetUpsideDownState();
      return;
    }
  }

  // -----------------------------
  // 📌 REGLA 2: BOCA ABAJO
  // 165°–195° = boca abajo
  // -----------------------------
  if (betaValue >= 165 && betaValue <= 195) {

    if (!isUpsideDown) {
      // Acaba de entrar boca abajo
      isUpsideDown = true;
      lastUpsideDownStart = now;
      playOnce(bocaabajo);
    } else {
      // Lleva tiempo boca abajo → ¿ya pasaron 25s?
      if (now - lastUpsideDownStart > REPOSO_TIME) {
        playOnce(reposo);
      }
    }

    return;
  }

  // Si sale del rango boca abajo → reiniciar
  resetUpsideDownState();
}

function resetUpsideDownState() {
  isUpsideDown = false;
}

function playOnce(sound) {
  if (!sound.isPlaying()) {
    currentAudio = sound;
    sound.play();
    lastAudioTime = millis();  // aplicar cooldown
  }
}

function drawUpsideDownTimer() {
  if (!isUpsideDown) return;

  let remaining = (REPOSO_TIME - (millis() - lastUpsideDownStart)) / 1000;

  if (remaining > 0) {
    fill(200, 240, 255);
    text(
      "Reposo en: " + nf(remaining, 1, 1) + " s",
      20,
      130
    );
  }
}
