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
            this.friction = 0.9;
            this.springFactor = 0.001;
        }

        setPos(x, y) {
            this.x = x;
            this.y = y;
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
        mouse = new Ball(0, 0, 30, 'green');

    // for (let i = 0; i < 10; i++) {
    //     balls.push(
    //         new Ball(
    //             // Math.random() * pos.canvas.width,
    //             // Math.random() * pos.canvas.height
    //             200 + 50 * Math.cos(i * 2  * Math.PI / 10),
    // 		    200 + 100 * Math.sin(i * 2 * Math.PI / 10)
    //         )
    //     );
    // }

    function ConnectDots(balls) {
        ctx.beginPath();
        ctx.moveTo(balls[0].x, balls[0].y);
        balls.forEach(ball => {
            ctx.lineTo(ball.x, ball.y);
        });

        ctx.closePath();
        ctx.fill();
    }

    function ConnectDots1(dots) {
        ctx.beginPath();

        for (var i = 0, jlen = dots.length; i <= jlen; ++i) {
            var p0 = dots[i + 0 >= jlen ? i + 0 - jlen : i + 0];
            var p1 = dots[i + 1 >= jlen ? i + 1 - jlen : i + 1];
            ctx.quadraticCurveTo(p0.x, p0.y, (p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
        }

        ctx.closePath();
        ctx.fill();
    }

    function Render() {
        window.requestAnimationFrame(Render);
        // ctx.clearRect(0, 0, pos.canvas.width, pos.canvas.height);
        // // ctx.fillStyle = 'rgba(255,255,255, 0.4)';
        // // ctx.fillRect(0,0,pos.canvas.width, pos.canvas.height);


        balls.forEach(ball => {
            // ball.think(pos);
            ball.draw(ctx);
        });

        // mouse.setPos(pos.x, pos.y);
        // // mouse.draw(ctx);
        // ConnectDots1(balls);
        // draw();
    }


    createBalls();

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
            new Ball(315, 225, 348, 250)
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

        ctx.fillRect(0, 0, pos.canvas.width, pos.canvas.height);
        ctx.fillStyle = '#010101';

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
        // ctx.stroke();
        ctx.fill();
        var center = new Ball(278, 290, 0, 0, 0);
        var startX = balls[0].x + 0.23 * (balls[0].x - center.x);
        var startY = balls[0].y + 0.23 * (balls[0].y - center.y);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let i = 0; i < balls.length; i++) {
            var offsetX = balls[i].offsetX + 0.23 * (balls[i].offsetX - center.x);
            var offsetY = balls[i].offsetY + 0.23 * (balls[i].offsetY - center.y);
            if (i == balls.length - 1) {
                ctx.quadraticCurveTo(offsetX, offsetY, startX, startY);
            } else {
                var x = balls[i + 1].x + 0.23 * (balls[i + 1].x - center.x);
                var y = balls[i + 1].y + 0.23 * (balls[i + 1].y - center.y);
                ctx.quadraticCurveTo(offsetX, offsetY, x, y);
            }
        }
        ctx.strokeStyle = '#474747';
        ctx.lineWidth = 6;
        ctx.stroke();

        startX = balls[0].x + 0.7 * (balls[0].x - center.x);
        startY = balls[0].y + 0.7 * (balls[0].y - center.y);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let i = 0; i < balls.length; i++) {
            var offsetX = balls[i].offsetX + 0.7 * (balls[i].offsetX - center.x);
            var offsetY = balls[i].offsetY + 0.7 * (balls[i].offsetY - center.y);
            if (i == balls.length - 1) {
                ctx.quadraticCurveTo(offsetX, offsetY, startX, startY);
            } else {
                var x = balls[i + 1].x + 0.7 * (balls[i + 1].x - center.x);
                var y = balls[i + 1].y + 0.7 * (balls[i + 1].y - center.y);
                ctx.quadraticCurveTo(offsetX, offsetY, x, y);
            }
        }
        ctx.lineWidth = 4;
        ctx.stroke();

        startX = balls[0].x + 2 * (balls[0].x - center.x);
        startY = balls[0].y + 2 * (balls[0].y - center.y);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for (let i = 0; i < balls.length; i++) {
            var offsetX = balls[i].offsetX + 2 * (balls[i].offsetX - center.x);
            var offsetY = balls[i].offsetY + 2 * (balls[i].offsetY - center.y);
            if (i == balls.length - 1) {
                ctx.quadraticCurveTo(offsetX, offsetY, startX, startY);
            } else {
                var x = balls[i + 1].x + 2 * (balls[i + 1].x - center.x);
                var y = balls[i + 1].y + 2 * (balls[i + 1].y - center.y);
                ctx.quadraticCurveTo(offsetX, offsetY, x, y);
            }
        }
        ctx.lineWidth = 2;
        ctx.stroke();
        
        
        // let center = new Ball(278, 290, 0, 0, 0);
        // center.draw(ctx);

        // ctx.beginPath();
        // ctx.moveTo((2 * balls[0].x - center.x), (2 * balls[0].y - center.y));
        // for (let i = 0; i < balls.length; i++) {
        //     if (i == balls.length - 1) {
        //         ctx.lineTo((2 * balls[0].x - center.x), (2 * balls[0].y - center.y));
        //     } else {
        //       ctx.lineTo((2 * balls[i].x - center.x), (2 * balls[i].y - center.y));
        //     }
        // }
        // ctx.strokeStyle = 'white';
        // ctx.lineWidth = 5;
        // ctx.stroke();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(240, 240, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(285, 217, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(315, 225, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(347, 290, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(327, 334, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(275, 362, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(235, 352, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.beginPath();
        // ctx.fillStyle = 'white';
        // ctx.arc(213, 310, 1, 0, 2*Math.PI);            
        // ctx.fill();
        // ctx.quadraticCurveTo(25,100,50,100);
        // ctx.quadraticCurveTo(50,120,30,125);
        // ctx.quadraticCurveTo(60,120,65,100);
        // ctx.quadraticCurveTo(125,100,125,62.5);
        // ctx.quadraticCurveTo(125,25,75,25);
        // ctx.strokeStyle = 'white';
        // ctx.stroke();
        // ctx.beginPath();
        // let x = 300;
        // let y = 300;
        // let color = '#474747';
        // let rotate = -(1 / 6) * Math.PI;
        // let radiusX = 120;
        // let radiusY = radiusX * (3 / 3.5);
        // ctx.ellipse(x, y, radiusX, radiusY, rotate, 0, 2 * Math.PI);
        // ctx.fillStyle = color;
        // ctx.fill();
        // ctx.closePath();

        // ctx.beginPath();
        // radiusX += 11;
        // radiusY += 11;
        // ctx.ellipse(x, y, radiusX, radiusY, rotate, 0, 2 * Math.PI);
        // ctx.lineWidth = 7;
        // ctx.strokeStyle = color;
        // ctx.stroke();
        // ctx.closePath();

        // ctx.beginPath();
        // radiusX += 20;
        // radiusY += 20;
        // ctx.ellipse(x, y, radiusX, radiusY, rotate, 0, 2 * Math.PI);
        // ctx.lineWidth = 5;
        // ctx.stroke();
        // ctx.closePath();

        // ctx.beginPath();
        // radiusX += 50;
        // radiusY += 50;
        // ctx.ellipse(x, y, radiusX, radiusY, rotate, 0, 2 * Math.PI);
        // ctx.lineWidth = 5;
        // ctx.stroke();
        // ctx.closePath();

    }
    Render();

};