let salto, bocaabajo, reposo;
let betaValue = 0;

// Estados
let currentAudio = null;
let isUpsideDown = false;
let lastUpsideDownStart = 0;

// Tiempos
let lastAudioTime = 0;
let COOLDOWN = 2000;
let REPOSO_TIME = 25000;

// Visual
let bgColor;
let targetColor;

function preload() {
  salto = loadSound("audiosalto.mp3");
  bocaabajo = loadSound("audiobocaabajo.mp3");
  reposo = loadSound("audioreposo.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  bgColor = color(40);
  targetColor = color(40);

  let boton = createButton("Activar sensores y audio");
  boton.position(20, 20);
  boton.mousePressed(() => {
    userStartAudio();
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      DeviceOrientationEvent.requestPermission();
    }
  });

  textFont("Helvetica");
  textSize(24);
  textAlign(LEFT, TOP);
}

function draw() {
  bgColor = lerpColor(bgColor, targetColor, 0.05);
  background(bgColor);

  fill(255);
  text("Beta: " + nf(betaValue, 1, 1), 20, 90);

  drawUpsideDownTimer();
  handleLogic();
}

function deviceMoved() {
  betaValue = rotationX;
}

function handleLogic() {
  let now = millis();

  // Interrupción inmediata del audio de reposo
  if (currentAudio === reposo && !(betaValue >= 165 && betaValue <= 195)) {
    reposo.stop();
    currentAudio = null;
    isUpsideDown = false;
  }

  if (currentAudio && currentAudio.isPlaying()) return;

  if (now - lastAudioTime < COOLDOWN) return;

  // REGLA DE SALTO
  if (betaValue > 45 && betaValue < 180) {
    if (!(betaValue >= 165 && betaValue <= 195)) {
      playOnce(salto);
      setColor(color(255, 220, 0));
      resetUpsideDownState();
      return;
    }
  }

  // REGLA BOCA ABAJO
  if (betaValue >= 165 && betaValue <= 195) {
    if (!isUpsideDown) {
      isUpsideDown = true;
      lastUpsideDownStart = now;
      playOnce(bocaabajo);
      setColor(color(40, 140, 250));
    } else {
      if (now - lastUpsideDownStart >= REPOSO_TIME) {
        playOnce(reposo);
        setColor(color(150, 70, 200));
      }
    }
    return;
  }

  resetUpsideDownState();
  setColor(color(40));
}

function playOnce(soundFile) {
  if (currentAudio && currentAudio.isPlaying()) {
    currentAudio.stop();
  }

  currentAudio = soundFile;
  soundFile.play();
  lastAudioTime = millis();
}

function resetUpsideDownState() {
  isUpsideDown = false;
}

function drawUpsideDownTimer() {
  if (!isUpsideDown) return;

  let remaining = REPOSO_TIME - (millis() - lastUpsideDownStart);
  if (remaining < 0) remaining = 0;

  let seconds = nf(remaining / 1000, 1, 1);

  push();
  translate(width / 2, height / 2);

  noFill();
  stroke(255);
  strokeWeight(8);

  let angle = map(remaining, 0, REPOSO_TIME, 0, TWO_PI);
  arc(0, 0, 180, 180, -HALF_PI, -HALF_PI + angle);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  text("Reposo en\n" + seconds + " s", 0, 0);
  pop();
}

function setColor(col) {
  targetColor = col;
}
