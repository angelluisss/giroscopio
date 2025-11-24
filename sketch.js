let salto, bocaabajo, reposo;
let betaValue = 0;

let currentAudio = null;
let lastUpsideDownStart = 0;
let isUpsideDown = false;

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
}

function draw() {
  background(30);
  fill(255);
  textSize(26);
  text("Beta: " + nf(betaValue, 1, 2), 20, 80);

  handleLogic();
}

function deviceMoved() {
  betaValue = rotationX;
}

function handleLogic() {
  let now = millis();

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
      // Entró en posición boca abajo
      isUpsideDown = true;
      lastUpsideDownStart = now;
      playOnce(bocaabajo);
      
    } else {
      // Lleva tiempo boca abajo → 25s = REPOSO
      if (now - lastUpsideDownStart > 25000) {
        playOnce(reposo);
      }
    }

    return;
  }

  // Si sale del rango boca abajo → reinicia contador
  resetUpsideDownState();
}

function resetUpsideDownState() {
  isUpsideDown = false;
}

function playOnce(sound) {
  if (!sound.isPlaying()) {
    currentAudio = sound;
    sound.play();
  }
}
