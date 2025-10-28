let mic; // Micrófono para capturar voz
let fft; // Análisis de frecuencia
let bgMusic; // Música de fondo
let musicPaused = false; // Estado de pausa de la música
let mode = 0; // Modo de visualización (0: constructivista, 1: cubista)
let waveOffset = 0; // Offset para la ola en la tribuna
let micReady = false; // Flag para saber si el micrófono está listo
let audioStarted = false; // Flag para saber si el audio ha sido iniciado por el usuario

function preload() {
  bgMusic = loadSound('we will rock you instrumental.mp3'); // Cargar música de fondo
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas dinámico al tamaño de la ventana

  // No iniciar micrófono ni música aquí, esperar a gesto del usuario
  // mic = new p5.AudioIn(); // Movido a startAudio()
  // mic.start(...); // Movido a startAudio()
  // bgMusic.setVolume(0.2); // Movido a startAudio()
  // bgMusic.loop(); // Movido a startAudio()

  noStroke(); // Sin bordes para estilo abstracto
  colorMode(HSB, 360, 100, 100); // Modo de color HSB para variaciones
}

function startAudio() {
  if (audioStarted) return; // Evitar iniciar múltiples veces
  audioStarted = true;

  // Configurar micrófono y FFT con callback para asegurar que esté listo
  mic = new p5.AudioIn();
  mic.start(() => {
    console.log('Micrófono listo');
    micReady = true; // Marca como listo
    fft = new p5.FFT();
    fft.setInput(mic);
  }, (error) => {
    console.error('Error con micrófono:', error);
  });
  mic.amp(0.1);

  // Configurar música
  bgMusic.setVolume(0.2);
  bgMusic.loop();
}

