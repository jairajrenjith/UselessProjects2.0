document.getElementById("link1").href = "./VoidSpeak/";
document.getElementById("link2").href = "./AirTaste/";

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const stars = Array.from({ length: 150 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: Math.random() * 2,
  s: Math.random() * 0.5 + 0.2
}));

const shapes = Array.from({ length: 8 }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  size: Math.random() * 80 + 40,
  color: `hsla(${Math.random() * 360}, 100%, 60%, 0.2)`,
  dx: Math.random() * 0.5 - 0.25,
  dy: Math.random() * 0.5 - 0.25
}));

function animate() {
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#0ff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.s;
    if (star.y > h) star.y = 0;
  });

  shapes.forEach(shape => {
    ctx.beginPath();
    ctx.fillStyle = shape.color;
    ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
    ctx.fill();
    shape.x += shape.dx;
    shape.y += shape.dy;
    if (shape.x < 0 || shape.x > w) shape.dx *= -1;
    if (shape.y < 0 || shape.y > h) shape.dy *= -1;
  });

  requestAnimationFrame(animate);
}

animate();
