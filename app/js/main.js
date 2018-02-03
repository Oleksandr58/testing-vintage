"use strict";

window.onload = function () {
    class Mouse {
        constructor(canvas) {
            this.x = 0;
            this.y = 0;
            let rect = canvas.getBoundingClientRect();
            this.canvas = rect;

            canvas.onmousemove = (e) => {
                this.x = e.clientX - rect.left;
                this.y = e.clientY - rect.top;
            };
        }
    }

    class Ball {
        constructor(x, y, offsetX, offsetY, radius, color) {
            this.x = x || 0;
            this.y = y || 0;
            this.offsetX = offsetX || 0;
            this.offsetY = offsetY || 0;
            this.originalX = x || 0;
            this.originalY = y || 0;
            this.vx = 0;
            this.vy = 0;
            this.radius = radius || 0;
            this.color = color || "white";            
            this.friction = 0.1;
            this.springFactor = 0.1;
        }
        think(mouse) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            // interaction
            if (dist < 30) {
                let angle = Math.atan2(dy, dx);
                let tx = mouse.x + Math.cos(angle) * 30;
                let ty = mouse.y + Math.sin(angle) * 30;

                this.vx += tx - this.x;
                this.vy += ty - this.y;
            }

            // spring back
            let dx1 = -(this.x - this.originalX);
            let dy1 = -(this.y - this.originalY);

            this.vx += dx1 * this.springFactor;
            this.vy += dy1 * this.springFactor;

            // friction
            this.vx *= this.friction;
            this.vy *= this.friction;

            // actual move
            this.x += this.vx;
            this.y += this.vy;
            this.offsetX += this.vx;
            this.offsetY += this.vy;
        }

        draw(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }

    let canvas = document.querySelector('#draw'),
        ctx = canvas.getContext('2d'),
        pos = new Mouse(canvas),
        balls = [],
        mouse = new Ball(0, 0, 30, 'green'),
        center = new Ball(278, 290, 0, 0, 0),
        animationTime = 150;
    
    createBalls();
    movePicture();
    Render();

    function Render() {
        window.requestAnimationFrame(Render);
        ctx.clearRect(0, 0, pos.canvas.width, pos.canvas.height);

        balls.forEach(ball => {
            ball.draw(ctx);
            ball.think(pos);
        });

        DrawFigure();
    }   

    function movePicture() {   
        var count = 0;
        let moveRight = setInterval(function() {
            count++;
            var thinkX = 2 * Math.cos(count * Math.PI/10);
            var thinkY = 2 * Math.cos(-count * Math.PI/10 + Math.PI/2);
            var thinkSlowerX = 1 * Math.cos(count * Math.PI/10);
            var i = 8;
            do {
                var thinkInX = thinkX;
                var thinkInY = thinkY;
                if (i == 3 || i == 8) thinkInX = thinkSlowerX;
                balls[i].x += thinkInX;
                balls[i].y += thinkInY;
                balls[i].offsetX += thinkInX;
                balls[i].offsetY += thinkInY;
                i++;
                if ( i > 8) i = 0;
            } while (i < 4);
            if (count == 20) count = 0;
        }, animationTime); 
        let moveLeft = setInterval(function() {
            var thinkX = 2 * Math.cos(count * Math.PI/10 + Math.PI/2);
            var thinkY = 2 * Math.cos(count * Math.PI/10);
            var thinkSlower4X = 1.1 * Math.cos(count * Math.PI/10 + Math.PI/4);
            var thinkSlower7X = 1 * Math.cos(count * Math.PI/10 + Math.PI/4);
            for (var i = 4; i < 8; i++) {
                var thinkInX = thinkX;
                var thinkInY = thinkY;
                if (i == 4) thinkInX = thinkSlower7X;
                if (i == 7) thinkInX = thinkSlower4X;
                balls[i].x += thinkInX;
                balls[i].y += thinkInY;
                balls[i].offsetX += thinkInX;
                balls[i].offsetY += thinkInY;
            }
        }, animationTime); 
    }

    function DrawStrokeFigure(lineWidth, multiplier, offset) {
        var startX = balls[0].x + multiplier * (balls[0].x - center.x);
        var startY = balls[0].y + multiplier * (balls[0].y - center.y);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let i = 0; i < balls.length; i++) {
            var offsetX = balls[i].offsetX + multiplier * (balls[i].offsetX - center.x) + offset;
            var offsetY = balls[i].offsetY + multiplier * (balls[i].offsetY - center.y);
            if (i == balls.length - 1) {
                ctx.quadraticCurveTo(offsetX, offsetY, startX, startY);
            } else {
                var x = balls[i + 1].x + multiplier * (balls[i + 1].x - center.x) + offset;
                var y = balls[i + 1].y + multiplier * (balls[i + 1].y - center.y);
                ctx.quadraticCurveTo(offsetX, offsetY, x, y);
            }
        }
        ctx.strokeStyle = '#474747';
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    function DrawFigure() {

        ctx.beginPath();
        ctx.moveTo(balls[0].x, balls[0].y);
        for (let i = 0; i < balls.length; i++) {
            if (i == balls.length - 1) {
                ctx.quadraticCurveTo(balls[i].offsetX, balls[i].offsetY, balls[0].x, balls[0].y);
            } else {
                ctx.quadraticCurveTo(balls[i].offsetX, balls[i].offsetY, balls[i + 1].x, balls[i + 1].y);
            }
        }
        ctx.fillStyle = '#474747';
        ctx.fill();

        DrawStrokeFigure(6, 0.23, 0);
        DrawStrokeFigure(4, 0.7, 0);
        DrawStrokeFigure(2, 2, 0);
        
    }
    function createBalls() {
        // 0 ball
        balls.push(
            new Ball(217, 265, 220, 255)
        );
        // 1 ball
        balls.push(
            new Ball(240, 240, 265, 223)
        );
        // 2 ball
        balls.push(
            new Ball(285, 218, 305, 215)
        );
        // 3 ball
        balls.push(
            new Ball(315, 225, 347, 250)
        );
        // 4 ball
        balls.push(
            new Ball(347, 290, 347, 318)
        );
        // 5 ball
        balls.push(
            new Ball(327, 334, 300, 354)
        );
        // 6 ball
        balls.push(
            new Ball(275, 362, 250, 367)
        );
        // 7 ball
        balls.push(
            new Ball(235, 352, 214, 330)
        );
        // 8 ball
        balls.push(
            new Ball(212, 310, 207, 290)
        );
        balls[0].offsetX = ((3/23)*(balls[1].x - balls[0].x) + balls[0].x);
        balls[0].offsetY = ((10/25)*(balls[1].y - balls[0].y) + balls[0].y);
        balls[1].offsetX = ((25/45)*(balls[2].x - balls[1].x) + balls[1].x);
        balls[1].offsetY = ((17/22)*(balls[2].y - balls[1].y) + balls[1].y);
        balls[2].offsetX = ((20/30)*(balls[3].x - balls[2].x) + balls[2].x);
        balls[2].offsetY = ((-3/7)*(balls[3].y - balls[2].y) + balls[2].y);
        balls[3].offsetX = ((32/32)*(balls[4].x - balls[3].x) + balls[3].x);
        balls[3].offsetY = ((25/65)*(balls[4].y - balls[3].y) + balls[1].y);        
        balls[4].offsetX = ((0/20)*(balls[5].x - balls[4].x) + balls[4].x);
        balls[4].offsetY = ((28/44)*(balls[5].y - balls[4].y) + balls[4].y);
        balls[5].offsetX = ((27/52)*(balls[6].x - balls[5].x) + balls[5].x);
        balls[5].offsetY = ((20/28)*(balls[6].y - balls[5].y) + balls[5].y);
        balls[6].offsetX = ((25/40)*(balls[7].x - balls[6].x) + balls[6].x);
        balls[6].offsetY = ((-5/10)*(balls[7].y - balls[6].y) + balls[6].y);
        balls[7].offsetX = ((21/23)*(balls[8].x - balls[7].x) + balls[7].x);
        balls[7].offsetY = ((22/42)*(balls[8].y - balls[7].y) + balls[7].y);
        balls[8].offsetX = ((-5/5)*(balls[0].x - balls[8].x) + balls[8].x);
        balls[8].offsetY = ((20/45)*(balls[0].y - balls[8].y) + balls[8].y);
    }
};
