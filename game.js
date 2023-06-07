<!DOCTYPE html>
<html>
  <head>
    <style>
      canvas {
        border: 1px solid black;
      }
    </style>
  </head>
  <body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>

    <script>
      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");

      // Game state
      const GameState = {
        TITLE: 0,
        CHARACTER_SELECT: 1,
        IN_GAME: 2,
      };
      let gameState = GameState.TITLE;

      // Title screen variables
      let fadeOpacity = 0;
      let fadeIn = true;

      // Character select variables
      let selectedCharacterIndex = 0;
      let selectedCharacter = {};
      let selectedCharacterForms = [];

      // Character options
      const characterOptions = [
        {
          name: "Tanjiro",
          color: "green",
          forms: [
            "Water Breathing: First Form - Water Surface Slash",
            "Water Breathing: Second Form - Water Wheel",
            "Water Breathing: Third Form - Flowing Dance",
            "Water Breathing: Fourth Form - Striking Tide",
            "Water Breathing: Fifth Form - Blessed Rain after the Drought",
            "Water Breathing: Sixth Form - Twisting Whirlpool",
            "Water Breathing: Seventh Form - Piercing Rain Drop",
            "Water Breathing: Eighth Form - Waterfall Basin",
            "Water Breathing: Ninth Form - Splashing Water Flow",
            "Water Breathing: Tenth Form - Constant Flux",
          ],
        },
        {
          name: "Inosuke",
          color: "orange",
          forms: [
            "Beast Breathing: First Fang - Fang Unleashing",
            "Beast Breathing: Second Fang - Roaring Thunder",
            "Beast Breathing: Third Fang - Devastating Swarm",
            "Beast Breathing: Fourth Fang - Extreme Roar",
            "Beast Breathing: Fifth Fang - Piercing Strike",
            "Beast Breathing: Sixth Fang - Beast Hurricane",
            "Beast Breathing: Seventh Fang - Raging Fang",
            "Beast Breathing: Eighth Fang - Flash Strike",
            "Beast Breathing: Ninth Fang - Tearing Slash",
            "Beast Breathing: Tenth Fang - Adamant Barrage",
          ],
        },
        {
          name: "Zenitsu",
          color: "yellow",
          forms: [
            "Thunder Breathing: First Form - Thunderclap and Flash",
            "Thunder Breathing: Second Form - Rising Scorching Sun",
            "Thunder Breathing: Third Form - Moonlit Eleventh Form",
            "Thunder Breathing: Fourth Form - Dragonflash",
            "Thunder Breathing: Fifth Form - Lightning Flash",
            "Thunder Breathing: Sixth Form - Thunder Swarm",
            "Thunder Breathing: Seventh Form - Sound and Lightning",
            "Thunder Breathing: Eighth Form - Thunderclap and Flash, Six Fold",
            "Thunder Breathing: Ninth Form - God Speed Thunderclap and Flash",
            "Thunder Breathing: Tenth Form - Hinokami Kagura, First Style: Thunderclap and Flash",
          ],
        },
      ];

      // Animation variables
      let animationFrame;
      let moveAnimationFrames = 30;
      let moveAnimationFrame = 0;

      // Cooldown variables
      const breathingStyleCooldown = 2000;
      let canUseBreathingStyle = true;

      // Player variables
      let playerX = 100;
      let playerY = canvas.height - 120;
      const playerWidth = 50;
      const playerHeight = 100;
      const playerColor = "red";
      let playerMoveSpeed = 5;
      let playerIsAttacking = false;

      // Enemy variables
      let enemyX = canvas.width - 150;
      let enemyY = canvas.height - 120;
      const enemyWidth = 50;
      const enemyHeight = 100;
      const enemyColor = "purple";

      // Breathing style move variables
      const BreathingStyleMove = {
        WATER_SURFACE_SLASH: 0,
        WATER_WHEEL: 1,
        FLOWING_DANCE: 2,
        STRIKING_TIDE: 3,
        BLESSED_RAIN: 4,
        TWISTING_WHIRLPOOL: 5,
        PIERCING_RAIN_DROP: 6,
        WATERFALL_BASIN: 7,
        SPLASHING_WATER_FLOW: 8,
        CONSTANT_FLUX: 9,
        FANG_UNLEASHING: 10,
        ROARING_THUNDER: 11,
        DEVASTATING_SWARM: 12,
        EXTREME_ROAR: 13,
        PIERCING_STRIKE: 14,
        BEAST_HURRICANE: 15,
        RAGING_FANG: 16,
        FLASH_STRIKE: 17,
        TEARING_SLASH: 18,
        ADAMANT_BARRAGE: 19,
        THUNDERCLAP_FLASH: 20,
        RISING_SCORCHING_SUN: 21,
        MOONLIT_ELEVENTH_FORM: 22,
        DRAGONFLASH: 23,
        LIGHTNING_FLASH: 24,
        THUNDER_SWARM: 25,
        SOUND_AND_LIGHTNING: 26,
        THUNDERCLAP_FLASH_SIX_FOLD: 27,
        GOD_SPEED_THUNDERCLAP_FLASH: 28,
        HINOKAMI_KAGURA: 29,
      };

      // Initialize the game
      function init() {
        // Add event listeners
        canvas.addEventListener("click", handleButtonClick);
        canvas.addEventListener("mousemove", handleCharacterHover);

        // Start game loop
        gameLoop();
      }

      // Game loop
      function gameLoop() {
        // Update game state
        update();
        // Render game state
        render();

        // Continue game loop
        animationFrame = requestAnimationFrame(gameLoop);
      }

      // Update game state
      function update() {
        if (gameState === GameState.TITLE) {
          // Update title screen fade animation
          if (fadeIn) {
            fadeOpacity += 0.02;
            if (fadeOpacity >= 1) {
              fadeIn = false;
            }
          } else {
            fadeOpacity -= 0.02;
            if (fadeOpacity <= 0) {
              fadeIn = true;
            }
          }
        } else if (gameState === GameState.IN_GAME) {
          // Update player movement
          if (keys.ArrowLeft) {
            playerX -= playerMoveSpeed;
          }
          if (keys.ArrowRight) {
            playerX += playerMoveSpeed;
          }

          // Keep player within canvas bounds
          if (playerX < 0) {
            playerX = 0;
          }
          if (playerX + playerWidth > canvas.width) {
            playerX = canvas.width - playerWidth;
          }

          // Handle breathing style moves
          if (!playerIsAttacking) {
            if (keys.Digit1) {
              useBreathingStyleMove(BreathingStyleMove.WATER_SURFACE_SLASH);
            } else if (keys.Digit2) {
              useBreathingStyleMove(BreathingStyleMove.WATER_WHEEL);
            } else if (keys.Digit3) {
              useBreathingStyleMove(BreathingStyleMove.FLOWING_DANCE);
            } else if (keys.Digit4) {
              useBreathingStyleMove(BreathingStyleMove.STRIKING_TIDE);
            } else if (keys.Digit5) {
              useBreathingStyleMove(BreathingStyleMove.BLESSED_RAIN);
            } else if (keys.Digit6) {
              useBreathingStyleMove(BreathingStyleMove.TWISTING_WHIRLPOOL);
            } else if (keys.Digit7) {
              useBreathingStyleMove(BreathingStyleMove.PIERCING_RAIN_DROP);
            } else if (keys.Digit8) {
              useBreathingStyleMove(BreathingStyleMove.WATERFALL_BASIN);
            } else if (keys.Digit9) {
              useBreathingStyleMove(BreathingStyleMove.SPLASHING_WATER_FLOW);
            } else if (keys.Digit0) {
              useBreathingStyleMove(BreathingStyleMove.CONSTANT_FLUX);
            }
          }
        }
      }

      // Render game state
      function render() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameState === GameState.TITLE) {
          // Render title screen
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Render title text
          ctx.font = "40px Arial";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText("Demon Slayer Fangame", canvas.width / 2, canvas.height / 2 - 50);

          // Render start button
          ctx.fillStyle = "gray";
          ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 50);
          ctx.fillStyle = "white";
          ctx.font = "20px Arial";
          ctx.fillText("Start", canvas.width / 2, canvas.height / 2 + 85);

          // Render fade animation
          ctx.fillStyle = `rgba(255, 255, 255, ${fadeOpacity})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (gameState === GameState.CHARACTER_SELECT) {
          // Render character select screen
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Render character options
          for (let i = 0; i < characterOptions.length; i++) {
            const optionX = canvas.width / 2 - 100;
            const optionY = canvas.height / 2 - 100 + i * 100;

            // Render character box
            ctx.fillStyle = characterOptions[i].color;
            ctx.fillRect(optionX, optionY, 200, 80);

            // Render character name
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(characterOptions[i].name, canvas.width / 2, optionY + 50);
          }
        } else if (gameState === GameState.IN_GAME) {
          // Render game screen
          ctx.fillStyle = "blue";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Render ground
          ctx.fillStyle = "gray";
          ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

          // Render player
          ctx.fillStyle = playerColor;
          ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

          // Render enemy
          ctx.fillStyle = enemyColor;
          ctx.fillRect(enemyX, enemyY, enemyWidth, enemyHeight);

          // Render breathing style forms
          ctx.fillStyle = "white";
          ctx.font = "20px Arial";
          ctx.textAlign = "left";
          for (let i = 0; i < selectedCharacterForms.length; i++) {
            const formX = 10;
            const formY = 30 + i * 30;
            ctx.fillText(selectedCharacterForms[i], formX, formY);
          }

          // Render cooldown timer
          ctx.fillStyle = "white";
          ctx.font = "18px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            `Cooldown: ${canUseBreathingStyle ? "Ready" : (breathingStyleCooldown / 1000).toFixed(1)}s`,
            canvas.width / 2,
            canvas.height - 10
          );
        }
      }

      // Handle button click
      function handleButtonClick(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (gameState === GameState.TITLE) {
          // Check if start button is clicked
          const startButtonX = canvas.width / 2 - 50;
          const startButtonY = canvas.height / 2 + 50;
          const startButtonWidth = 100;
          const startButtonHeight = 50;
          if (
            mouseX >= startButtonX &&
            mouseX <= startButtonX + startButtonWidth &&
            mouseY >= startButtonY &&
            mouseY <= startButtonY + startButtonHeight
          ) {
            gameState = GameState.CHARACTER_SELECT;
          }
        } else if (gameState === GameState.CHARACTER_SELECT) {
          // Check if character box is clicked
          for (let i = 0; i < characterOptions.length; i++) {
            const optionX = canvas.width / 2 - 100;
            const optionY = canvas.height / 2 - 100 + i * 100;
            const optionWidth = 200;
            const optionHeight = 80;

            if (
              mouseX >= optionX &&
              mouseX <= optionX + optionWidth &&
              mouseY >= optionY &&
              mouseY <= optionY + optionHeight
            ) {
              selectedCharacterIndex = i;
              selectedCharacter = characterOptions[i];
              selectedCharacterForms = characterOptions[i].forms;
              gameState = GameState.IN_GAME;
              break;
            }
          }
        }
      }

      // Handle character hover
      function handleCharacterHover(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (gameState === GameState.CHARACTER_SELECT) {
          // Check if character box is hovered
          for (let i = 0; i < characterOptions.length; i++) {
            const optionX = canvas.width / 2 - 100;
            const optionY = canvas.height / 2 - 100 + i * 100;
            const optionWidth = 200;
            const optionHeight = 80;

            if (
              mouseX >= optionX &&
              mouseX <= optionX + optionWidth &&
              mouseY >= optionY &&
              mouseY <= optionY + optionHeight
            ) {
              ctx.fillStyle = "white";
              ctx.font = "20px Arial";
              ctx.textAlign = "center";
              ctx.fillText(characterOptions[i].name, canvas.width / 2, optionY - 10);
              break;
            }
          }
        }
      }

      // Handle keydown event
      const keys = {};
      document.addEventListener("keydown", (event) => {
        keys[event.code] = true;
      });

      // Handle keyup event
      document.addEventListener("keyup", (event) => {
        keys[event.code] = false;
      });

      // Use breathing style move
      function useBreathingStyleMove(move) {
        if (canUseBreathingStyle) {
          playerIsAttacking = true;
          canUseBreathingStyle = false;

          // Perform move animation
          moveAnimationFrame = 0;
          animateMove();

          // Set cooldown timer
          setTimeout(() => {
            canUseBreathingStyle = true;
          }, breathingStyleCooldown);
        }
      }

      // Animate breathing style move
      function animateMove() {
        if (moveAnimationFrame < moveAnimationFrames) {
          // Perform animation
          // Example: Draw a line to represent the hitbox of the move
          ctx.strokeStyle = "white";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(playerX + playerWidth / 2, playerY + playerHeight / 2);
          ctx.lineTo(playerX + playerWidth / 2 + 100, playerY + playerHeight / 2);
          ctx.stroke();

          moveAnimationFrame++;
          requestAnimationFrame(animateMove);
        } else {
          // Animation finished
          playerIsAttacking = false;
        }
      }

      // Initialize the game
      init();
    </script>
  </body>
</html>
