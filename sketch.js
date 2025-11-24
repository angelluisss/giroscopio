let salto, bocaabajo, reposo;

let beta = 0;

let isPlaying = false;
let lastAudioTime = 0;
let cooldown = 2000; // 2 segundos

let isBocaAbajo = false;
let tiempoInicioBocaAbajo = null;
let tiempoBocaAbajo = 0;

function preload() {
  salto = loadSound("audiosalto.mp3");
  bocaabajo = loadSound("bocaabajo.mp3");
  reposo = loadSound("audioreposo.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);

  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {

    let boton = createButton("Activar giroscopio");
    boton.center();
    boton.mousePressed(() => {
      DeviceOrientationEvent.requestPermission().then(permission => {
        if (permission === "granted") boton.remove();
      });
    });
  }
}

function deviceOrientationChanged() {
  beta = rotationX; // rotación vertical
}

function draw() {
  background(30);

  const ahora = millis();

  let estado = "normal";

  // ---------------------------------------------------------
  // DETECCIÓN DE POSTURAS
  // ---------------------------------------------------------

  // 1️⃣ SALTO → beta > 45 y beta < 180 (vertical hacia adelante)
  let detectaSalto = beta > 45 && beta < 180;

  // 2️⃣ BOCA ABAJO → beta entre 165° y 195°
  isBocaAbajo = beta > 165 && beta < 195;

  // ---------------------------------------------------------
  // CONTROL DEL TIEMPO BOCA ABAJO
  // ---------------------------------------------------------
  if (isBocaAbajo) {
    if (tiempoInicioBocaAbajo === null) {
      tiempoInicioBocaAbajo = millis();
    }
    tiempoBocaAbajo = Math.floor((millis() - tiempoInicioBocaAbajo) / 1000);
  } else {
    tiempoInicioBocaAbajo = null;
    tiempoBocaAbajo = 0;

    // Si sale de la postura, detener audio reposo
    if (reposo.isPlaying()) reposo.stop();
  }

  // ---------------------------------------------------------
  // REPRODUCCIÓN DE AUDIOS (con cooldown + no solapar)
  // ---------------------------------------------------------
  if (!isPlaying && ahora - lastAudioTime > cooldown) {

    // 1️⃣ BOCA ABAJO inmediato → bocaabajo.mp3
    if (isBocaAbajo && !bocaabajo.isPlaying() && tiempoBocaAbajo < 25) {
      reproducirAudio(bocaabajo);
      estado = "boca abajo";
    }

    // 2️⃣ REPOSO → si lleva 25 segundos boca abajo
    else if (isBocaAbajo && tiempoBocaAbajo >= 25 && !reposo.isPlaying()) {
      reproducirAudio(reposo);
      estado = "reposo";
    }

    // 3️⃣ SALTO → si se inclina más de 45°
    else if (detectaSalto) {
      reproducirAudio(salto);
      estado = "salto";
    }
  }

  // ---------------------------------------------------------
  // VISUALIZADOR DEL TIEMPO BOCA ABAJO
  // ---------------------------------------------------------
  if (isBocaAbajo) {
    if (tiempoBocaAbajo < 10) fill(0, 255, 0);
    else if (tiempoBocaAbajo < 20) fill(255, 200, 0);
    else fill(255, 0, 0);

    text("Tiempo boca abajo: " + tiempoBocaAbajo + "s", width / 2, height - 50);
  } else {
    fill(180);
    text("Tiempo boca abajo: 0s", width / 2, height - 50);
  }

  // ---------------------------------------------------------
  // VISUAL DE ESTADO Y ÁNGULO
  // ---------------------------------------------------------
  fill(255);
  text("β = " + nf(beta, 1, 1), width / 2, height / 2 - 50);
  text("Estado: " + estado, width / 2, height / 2);
}

function reproducirAudio(audio) {
  if (isPlaying) return;

  detenerTodos();

  audio.play();
  isPlaying = true;

  audio.onended(() => {
    isPlaying = false;
    lastAudioTime = millis();
  });
}

function detenerTodos() {
  if (salto.isPlaying()) salto.stop();
  if (bocaabajo.isPlaying()) bocaabajo.stop();
  if (reposo.isPlaying()) reposo.stop();
}