function draw() {
  background(120, 70, 30); // Fondo verde estilo césped

  if (!audioStarted) {
    // Mostrar mensaje para iniciar audio
    fill(0, 0, 100);
    textAlign(CENTER);
    textSize(min(width, height) / 20); // Tamaño relativo para móviles
    text("Haz clic o presiona una tecla para iniciar el audio", width / 2, height / 2);
    return; // No dibujar el resto hasta que el audio esté iniciado
  }

  // Factor de escala para responsividad (basado en el tamaño mínimo de la pantalla)
  let scaleFactorResponsive = min(width, height) / 800; // Asume 800 como base; ajusta si es necesario

  // Patrón de césped: Figura 1 - Elipses (círculos) para simular hierba, inspirado en formas orgánicas del constructivismo
  for (let x = 0; x < width; x += 20 * scaleFactorResponsive) {
    for (let y = 0; y < height; y += 20 * scaleFactorResponsive) {
      let size = random(3, 8) * scaleFactorResponsive;
      let hue = 120 + random(-10, 10);
      fill(hue, 60, 35);
      ellipse(x + random(-5, 5) * scaleFactorResponsive, y + random(-5, 5) * scaleFactorResponsive, size, size);
    }
  }

  // Marco de la cancha: Figura 2 - Rectángulo (sin relleno) para delineación, como líneas geométricas en obras de Malevich
  stroke(0, 0, 100); // Blanco
  strokeWeight(8 * scaleFactorResponsive); // Grosor relativo
  noFill();
  rect(width * 0.1, height * 0.2, width * 0.8, height * 0.6); // Proporcional: 10% margen izquierdo, 20% superior, 80% ancho, 60% alto
  noStroke();

  // Análisis de audio para ola - Solo si mic está listo
  let spectrum = [];
  let vol = 0;
  let lowFreqAvg = 0;
  if (micReady && fft) {
    spectrum = fft.analyze();
    vol = mic.getLevel();
    for (let i = 0; i < 20; i++) {
      lowFreqAvg += spectrum[i];
    }
    lowFreqAvg /= 20;
    if (lowFreqAvg > 50) {
      waveOffset += 0.1;
    } else {
      waveOffset *= 0.95;
    }
  }

  // Tribunas: Figura 3 - Elipses (círculos) para espectadores, simulando multitudes en composiciones constructivistas
  let frontRows = 5;
  let backRows = 8;
  let spacing = 40 * scaleFactorResponsive; // Espaciado relativo
  let depthOffset = 30 * scaleFactorResponsive;
  let marginInside = 50 * scaleFactorResponsive; // Margen interno para centrar adentro del rectángulo

  // Tribuna azul (izquierda) - Centrada adentro del rectángulo
  for (let r = 0; r < frontRows; r++) {
    let y = height * 0.2 + (height * 0.6 / frontRows) * r; // Distribuido en el alto de la cancha
    let x = width * 0.1 + marginInside + sin(waveOffset - r * 0.3) * 15 * scaleFactorResponsive; // Margen interno + animación
    fill(240, 100, 100);
    ellipse(x, y, 20 * scaleFactorResponsive, 20 * scaleFactorResponsive);
  }
  for (let r = 0; r < backRows; r++) {
    let y = height * 0.2 + (height * 0.6 / backRows) * r;
    let x = width * 0.1 + marginInside - depthOffset + sin(waveOffset - r * 0.3) * 10 * scaleFactorResponsive; // Ajustado para profundidad
    fill(240, 100, 80);
    ellipse(x, y, 18 * scaleFactorResponsive, 18 * scaleFactorResponsive);
  }

  // Tribuna blanca (derecha) - Centrada adentro del rectángulo
  for (let r = 0; r < frontRows; r++) {
    let y = height * 0.2 + (height * 0.6 / frontRows) * r;
    let x = width * 0.9 - marginInside - sin(waveOffset - r * 0.3) * 15 * scaleFactorResponsive; // Margen interno + animación
    fill(0, 0, 100);
    ellipse(x, y, 20 * scaleFactorResponsive, 20 * scaleFactorResponsive);
  }
  for (let r = 0; r < backRows; r++) {
    let y = height * 0.2 + (height * 0.6 / backRows) * r;
    let x = width * 0.9 - marginInside + depthOffset - sin(waveOffset - r * 0.3) * 10 * scaleFactorResponsive; // Ajustado para profundidad
    fill(0, 0, 80);
    ellipse(x, y, 18 * scaleFactorResponsive, 18 * scaleFactorResponsive);
  }

  // Nueva Figura 10: Líneas diagonales dinámicas para movimiento de la multitud, inspirado en diagonales constructivistas
  stroke(0, 0, 100); // Blanco para contraste
  strokeWeight(map(vol, 0, 1, 1, 5) * scaleFactorResponsive); // Grosor relativo
  noFill();
  for (let i = 0; i < 10; i++) {
    let startX = width * 0.1 + i * (width * 0.8 / 10); // Distribuido en el ancho de la cancha
    let startY = height * 0.2;
    let endX = width * 0.9 - i * (width * 0.8 / 10);
    let endY = height * 0.8;
    let offset = sin(waveOffset + i * 0.5) * map(lowFreqAvg, 0, 255, 0, 50) * scaleFactorResponsive; // Animación relativa
    line(startX + offset, startY, endX + offset, endY);
  }
  noStroke(); // Reset para no afectar otras figuras

  let scaleFactorAudio = map(vol, 0, 1, 0.5, 2); // Escala por audio (mantengo esto separado)
  let rotAngle = map(mouseX, 0, width, 0, TWO_PI);
  let mouthOpen = map(lowFreqAvg, 0, 255, 5, 60);

  if (mode === 0) { // Modo constructivista
    push();
    translate(width / 2, height / 2);
    rotate(rotAngle);
    scale(scaleFactorAudio * scaleFactorResponsive); // Combina escala de audio y responsiva

    // Figura 4: Rectángulos constructivistas para bases industriales, inspirado en Tatlin y formas abstractas
    for (let i = 0; i < spectrum.length; i += 50) {
      let amp = spectrum[i] / 255;
      fill(map(i, 0, spectrum.length, 0, 360), 80, 80);
      rect(i - spectrum.length / 2, -amp * 100 * scaleFactorResponsive, 20 * scaleFactorResponsive, amp * 200 * scaleFactorResponsive);
    }

    // Figura 5: Elipses para ondas curvas, como elementos dinámicos en constructivismo
    for (let i = 0; i < 10; i++) {
      let x = cos(i * TWO_PI / 10) * 200 * scaleFactorResponsive;
      let y = sin(i * TWO_PI / 10) * 200 * scaleFactorResponsive;
      fill(120 + i * 20, 100, 100);
      ellipse(x, y, vol * 100 * scaleFactorResponsive, vol * 100 * scaleFactorResponsive);
    }

    // Figura 6: Elipse para pelota-cara, con arcos para boca, como forma humana simplificada en constructivismo
    let faceSize = (150 + vol * 200) * scaleFactorResponsive;
    fill(60, 100, 100);
    ellipse(0, 0, faceSize, faceSize); // Cabeza
    fill(0, 0, 0);
    ellipse(-20 * scaleFactorResponsive, -20 * scaleFactorResponsive, 10 * scaleFactorResponsive, 10 * scaleFactorResponsive); // Ojo izquierdo
    ellipse(20 * scaleFactorResponsive, -20 * scaleFactorResponsive, 10 * scaleFactorResponsive, 10 * scaleFactorResponsive);  // Ojo derecho
    arc(0, 20 * scaleFactorResponsive, 40 * scaleFactorResponsive, mouthOpen * scaleFactorResponsive, 0, PI); // Boca (arco)
    pop();
  } else if (mode === 1) { // Modo cubista
    for (let i = 0; i < spectrum.length; i += 10) {
      let amp = spectrum[i] / 255;
      let x = random(width);
      let y = random(height);
      let size = amp * 50 * scaleFactorResponsive;

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
      ellipse(x - 5 * scaleFactorResponsive, y - 5 * scaleFactorResponsive, 3 * scaleFactorResponsive, 3 * scaleFactorResponsive);
      ellipse(x + 5 * scaleFactorResponsive, y - 5 * scaleFactorResponsive, 3 * scaleFactorResponsive, 3 * scaleFactorResponsive);
      let miniMouth = map(lowFreqAvg, 0, 255, 1, 15) * scaleFactorResponsive;
      arc(x, y + 5 * scaleFactorResponsive, 10 * scaleFactorResponsive, miniMouth, 0, PI);
    }
  }

  // Texto de instrucciones
  fill(0, 0, 100);
  textAlign(CENTER);
  textSize(min(width, height) / 30); // Tamaño relativo
  text("Habla fuerte para que abra bien la boca. Mouse para rotar. Presiona 'M' para cambiar modo. 'P' para pausar/reanudar música.", width / 2, height - height * 0.05); // Posición relativa al fondo
}

function keyPressed() {
  if (!audioStarted) {
    startAudio();
    return;
  }
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

function mousePressed() {
  if (!audioStarted) {
    startAudio();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
