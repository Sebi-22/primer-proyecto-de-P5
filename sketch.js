// sketch.js - Composición geométrica integrada inspirada en constructivismo (Malevich, Tatlin) y cubismo (Picasso, Braque), con pelota-cara interactiva

let mic; // Micrófono para capturar voz
let fft; // Análisis de frecuencia
let bgMusic; // Música de fondo
let musicPaused = false; // Estado de pausa de la música
let mode = 0; // Modo de visualización (0: constructivista, 1: cubista)
let waveOffset = 0; // Offset para la ola en la tribuna

function preload() {
  bgMusic = loadSound('we will rock you instrumental.mp3'); // Cargar música de fondo
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas dinámico al tamaño de la ventana

  // Configurar micrófono y FFT
  mic = new p5.AudioIn();
  mic.start();
  mic.amp(0.1);
  fft = new p5.FFT();
  fft.setInput(mic);

  // Configurar música
  bgMusic.setVolume(0.2);
  bgMusic.loop();

  noStroke(); // Sin bordes para estilo abstracto
  colorMode(HSB, 360, 100, 100); // Modo de color HSB para variaciones
}

function draw() {
  background(120, 70, 30); // Fondo verde estilo césped

  // Patrón de césped: Figura 1 - Elipses (círculos) para simular hierba, inspirado en formas orgánicas del constructivismo
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      let size = random(3, 8);
      let hue = 120 + random(-10, 10);
      fill(hue, 60, 35);
      ellipse(x + random(-5, 5), y + random(-5, 5), size, size);
    }
  }

  // Marco de la cancha: Figura 2 - Rectángulo (sin relleno) para delineación, como líneas geométricas en obras de Malevich
  stroke(0, 0, 100); // Blanco
  strokeWeight(8);
  noFill();
  rect(width / 2 - 350, height / 2 - 250, 700, 500);
  noStroke();

  // Análisis de audio para ola
  let spectrum = fft.analyze();
  let vol = mic.getLevel();
  let lowFreqAvg = 0;
  for (let i = 0; i < 20; i++) {
    lowFreqAvg += spectrum[i];
  }
  lowFreqAvg /= 20;
  if (lowFreqAvg > 50) {
    waveOffset += 0.1;
  } else {
    waveOffset *= 0.95;
  }

  // Tribunas: Figura 3 - Elipses (círculos) para espectadores, simulando multitudes en composiciones constructivistas
  let frontRows = 5;
  let backRows = 8;
  let spacing = 40;
  let depthOffset = 30;

  // Tribuna azul (izquierda)
  for (let r = 0; r < frontRows; r++) {
    let y = height / 2 - (frontRows / 2) * spacing + r * spacing;
    let x = width / 2 - 250 + sin(waveOffset - r * 0.3) * 15;
    fill(240, 100, 100);
    ellipse(x, y, 20, 20);
  }
  for (let r = 0; r < backRows; r++) {
    let y = height / 2 - (backRows / 2) * spacing + r * spacing;
    let x = width / 2 - 250 - depthOffset + sin(waveOffset - r * 0.3) * 10;
    fill(240, 100, 80);
    ellipse(x, y, 18, 18);
  }

  // Tribuna blanca (derecha)
  for (let r = 0; r < frontRows; r++) {
    let y = height / 2 - (frontRows / 2) * spacing + r * spacing;
    let x = width / 2 + 250 - sin(waveOffset - r * 0.3) * 15;
    fill(0, 0, 100);
    ellipse(x, y, 20, 20);
  }
  for (let r = 0; r < backRows; r++) {
    let y = height / 2 - (backRows / 2) * spacing + r * spacing;
    let x = width / 2 + 250 + depthOffset - sin(waveOffset - r * 0.3) * 10;
    fill(0, 0, 80);
    ellipse(x, y, 18, 18);
  }

  let scaleFactor = map(vol, 0, 1, 0.5, 2);
  let rotAngle = map(mouseX, 0, width, 0, TWO_PI);
  let mouthOpen = map(lowFreqAvg, 0, 255, 5, 60);

  if (mode === 0) { // Modo constructivista
    push();
    translate(width / 2, height / 2);
    rotate(rotAngle);
    scale(scaleFactor);

    // Figura 4: Rectángulos constructivistas para bases industriales, inspirado en Tatlin y formas abstractas
    for (let i = 0; i < spectrum.length; i += 50) {
      let amp = spectrum[i] / 255;
      fill(map(i, 0, spectrum.length, 0, 360), 80, 80);
      rect(i - spectrum.length / 2, -amp * 100, 20, amp * 200);
    }

    // Figura 5: Elipses para ondas curvas, como elementos dinámicos en constructivismo
    for (let i = 0; i < 10; i++) {
      let x = cos(i * TWO_PI / 10) * 200 * scaleFactor;
      let y = sin(i * TWO_PI / 10) * 200 * scaleFactor;
      fill(120 + i * 20, 100, 100);
      ellipse(x, y, vol * 100, vol * 100);
    }

    // Figura 6: Elipse para pelota-cara, con arcos para boca, como forma humana simplificada en constructivismo
    let faceSize = 150 + vol * 200;
    fill(60, 100, 100);
    ellipse(0, 0, faceSize, faceSize); // Cabeza
    fill(0, 0, 0);
    ellipse(-20, -20, 10, 10); // Ojo izquierdo
    ellipse(20, -20, 10, 10);  // Ojo derecho
    arc(0, 20, 40, mouthOpen, 0, PI); // Boca (arco)
    pop();
  } else if (mode === 1) { // Modo cubista
    for (let i = 0; i < spectrum.length; i += 10) {
      let amp = spectrum[i] / 255;
      let x = random(width);
      let y = random(height);
      let size = amp * 50;

      // Figura 7: Rectángulos cubistas como partículas, inspirado en descomposición de Picasso
      fill(map(i, 0, spectrum.length, 0, 360), 80, 80);
      rect(x, y, size, size);

      // Figura 8: Elipses superpuestas para descomposición, como fragmentos en cubismo
      fill(180, 100, 100);
      ellipse(x + size / 2, y + size / 2, size * 0.5);

      // Figura 9: Elipse para mini-cara, con arco para boca, como rostros fragmentados en Braque
      fill(60, 100, 100);
      ellipse(x, y, size * 2);
      fill(0, 0, 0);
      ellipse(x - 5, y - 5, 3, 3);
      ellipse(x + 5, y - 5, 3, 3);
      let miniMouth = map(lowFreqAvg, 0, 255, 1, 15);
      arc(x, y + 5, 10, miniMouth, 0, PI);
    }
  }

  // Texto de instrucciones
  fill(0, 0, 100);
  textAlign(CENTER);
  textSize(16);
  text("Habla fuerte para que abra bien la boca. Mouse para rotar. Presiona 'M' para cambiar modo. 'P' para pausar/reanudar música.", width / 2, height - 30);
}

function keyPressed() {
  if (key === 'm' || key === 'M') {
    mode = (mode + 1) % 2;
  }
  if (key === 'p' || key === 'P') {
    if (musicPaused) {
      bgMusic.play();
      musicPaused = false;
    } else {
      bgMusic.pause();
      musicPaused = true;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
