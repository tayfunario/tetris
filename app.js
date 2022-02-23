// selectors
const body = document.querySelector('body')
const container = document.querySelector('.container')
const puan_SPAN = document.querySelector('#puan')
let boxes

// variables
let puan = 0
const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const leftLimit = [1, 16, 31, 46, 61, 76, 91, 106, 121, 136, 151, 166, 181, 196, 211, 226, 241, 256, 271, 286]

const rightLimit = [15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300]
const bottomLimit = [286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300]
let bottomLimit2 = bottomLimit.map((elem) => elem - 15)
bottomLimit2.push(...bottomLimit)

const topLimit = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
let landedBlocks = []
let mainInterval
let block = createBlock()

// constructor
function Block(type) {
    this.color = createColor()
    this.location = []
    this.type = type
    this.rotated = false
    switch (type) {
        case 'square':
            this.location.push(8, 9, 23, 24)
            break
        case 'z':
            this.location.push(8, 9, 23, 22)
            break
        case 't':
            this.location.push(7, 8, 9, 23)
            break
        case 'l':
            this.location.push(7, 8, 9, 24)
            break
        case 'i':
            this.location.push(7, 8, 9)
            break
    }
}

// event listener
document.addEventListener('keyup', function(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (!rotateControl() && !rotateControl2()) {
                rotate()
            }
            break
        case 'ArrowLeft':
            if (!blockContactLeft() && !dontCrossTheLeft()) {
                block.location = block.location.map((elem) => elem - 1)
            }
            break
        case 'ArrowRight':
            if (!blockContactRight() && !dontCrossTheRight()) {
                block.location = block.location.map((elem) => elem + 1)
            }
            break
        case 'ArrowDown':
            if (!block.location.some((elem) => bottomLimit2.includes(elem))) {
                fall()
            }
    }

    // bloğu son anda hareket ettirince hata oluşmasını engelliyor
    if (blockContact()) {
        landedBlocks.push(block)
        block = createBlock()
        repaintBlock()
        puan += 5
        puan_SPAN.innerHTML = puan
    }
    repaintBlock()
})

// functions
function loadBoxes() {
    for (let i = 0; i < 300; i++) {
        const box = document.createElement('div')
        box.classList.add('box')
        box.setAttribute('id', i + 1)
        container.appendChild(box)
    }
    boxes = document.querySelectorAll('.box')
}

function createBlock() {
    const random = Math.floor(Math.random() * 5)
        // const random = 4
    switch (random) {
        case 0:
            return new Block('square')
        case 1:
            return new Block('z')
        case 2:
            return new Block('t')
        case 3:
            return new Block('l')
        case 4:
            return new Block('i')
    }

}

function createColor() {
    const colorChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    let colorStr = '#'
    for (let i = 0; i < 6; i++) {
        randNum = Math.floor(Math.random() * 16)
        colorStr += colorChars[randNum]
    }
    return colorStr
}

function repaintBlock() {
    for (let i of boxes) {
        i.style.background = '#777'
    }
    for (let i of block.location) {
        boxes[i - 1].style.background = block.color
    }
    for (let i of landedBlocks) {
        for (let j of i.location) {
            boxes[j - 1].style.background = i.color
        }
    }
}

function dontCrossTheLeft() {
    return block.location.some((elem) => leftLimit.includes(elem))
}

function dontCrossTheRight() {
    return block.location.some((elem) => rightLimit.includes(elem))
}

// bu, blok başka bloğun tepesine binmiş mi onu kontrol ediyor
function blockContact() {
    for (let i of landedBlocks) {
        for (let j of i.location) {
            for (let k of block.location) {
                if (k == j - 15) {
                    return true
                }
            }
        }
    }
    return false
}

// bloğun sola basınca soldaki bloğun içine girmesini engelliyor
function blockContactLeft() {
    const allLoc = []
    for (let block of landedBlocks) {
        allLoc.push(...block.location)
    }

    for (let i of block.location) {
        if (allLoc.some((elem) => elem == i - 1)) {
            return true
        }
    }
    return false
}

// bloğun sağa basınca sağdaki bloğun içine girmesini engelliyor
function blockContactRight() {
    const allLoc = []
    for (let block of landedBlocks) {
        allLoc.push(...block.location)
    }

    for (let i of block.location) {
        if (allLoc.some((elem) => elem == i + 1)) {
            return true
        }
    }
    return false
}

