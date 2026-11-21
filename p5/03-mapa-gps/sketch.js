async function setup() {
  createCanvas(600, 400);
  //background(250, 80, 22);
  let kml = await loadXML('places.xml');
  // Para poner un mapa de fondo: sube la imagen al proyecto y cambia el nombre aquí
  // let mapa = await loadImage('mapa.png')
  // image(mapa, 0, 0, width, height)

  let pts =[...kml.DOM.getElementsByTagName('gx:coord')]
    .map(c => c.textContent.trim().split(' ').map(float));
   stroke(255, 0, 0);
  strokeWeight(2); 

  let lons = pts.map(p => p[0]);
  let lats = pts.map(p => p[1]);

  print(min(lons))
  print(max(lons))
  print(min(lats))
  print(max(lats))

  noFill();
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    vertex(map(lons[i], min(lons), max(lons), 0, 600),
           map(lats[i], min(lats), max(lats), 400, 0));
  }
  endShape();

}