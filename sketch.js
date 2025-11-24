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
    if (!sound.isPlaying()) sound.play();
  } else {
    if (sound.isPlaying()) sound.stop();
  }
}

function readOrientation(e) {
  alpha = e.alpha;
  beta = e.beta;
  gamma = e.gamma;
      audioContext.decodeAudioData(arrayBuffer)
      .then(function(audioBuffer) {
        // Audio decoded successfully, now play or process it
        console.log('Audio decoded successfully!');
        // ...
      })
      .catch(function(error) {
        console.error('Error decoding audio data:', error);
        // Provide user feedback or fall back to an alternative audio source
      });
        fetch(audioFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error('Received empty or invalid audio data.');
        }
        // Optional: rudimentary check for common non-audio content types if you suspect incorrect server responses
        // e.g., if arrayBuffer starts with '<!DOCTYPE html>' it's likely an HTML page.
        const view = new DataView(arrayBuffer);
        const firstBytes = String.fromCharCode(...new Uint8Array(arrayBuffer.slice(0, 10)));
        if (firstBytes.includes('<!DOCTYPE')) { // Simple check for HTML content
            throw new Error('Received HTML instead of audio data. Check network request.');
        }

        return audioContext.decodeAudioData(arrayBuffer);
      })
      .then(audioBuffer => {
        // ... successful decoding
      })
      .catch(error => {
        console.error('Failed to load or decode audio:', error);
      });

  
}
