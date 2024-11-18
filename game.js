// Get references to HTML elements
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const playButton = document.getElementById("play-btn");
const pauseButton = document.getElementById("pause-btn");
const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("gameover-sound");
const btnSound = document.getElementById("button-sound");

// Game settings
const gridSize = 15; // Size of each tile in pixels
const tileCount = 20; // Number of tiles in each direction
let snake = [{ x: 9, y: 9 }]; // Initial position of the snake
let food = { x: 5, y: 5 }; // Initial position of the food
let direction = { x: 1, y: 0 }; // Initial direction: right
let score = 0; // Initial score
let speed = 150; // Initial speed (in milliseconds)
let gameInterval; // Variable to hold the game interval
let isGameRunning = false; // Track whether the game is running

// Function to create food at a random position
function createFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

// Function to draw the game elements (snake and food)
function draw() {
  gameArea.innerHTML = ""; // Clear the game area

  // Draw the snake
  snake.forEach((segment, index) => {
    const snakeSegment = document.createElement("div");
    snakeSegment.classList.add("snake");
    snakeSegment.style.width = `${gridSize}px`;
    snakeSegment.style.height = `${gridSize}px`;
    snakeSegment.style.transform = `translate3d(${segment.x * gridSize}px, ${
      segment.y * gridSize
    }px, 0)`;
    gameArea.appendChild(snakeSegment); // Add to the game area

    // Draw eyes only on the head (first segment)
    if (index === 0) {
      const eyeSize = gridSize / 4; // Size of the eyes

      // Create left eye
      const leftEye = document.createElement("div");
      leftEye.classList.add("eye");
      leftEye.style.width = `${eyeSize}px`;
      leftEye.style.height = `${eyeSize}px`;
      leftEye.style.transform = `translate3d(${
        segment.x * gridSize + (3 * gridSize) / 4
      }px, ${segment.y * gridSize + gridSize / 4}px, 0)`;

      // Create right eye
      const rightEye = document.createElement("div");
      rightEye.classList.add("eye");
      rightEye.style.width = `${eyeSize}px`;
      rightEye.style.height = `${eyeSize}px`;
      rightEye.style.transform = `translate3d(${
        segment.x * gridSize + gridSize / 4
      }px, ${segment.y * gridSize + gridSize / 4}px, 0)`;

      gameArea.appendChild(leftEye);
      gameArea.appendChild(rightEye);
    }
  });

  // Create the food element
  const foodElement = document.createElement("div");
  foodElement.classList.add("food");
  foodElement.style.width = `${gridSize}px`;
  foodElement.style.height = `${gridSize}px`;
  foodElement.style.transform = `translate3d(${food.x * gridSize}px, ${
    food.y * gridSize
  }px, 0)`;
  gameArea.appendChild(foodElement); // Add to the game area
}

// Function to update game state
function update() {
  // Calculate the new head position based on the current direction
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score++; // Increase score
    scoreDisplay.innerText = score; // Update score display
    createFood(); // Create new food

    // Play eat sound
    eatSound.currentTime = 0; // Reset audio to the start
    eatSound.play();

    // Increase speed every 5 points
    if (score % 5 === 0) {
      speed = Math.max(50, speed - 10); // Decrease speed, but not below 50ms
      clearInterval(gameInterval); // Clear the current interval
      gameInterval = setInterval(gameLoop, speed); // Restart game loop with new speed
    }
  } else {
    snake.pop(); // Remove the tail segment if no food eaten
  }

  snake.unshift(head); // Add new head to the snake

  // Check for collisions with walls or self
  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    // Play game over sound
    gameOverSound.currentTime = 0; // Reset audio to the start
    gameOverSound.play();

    alert("Game Over! Your score was: " + score); // Alert the player
    resetGame(); // Reset the game
  }
}

// Function to reset the game
function resetGame() {
  score = 0; // Reset score
  scoreDisplay.innerText = score; // Update score display
  direction = { x: 1, y: 0 }; // Reset direction to right
  snake = [{ x: 9, y: 9 }]; // Reset snake position
  speed = 150; // Reset speed to initial value
  isGameRunning = false; // Set game state to not running
  clearInterval(gameInterval); // Clear the current game interval
  createFood(); // Create new food
  playButton.style.display = "block"; // Show play button
}

// Main game loop function
function gameLoop() {
  if (isGameRunning) {
    update(); // Update game state
    draw(); // Draw game elements
  }
}

// Function to start the game
function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    gameInterval = setInterval(gameLoop, speed);
    // playButton.style.display = "none";
    pauseButton.style.display = "block";
    btnSound.currentTime = 0; // Reset sound to the start
    btnSound.play(); // Play the button click sound
  }
}

// Function to pause the game
function pauseGame() {
  if (isGameRunning) {
    isGameRunning = false;
    clearInterval(gameInterval);
    playButton.style.display = "block";
    // pauseButton.style.display = "none";
    btnSound.currentTime = 0; // Reset sound to the start
    btnSound.play(); // Play the button click sound
  }
}

// Attach event listeners for play and pause buttons
playButton.addEventListener("click", startGame);
btnSound.currentTime = 0; // Reset sound to the start
btnSound.play(); // Play the button click sound
pauseButton.addEventListener("click", pauseGame);
btnSound.currentTime = 0; // Reset sound to the start
btnSound.play(); // Play the button click sound

// Control the snake's direction with arrow keys
document.addEventListener("keydown", (event) => {
  if (!isGameRunning) return; // Ignore key presses if the game is not running
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 }; // Change direction to up
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 }; // Change direction to down
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 }; // Change direction to left
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 }; // Change direction to right
      break;
  }
});

// Add touch controls for mobile devices
let touchStartX, touchStartY;

gameArea.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

gameArea.addEventListener("touchmove", (event) => {
  if (!isGameRunning) return; // Ignore touch if the game is not running
  event.preventDefault(); // Prevent scrolling
  const touchEndX = event.touches[0].clientX;
  const touchEndY = event.touches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Determine swipe direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && direction.x === 0)
      direction = { x: 1, y: 0 }; // Right swipe
    else if (direction.x === 0) direction = { x: -1, y: 0 }; // Left swipe
  } else {
    // Vertical swipe
    if (deltaY > 0 && direction.y === 0)
      direction = { x: 0, y: 1 }; // Down swipe
    else if (direction.y === 0) direction = { x: 0, y: -1 }; // Up swipe
  }

  touchStartX = touchEndX;
  touchStartY = touchEndY;
});

// Add event listeners for arrow buttons
document.getElementById("up-btn").addEventListener("click", () => {
  if (isGameRunning && direction.y === 0) direction = { x: 0, y: -1 };
  btnSound.currentTime = 0; // Reset sound to the start
  btnSound.play(); // Play the button click sound
});

document.getElementById("down-btn").addEventListener("click", () => {
  if (isGameRunning && direction.y === 0) direction = { x: 0, y: 1 };
  btnSound.currentTime = 0; // Reset sound to the start
  btnSound.play(); // Play the button click sound
});

document.getElementById("left-btn").addEventListener("click", () => {
  if (isGameRunning && direction.x === 0) direction = { x: -1, y: 0 };
  btnSound.currentTime = 0; // Reset sound to the start
  btnSound.play(); // Play the button click sound
});

document.getElementById("right-btn").addEventListener("click", () => {
  if (isGameRunning && direction.x === 0) direction = { x: 1, y: 0 };
  btnSound.currentTime = 0; // Reset sound to the start
  btnSound.play(); // Play the button click sound
});
