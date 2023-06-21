const boardElement = document.querySelector('.board');

let lastRenderTime = 0; //tells time when last renders
const snakeSpeed = 5; //tells how many times the snake moves per second
const snakeBody = [{ x: 11, y: 11 }]
let gameOver = false
let newSegments = 0

//game loop, we make this to render the game over and over
function main(currentTime) { //this function runs in the currentTime
    if (gameOver) {
        if (confirm('You lost. Press ok to restart.')) {
            window.location = '/'
        }
        return
    }


    window.requestAnimationFrame(main) //recall main to set up new loop after this
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000 //adds a delay for when snake moves
    if (secondsSinceLastRender < 1 / snakeSpeed) return //calculates if we need to move

    console.log('render')
    lastRenderTime = currentTime //sets last render time to the current time
    //asks when browser when it can render next frame

    boardElement.innerHTML = ''

    draw()
    update()
    drawfood()
    updatefood()
};

window.requestAnimationFrame(main);

//snake

function update() {
    const inputDirection = getInputDirection()
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y

    checkDeath()
    addSegments()
}

function draw() {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        boardElement.appendChild(snakeElement)
    })
}

function expandSnake(amount) {
    newSegments += amount
}

function onSnake(position, { ignoreHead = false } = {}) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) return false
        return equalPositions(segment, position)
    })
}

function getSnakeHead() {
    return snakeBody[0]
}

function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    }

    newSegments = 0
}

//input direction

let inputDirection = { x: 0, y: 0 }
let lastInputDirection = { x: 0, y: 0 }


window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break
            inputDirection = { x: 0, y: -1 }
            break
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break
            inputDirection = { x: 0, y: 1 }
            break
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break
            inputDirection = { x: -1, y: 0 }
            break
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break
            inputDirection = { x: 1, y: 0 }
            break
    }
})

function getInputDirection() {
    lastInputDirection = inputDirection
    return inputDirection
}

//food

const GRID_SIZE = 21

function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * GRID_SIZE) + 1,
        y: Math.floor(Math.random() * GRID_SIZE) + 1
    }
}

let food = getRandomFoodPosition()
const EXPANSION_RATE = 1

function updatefood() {
    if (onSnake(food)) {
        expandSnake(EXPANSION_RATE)
        food = getRandomFoodPosition()
    }
}

function drawfood() {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    boardElement.appendChild(foodElement)
}


function getRandomFoodPosition() {
    let newFoodPosition
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition
}

//   grid


function outsideGrid(position) {
    return (
        position.x < 1 || position.x > GRID_SIZE ||
        position.y < 1 || position.y > GRID_SIZE
    )
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}