function rotate() {
    switch (block.type) {
        case 'z':
            if (!block.rotated) {
                const oldLoc = block.location
                block.location = [oldLoc[0] - 1, oldLoc[0] + 14, oldLoc[0] + 15, oldLoc[0] + 30]
                block.rotated = true
            } else {
                const oldLoc = block.location
                block.location = [oldLoc[0] + 1, oldLoc[0] + 2, oldLoc[0] + 16, oldLoc[0] + 15]
                block.rotated = false
            }
            break
        case 't':
            if (!block.rotated) {
                const oldLoc = block.location
                block.location = [oldLoc[1] - 15, oldLoc[1], oldLoc[1] + 15, oldLoc[1] + 1]
                block.rotated = true
            } else {
                const oldLoc = block.location
                block.location = [oldLoc[1] - 1, oldLoc[1], oldLoc[1] + 1, oldLoc[1] + 15]
                block.rotated = false
            }
            break
        case 'l':
            if (!block.rotated) {
                const oldLoc = block.location
                block.location = [oldLoc[1] + 15, oldLoc[1], oldLoc[1] - 15, oldLoc[1] - 14]
                block.rotated = true
            } else {
                const oldLoc = block.location
                block.location = [oldLoc[1] + 1, oldLoc[1], oldLoc[1] - 1, oldLoc[1] + 16]
                block.rotated = false
            }
            break
        case 'i':
            if (!block.rotated) {
                const oldLoc = block.location
                block.location = [oldLoc[1] - 15, oldLoc[1], oldLoc[1] + 15]
                block.rotated = true
            } else {
                const oldLoc = block.location
                block.location = [oldLoc[1] - 1, oldLoc[1], oldLoc[1] + 1]
                block.rotated = false
            }
            break
    }
    repaintBlock()
}

function isFinished() {
    for (let i of landedBlocks) {
        if (i.location.some((elem) => topLimit.includes(elem))) {
            clearInterval(mainInterval)
            setTimeout(function() {
                location.reload()
            }, 1500)
        }
    }
}

// bu, blok en sol veya sağdayken çevirme yapılırsa ters taraftan çıkmasını engelliyor
function rotateControl() {
    switch (block.type) {
        case 'i':
            if ((block.rotated && block.location.some((elem) => leftLimit.includes(elem))) || (block.rotated && block.location.some((elem) => rightLimit.includes(elem)))) {
                return true
            }
            return false
        case 'z':
            if (block.rotated && block.location.some((elem) => rightLimit.includes(elem))) {
                return true
            }
            return false
        case 't':
            if (block.rotated && block.location.some((elem) => leftLimit.includes(elem))) {
                return true
            }
            return false
        case 'l':
            if (block.rotated && block.location.some((elem) => leftLimit.includes(elem))) {
                return true
            }
            return false
    }
}

// bu, bloğu çevirmeden önce yeterli boşluk var mı onu kontrol ediyor
function rotateControl2() {
    let allLoc = []
    for (let i of landedBlocks) {
        for (let j of i.location) {
            allLoc.push(j)
        }
    }

    switch (block.type) {
        case 'z':
            if (block.rotated) {
                return allLoc.includes(block.location[0] + 2)
            }
            break
        case 't':
            if (block.rotated) {
                return allLoc.includes(block.location[1] - 1)
            }
            break
        case 'l':
            if (block.rotated) {
                return allLoc.includes(block.location[1] - 1)
            }
            break
        case 'i':
            if (block.rotated) {
                if (allLoc.includes(block.location[1] - 1) || allLoc.includes(block.location[1] + 1)) {
                    return true
                } else {
                    return false
                }
            }
    }
}

function fall() {
    block.location = block.location.map((elem) => elem + 15)
}

// calling functions
loadBoxes()
repaintBlock()

// interval
mainInterval = setInterval(function() {
    block.location = block.location.map((elem) => elem + 15)
    repaintBlock()

    // burası blok tabana değdi mi onu kontrol eder
    if (block.location.some((elem) => bottomLimit.includes(elem))) {
        landedBlocks.push(block)
        block = createBlock()
        repaintBlock()
        puan += 5
        puan_SPAN.innerHTML = puan
    }

    // bu, blok başka bloğa değdi mi onu kontrol eder 
    if (blockContact()) {
        landedBlocks.push(block)
        block = createBlock()
        repaintBlock()
        puan += 5
        puan_SPAN.innerHTML = puan
    }
    isFinished()
}, 500)