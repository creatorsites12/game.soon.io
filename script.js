let basket;
let balls = [];
let score = 0;
let level = 1;
let basketMoveSpeed = 0;
let targetSpeed = 0;
let isSettingsOpen = false;
let fpsLimit = 60; // Ограничение FPS
let fpsOptions = [30, 60, 120]; // Доступные FPS
let currentFpsIndex = 1; // Индекс текущего FPS

function setup() {
  createCanvas(windowWidth, windowHeight); // Установка размеров канваса на весь экран
  basket = new Basket();
  frameRate(fpsLimit); // Установка начального FPS
}

function draw() {
  background(220);

  if (isSettingsOpen) {
    showSettings();
  } else {
    basket.show();
    
    // Обновить позицию корзины
    basketMoveSpeed += (targetSpeed - basketMoveSpeed) * 0.1;
    basket.move(basketMoveSpeed);

    for (let i = balls.length - 1; i >= 0; i--) {
      balls[i].update();
      balls[i].show();
      
      if (basket.catchBall(balls[i])) {
        score++;
        balls.splice(i, 1);
      } else if (balls[i].offScreen()) {
        balls.splice(i, 1);
      }
    }
    
    // Увеличение сложности с уровнем
    if (score > 0 && score % 20 === 0 && level < Math.floor(score / 20) + 1) {
      level++;
    }
    
    // Добавление новых шариков
    if (frameCount % (60 - level * 2) === 0) { // Увеличение сложности с уровнем
      balls.push(new Ball());
    }
    
    textSize(32);
    fill(0);
    text('Счет: ' + score, 10, 30);
    text('Уровень: ' + level, 10, 70);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    targetSpeed = -5;
  } else if (keyCode === RIGHT_ARROW) {
    targetSpeed = 5;
  } else if (keyCode === ESCAPE) {
    isSettingsOpen = !isSettingsOpen; // Переключаем меню настроек
  } else if (keyCode === ENTER) {
    let fs = fullscreen();
    fullscreen(!fs); // Переключение полноэкранного режима
  } else if (key === 'A' && isSettingsOpen) {
    // Изменение FPS при нажатии 'A' в меню настроек
    currentFpsIndex = (currentFpsIndex + 1) % fpsOptions.length; // Переключение на следующий FPS
    fpsLimit = fpsOptions[currentFpsIndex];
    frameRate(fpsLimit); // Обновление FPS
  } else if (key === 'F' && isSettingsOpen) {
    // Изменение FPS при нажатии 'F' в меню настроек
    currentFpsIndex = (currentFpsIndex + 1) % fpsOptions.length; // Переключение на следующий FPS
    fpsLimit = fpsOptions[currentFpsIndex];
    frameRate(fpsLimit); // Обновление FPS
  }
}

function keyReleased() {
  if (targetSpeed !== 0) {
    targetSpeed = 0;
  }
}

function showSettings() {
  background(100);
  fill(255);
  textSize(24);
  text('Настройки', width / 2 - 50, 50);
  text('Управление:', 20, 100);
  text('Левый: Стрелка влево', 20, 130);
  text('Правый: Стрелка вправо', 20, 160);
  
  // Кнопка для изменения FPS
  text('Текущий FPS: ' + fpsLimit, 20, 200);
  text('Нажмите "A" или "F" для изменения FPS', 20, 230);
  
  // Упоминание о вводе на английском
  text('Пожалуйста, вводите команды английскими буквами.', 20, 270);
  
  // Кнопка для выхода из настроек
  text('Нажмите ESC для выхода', 20, 310);
}

class Basket {
  constructor() {
    this.width = 100;
    this.height = 20;
    this.x = width / 2 - this.width / 2;
  }
  
  show() {
    fill(150);
    rect(this.x, height - this.height, this.width, this.height);
  }
  
  move(step) {
    this.x += step;
    this.x = constrain(this.x, 0, width - this.width);
  }
  
  catchBall(ball) {
    return ball.y + ball.radius >= height - this.height && ball.x > this.x && ball.x < this.x + this.width;
  }
}

class Ball {
  constructor() {
    this.radius = 15;
    this.x = random(this.radius, width - this.radius);
    this.y = 0;
    this.speed = 3;
  }
  
  update() {
    this.y += this.speed;
  }
  
  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.radius * 2);
  }
  
  offScreen() {
    return this.y > height;
  }
}
