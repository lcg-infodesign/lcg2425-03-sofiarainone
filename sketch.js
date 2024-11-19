//i continenti sono stati rappresentanti come dei glifi che ricordano una macchia d'acqua
//hanno i colori verde, blu e marrone per ricordare i colori della natura, del mare e della terra
//la rappresentazione evidenzia il numero di fiumi per dontinente, la loro lunghezza e la loro area
//l'area è rappresentata da un cerchio mentre la lunghezza da una linea ondulata
//i continenti hanno una grandezza che è proporzionata al numero di fiumi che contengono

let dati;

// sfumatura del glifo
let coloreSfondo = "beige";  
let coloreIniziale;  //marrone
let coloreMedio;    //verde 
let coloreFinale;    //blu 
let coloreTesto = "#0066CC";  //blu scuro

// per responsive
let dimensioneBase;
let distanzaOrizzontale;
let distanzaVerticale;
let raggioContinentaleBase;
let dimensioneFont;
let dimensioneFontFiumi;
let spaziaturaFiumi;
let margine; 

//griglia
let righe = 2;
let colonne = 3;
let continentiSecondaRiga = 4;

//titolo
let dimensioneFontTitolo;

function preload() {
  dati = loadTable("assets/rivers.csv", "csv", "header");
}

function setup() {
  coloreIniziale = color(210, 180, 140);
  coloreMedio = color(144, 238, 144);
  coloreFinale = color(173, 216, 230);
  createCanvas(windowWidth, windowHeight);
  noLoop();
  
}

function calcolaDimensioniResponsive() {
  margine = min(windowWidth, windowHeight) * 0.05;
  
  let larghezzaEffettiva = windowWidth - (margine * 2);
  let altezzaEffettiva = windowHeight - (margine * 2);
  
  dimensioneBase = min(larghezzaEffettiva, altezzaEffettiva) / 9;
  distanzaOrizzontale = larghezzaEffettiva / (colonne + 0.7);
  distanzaVerticale = altezzaEffettiva / (righe + 0.7);
  raggioContinentaleBase = dimensioneBase * 1.3;
  dimensioneFont = dimensioneBase * 0.25;
  dimensioneFontFiumi = dimensioneBase * 0.09;
  spaziaturaFiumi = dimensioneFontFiumi * 3.2;

  //font del titolo proporzionale alla dimensione della finestra
  dimensioneFontTitolo = min(windowWidth, windowHeight) * 0.04;
}

function draw() {
  background(coloreSfondo); 
  calcolaDimensioniResponsive();
  disegnaTitolo();     
  disegnaLegenda(); 
  impostaPosizioniContinenti();
}

