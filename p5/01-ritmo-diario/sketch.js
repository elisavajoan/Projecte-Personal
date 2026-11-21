let horas = [0, 6.50, 11, 13, 22.40]
let caracteres = [30, 10, 79, 15, 10]

function setup() {
  createCanvas(400, 400);
  noLoop()
  noFill()
}

function draw() {
  background( 112, 0, 65, 40);
  for( let indice = 0; indice < horas.lenght; indice=indice+1 ){
    print(indice)
    let tiempo = map(horas[indice], 0, 24, 0, 400)
    circle(tiempo, 200, caracteres[indice])
  }
}