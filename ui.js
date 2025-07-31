window.UI = {
    drawHUD: function(ctx, player, wave, score, width, height) {
        // Score
        ctx.save();
        ctx.font = "bold 22px Segoe UI, Arial";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5;
        ctx.fillText("Score: " + score, 22, 38);

        // Health bar (player)
        ctx.save();
        ctx.translate(24, 54);
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, 200, 20);
        let hpPct = Math.max(0, player.health / window.CONSTANTS.PLAYER.MAX_HEALTH);
        let grad = ctx.createLinearGradient(0, 0, 200, 0);
        grad.addColorStop(0, "#5df4e2");
        grad.addColorStop(1, "#2d79fa");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 200 * hpPct, 20);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, 200, 20);

        // Health text
        ctx.font = "bold 13px Segoe UI, Arial";
        ctx.fillStyle = "#222";
        ctx.textAlign = "center";
        ctx.fillText(Math.round(player.health) + " / 100", 100, 15);
        ctx.restore();

        // Wave
        ctx.font = "bold 20px Segoe UI, Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "right";
        ctx.fillText("Wave: " + wave, width - 22, 38);

        ctx.restore();
    },

    drawStartMenu: function(ctx, width, height) {
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.fillStyle = "#222c";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.font = "bold 48px Segoe UI, Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 8;
        ctx.fillText("Coop vs. the FUD Monsters", width/2, height/2 - 60);

        ctx.font = "22px Segoe UI, Arial";
        ctx.fillStyle = "#d4e2ff";
        ctx.fillText("Arrow keys: Move / Jump | Z: Attack", width/2, height/2 + 12);
        ctx.fillText("Touch: On-screen controls", width/2, height/2 + 44);

        ctx.font = "bold 25px Segoe UI, Arial";
        ctx.fillStyle = "#ffe26a";
        ctx.fillText("Press Enter or Tap to Start", width/2, height/2 + 100);
        ctx.restore();
    },

    drawGameOver: function(ctx, width, height, score, wave) {
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = "#222c";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.font = "bold 52px Segoe UI, Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 8;
        ctx.fillText("Game Over", width/2, height/2 - 60);

        ctx.font = "22px Segoe UI, Arial";
        ctx.fillStyle = "#d4e2ff";
        ctx.fillText("Waves Survived: " + wave, width/2, height/2 + 8);
        ctx.fillText("Final Score: " + score, width/2, height/2 + 44);

        ctx.font = "bold 25px Segoe UI, Arial";
        ctx.fillStyle = "#ffe26a";
        ctx.fillText("Press Enter or Tap to Restart", width/2, height/2 + 102);
        ctx.restore();
    },

    drawLevelBG: function(ctx, cameraX, levelLength, width, height) {
        // Sky gradient
        ctx.save();
        let skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, "#5a73b4");
        skyGrad.addColorStop(1, "#22284a");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Parallax mountains
        for (let i = 0; i < 2; ++i) {
            let offset = cameraX * (0.1 + i*0.09);
            ctx.save();
            ctx.translate(-offset, 0);
            ctx.globalAlpha = 0.22 + 0.2*i;
            ctx.fillStyle = i === 0 ? "#7a88c6" : "#a3aee0";
            for (let x = 0; x < levelLength; x += 240) {
                ctx.beginPath();
                ctx.moveTo(x, 380 - i*40);
                ctx.lineTo(x + 80, 320 - i*44);
                ctx.lineTo(x + 160, 375 - i*32);
                ctx.lineTo(x + 240, 380 - i*40);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }

        // Platform/Floor
        let floorGrad = ctx.createLinearGradient(0, window.CONSTANTS.FLOOR_Y, 0, window.CONSTANTS.FLOOR_Y + 60);
        floorGrad.addColorStop(0, "#7d6a58");
        floorGrad.addColorStop(1, "#564330");
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, window.CONSTANTS.FLOOR_Y, width, 80);

        // Grass
        ctx.save();
        ctx.translate(0, window.CONSTANTS.FLOOR_Y-8);
        ctx.strokeStyle = "#8be870";
        ctx.lineWidth = 2.5;
        for (let x = 0; x < width; x += 8) {
            ctx.beginPath();
            ctx.moveTo(x, 6);
            ctx.lineTo(x+4, Math.random()*7);
            ctx.stroke();
        }
        ctx.restore();

        ctx.restore();
    }
};