function impostaPosizioniContinenti() {
  //oggetto in cui i continenti sono le chiavi e i valori sono array contenenti i fiumi associati a quel continente.
  let gruppiContinenti = raggruppaPerContinente();
  let continenti = Object.keys(gruppiContinenti);
  //griglia
  let larghezzaTotalePrimaRiga = (colonne - 1) * distanzaOrizzontale;
  let larghezzaTotaleSecondaRiga = (continentiSecondaRiga - 1) * distanzaOrizzontale;
  //allineare orizzontalmente al centro 
  let offsetXPrimaRiga = margine + (width - 2 * margine - larghezzaTotalePrimaRiga) / 2;
  let offsetXSecondaRiga = margine + (width - 2 * margine - larghezzaTotaleSecondaRiga) / 2;

  continenti.forEach((continente, indice) => {
    let riga = indice < colonne ? 0 : 1; //// la riga in cui verrà posizionato in base al suo indice
    let colonna = riga === 0 ? indice : indice - colonne; //calcola colonna
    //posizione centrale del continente
    let offsetX = riga === 0 ? offsetXPrimaRiga : offsetXSecondaRiga;
    let xPos = offsetX + colonna * distanzaOrizzontale;
    let yPos = margine + distanzaVerticale + riga * distanzaVerticale; 
  
    ///numero massimo di fiumi per continente
    let maxFiumi = Math.max(
      ...Object.values(gruppiContinenti).map(fiumi => fiumi.length)
    );
    //regola il raggio del continente proporzionalmente al numero di fiumi
    let raggioContinentale = calcolaRaggioContinentale(
      gruppiContinenti[continente].length,
      maxFiumi
    );
    //colori del gradiente che rappresentano le caratteristiche geografiche del continente
    let coloreGradiente = creaColoreGradiente(
      coloreIniziale,
      coloreMedio,
      coloreFinale,
      xPos,
      yPos,
      raggioContinentale
    );
    //grafica del continente
    formaContinenti(
      xPos,
      yPos,
      raggioContinentale,
      coloreGradiente,
      continente,
      gruppiContinenti[continente]
    );
  });
  
}
//dimensione del raggio di un continente in base al numero di fiumi associati a quel continente
//scalato rispetto al numero massimo di fiumi di tutti i continenti
function calcolaRaggioContinentale(numeroFiumi, maxFiumi) {
  let fattoreScala = map(numeroFiumi, 1, maxFiumi, 0.7, 1.3);
  return raggioContinentaleBase * fattoreScala;
}
//raggruppa dati
function raggruppaPerContinente() {
  let gruppi = {};
  for (let riga of dati.rows) {
    let continente = riga.get('continent');
    if (!gruppi[continente]) {
      gruppi[continente] = [];
    }
    gruppi[continente].push(riga);
  }
  return gruppi;
}
//fare il gradiente per sfumatura
function creaColoreGradiente(coloreIniziale, coloreMedio, coloreFinale, x, y, dimensione) {
  let gradiente = drawingContext.createRadialGradient(x, y, 0, x, y, dimensione);
  gradiente.addColorStop(0, coloreIniziale.toString());
  gradiente.addColorStop(0.5, coloreMedio.toString());
  gradiente.addColorStop(1, coloreFinale.toString());
  return gradiente;
}
//forma glifo dei continenti
function formaContinenti(x, y, dimensione, coloreGradiente, continente, fiumi) {
  noStroke();
  drawingContext.fillStyle = coloreGradiente;

  beginShape();
  let punti = 50;
  for (let j = 0; j <= punti; j++) {
    let angolo = map(j, 0, punti, 0, TWO_PI);
    let r = dimensione + random(-dimensione * 0.3, dimensione * 0.3);
    let xOffset = cos(angolo) * r;
    let yOffset = sin(angolo) * r;
    let fattoreRumore = noise(x + cos(angolo) * 100, y + sin(angolo) * 100) * 0.4;// visto in aula per generare forme fluide
    xOffset += random(-fattoreRumore, fattoreRumore);
    yOffset += random(-fattoreRumore, fattoreRumore);
    curveVertex(x + xOffset, y + yOffset);
  }
  endShape(CLOSE);

  fill(coloreTesto);
  textAlign(CENTER, CENTER);
  textSize(dimensioneFont);
  text(continente, x, y - dimensione - dimensioneFont);
  // cambio degli errori di scrittura 
  let testoFiumi = fiumi.length === 1 ? "river" : "rivers";
  textSize(dimensioneFont * 0.6);
  let distanzaTraTesti = dimensioneFont * 0.8;
  text(fiumi.length + " " + testoFiumi, x, y - dimensione - dimensioneFont - distanzaTraTesti);

  disegnaFiumiVerticalmente(x, y, dimensione, fiumi);
}
//glifi dei fiumi
function disegnaFiumiVerticalmente(x, y, dimensione, fiumi) {
  fiumi.sort((a, b) => parseFloat(b.get('length')) - parseFloat(a.get('length')));
  //ordinati in ordine decrescente di lunghezza 
  //estrae la lunghezza di ogni fiume come stringa parseFloat la converte in numero
  let lunghezzaMassima = parseFloat(fiumi[0].get('length'));
  let areaMassima = Math.max(...fiumi.map(f => parseFloat(f.get('area'))));
  let altezzaTotale = fiumi.length * spaziaturaFiumi;
//calcola lo spazio necessario per disporre tutti i fiumi con la spaziatura attuale
//se l'altezza totale supera lo spazio massimo disponibile, la spaziatura viene ridotta proporzionalmente
  let altezzaDisponibileMassima = dimensione * 1.5;
  if (altezzaTotale > altezzaDisponibileMassima) {
    spaziaturaFiumi = altezzaDisponibileMassima / fiumi.length;
  }
  //aumenta dinamicamente la spaziatura tra i fiumi se ci sono più di 5 fiumi
  //se il numero di fiumi è maggiore di 5 il moltiplicatore è 1.3 altrimenti è 1.
  let moltiplicatoreDinamicoSpaziatura = fiumi.length > 5 ? 1.3 : 1;
  spaziaturaFiumi *= moltiplicatoreDinamicoSpaziatura;
  
  let inizioY = y - (fiumi.length * spaziaturaFiumi) / 2;
  let larghezzaMassima = dimensione * 0.7;
  let margineTraCerchioEFiume = dimensioneFontFiumi * 2.5;

  fiumi.forEach((fiume, i) => {
    let lunghezzaFiume = parseFloat(fiume.get('length'));//lunghezza del fiume scalata in modo proporzionale al massimo valore
    let areaFiume = parseFloat(fiume.get('area'));
    let larghezzaScalata = map(lunghezzaFiume, 0, lunghezzaMassima, larghezzaMassima * 0.3, larghezzaMassima);
    //posizione verticale del fiume incrementata con la spaziatura per ogni fiume
    let yFiume = inizioY + i * spaziaturaFiumi;
    let inizioX = x - larghezzaScalata / 2;
    let fineX = x + larghezzaScalata / 2;
    //dimensione del cerchio proporzionale all'area del fiume
    let dimensioneMinimaCerchio = dimensioneFontFiumi * 0.2;
    let dimensioneMassimaCerchio = dimensioneFontFiumi * 1;
    let dimensioneCerchio = map(areaFiume, 0, areaMassima, dimensioneMinimaCerchio, dimensioneMassimaCerchio);
    //cerchio glifo area
    noStroke();
    fill(0, 100, 255, 100);
    let cerchioX = inizioX - margineTraCerchioEFiume - dimensioneCerchio / 2;
    circle(cerchioX, yFiume, dimensioneCerchio);
    
    stroke(0, 100, 255, 150);
    strokeWeight(dimensioneBase * 0.007);
    noFill();
    // glifo fiume linea ondulata
    beginShape();
    vertex(inizioX, yFiume);
    for (let j = 0; j <= 3; j++) {
      let t = j / 3;
      let correnteX = lerp(inizioX, fineX, t);
      let correnteY = yFiume + sin(TWO_PI * t) * (larghezzaScalata * 0.08);
      curveVertex(correnteX, correnteY);
    }
    vertex(fineX, yFiume);
    endShape();
    //nome del fiume scritto accanto alla linea
    fill(coloreTesto);
    textSize(dimensioneFontFiumi);
    textAlign(LEFT, CENTER);
    text(fiume.get('name'), fineX + dimensioneFontFiumi * 2.5, yFiume);
  });
}
function disegnaLegenda() {
   //posizione legenda in alto a sinistra
   const legendX = margine * 1.2;  
   const legendY = margine + dimensioneFontTitolo + margine / 2; 
   const spacing = dimensioneBase * 0.5;  //distanza tra gli elementi della legenda
   
   //glifi
   const circleSize = dimensioneBase * 0.15;
   const lineLength = dimensioneBase * 0.4;
   const textOffset = dimensioneBase * 0.5;
   const glifoCenterX = legendX + circleSize / 2; //punto centrale per allineare tutti i glifi
   
   if (legendY + 4 * spacing > windowHeight) {
     //se la legenda sta per uscire dalla finestraspostala sopra
     legendY = windowHeight - (4 * spacing);  //una Y che la mantenga visibile
   }
   
   textAlign(LEFT, CENTER);
   textSize(dimensioneFontFiumi * 1.7); 
   fill(coloreTesto);
   
   // area del fiume
   noStroke();
   fill(0, 100, 255, 100);
   circle(glifoCenterX, legendY, circleSize);
   fill(coloreTesto);
   text("River area", glifoCenterX + textOffset, legendY);
   
   //lunghezza del fiume
   const lineY = legendY + spacing;
   stroke(0, 100, 255, 150);
   strokeWeight(dimensioneBase * 0.007);
   noFill();
   beginShape();
   let startX = glifoCenterX - lineLength / 2;
   let endX = glifoCenterX + lineLength / 2;
   vertex(startX, lineY);
   for (let i = 0; i <= 4; i++) {
     let t = i / 3;
     let currentX = lerp(startX, endX, t);
     let currentY = lineY + sin(TWO_PI * t) * (lineLength * 0.09);
     curveVertex(currentX, currentY);
   }
   endShape();
   
   noStroke();
   fill(coloreTesto);
   text("River length", glifoCenterX + textOffset, lineY);
   
   //continente
   const continentY = lineY + spacing;
   const continentSize = dimensioneBase * 0.4;
   
   //gradiente
   let gradiente = drawingContext.createRadialGradient(
     glifoCenterX, continentY, 0,
     glifoCenterX, continentY, continentSize / 2
   );
   
   gradiente.addColorStop(0, coloreIniziale.toString());
   gradiente.addColorStop(0.5, coloreMedio.toString());
   gradiente.addColorStop(1, coloreFinale.toString());
   
   //gradiente
   noStroke();
   drawingContext.fillStyle = gradiente;
   beginShape();
   let punti = 50;
   for (let i = 0; i <= punti; i++) {
     let angolo = map(i, 0, punti, 0, TWO_PI);
     let r = continentSize / 2 + random(-continentSize * 0.15, continentSize * 0.15);
     let xOffset = cos(angolo) * r;
     let yOffset = sin(angolo) * r;
     curveVertex(glifoCenterX + xOffset, continentY + yOffset);
   }
   endShape(CLOSE);
   
   fill(coloreTesto);
   text("Continent", glifoCenterX + textOffset, continentY);
   // descrizione
   const descriptionY = continentY + spacing;
   textSize(dimensioneFontFiumi * 1.2);
   textAlign(LEFT);
   text("The glyphs look like a patch of water", legendX, descriptionY);
   text("but have the colors found on continents:", legendX, descriptionY + dimensioneFontFiumi * 1.5);
   text("brown, green and blue", legendX, descriptionY + dimensioneFontFiumi * 3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();  
}

// titolo
function disegnaTitolo() {
  textSize(dimensioneFontTitolo);  //dimensione dinamica per il titolo
  textAlign(CENTER, TOP);
  fill(coloreTesto);
  text("Rivers of the World", width / 2, margine); //titolo in cima alla tela
} 