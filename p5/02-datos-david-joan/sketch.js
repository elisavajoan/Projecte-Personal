let david
let joan

async function setup() {
  createCanvas(700, 600)
  david = await loadTable('david.csv', ',', 'header')
  joan = await loadTable('joan.csv', ',', 'header')
  noLoop()
}

function draw() {
  background(20,100,200)

  for (let row of david.rows) {
    let h2 = row.get(0)
    let l2 = row.get(1)
    let horas2 = map(float(h2), 0, 24, 0, width)
    fill(0, 0, 0)
    rect(horas2, height / 2, 3, -float(l2))
  }

  for (let row of joan.rows) {
    let h3 = row.get(0)
    let l3 = row.get(1)
    let horas3 = map(float(h3), 0, 24, 0, width)
    fill(255, 255, 255)
    rect(horas3, height / 2, 3, -float(l3))
  }
}
