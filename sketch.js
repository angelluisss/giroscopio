let salto, bocaabajo, reposo;
let betaValue = 0;

let currentAudio = null;
let lastUpsideDownStart = 0;
let isUpsideDown = false;

let lastAudioTime = 0;
let COOLDOWN = 2000;   // 2 segundos
let REPOSO_TIME = 25000; // 25s

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
  textAlign(LEFT, TOP);
}

function draw() {
  background(20);

  drawUI();
  drawUpsideDownTimer();
  handleLogic();
}

function deviceMoved() {
  betaValue = rotationX;
}

function handleLogic() {
  let now = millis();

  // cooldown global
  if (now - lastAudioTime < COOLDOWN) return;

  // evitar overlap
  if (currentAudio && currentAudio.isPlaying() && currentAudio !== reposo) return;

  currentAudio = null;

  // SALTO (45° a 180°)
  if (betaValue > 45 && betaValue < 180) {
    if (!(betaValue >= 165 && betaValue <= 195)) {
      interruptRestAudio();
      playOnce(salto);
      resetUpsideDownState();
      return;
    }
  }

  // BOCA ABAJO (165° a 195°)
  if (betaValue >= 165 && betaValue <= 195) {

    interruptRestAudio();

    if (!isUpsideDown) {
      isUpsideDown = true;
      lastUpsideDownStart = now;
      playOnce(bocaabajo);
    } else {
      if (now - lastUpsideDownStart > REPOSO_TIME) {
        playOnce(reposo);
      }
    }
    return;
  }

  // Si salió de boca abajo
  resetUpsideDownState();
}

function resetUpsideDownState() {
  isUpsideDown = false;
}

function playOnce(sound) {
  if (!sound.isPlaying()) {
    currentAudio = sound;
    sound.play();
    lastAudioTime = millis();
  }
}

function interruptRestAudio() {
  if (reposo.isPlaying()) reposo.stop();
}

function drawUI() {
  fill(255);
  text("Inclinación (β): " + nf(betaValue, 1, 2), 20, 80);

  noStroke();
  
  // Barra decorativa inferior según beta
  let mapColor = map(betaValue, -180, 180, 0, 255);
  fill(mapColor, 120, 255 - mapColor);
  rect(0, height - 30, map(betaValue, -180, 180, 0, width), 30);
}

function drawUpsideDownTimer() {
  if (!isUpsideDown) return;

  let elapsed = millis() - lastUpsideDownStart;
  let remaining = REPOSO_TIME - elapsed;

  if (remaining <= 0) return;

  let sec = nf(remaining / 1000, 1, 1);

  fill(200, 240, 255);
  text("Reposo en: " + sec + " s", 20, 130);

  // barra visual de progreso
  let progress = map(elapsed, 0, REPOSO_TIME, 0, width - 40);
  fill(50, 180, 255);
  rect(20, 170, progress, 20);
}
