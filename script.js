const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const captureBtn = document.getElementById("captureBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const invertBtn = document.getElementById("invertBtn");
const countdownEl = document.getElementById("countdown");
const gallery = document.getElementById("gallery");

let slot = 0;
let isMirrored = false;
let selectedFrame = "vintage1";

document.querySelectorAll('input[name="frame"]').forEach(radio => {
  radio.addEventListener("change", e => selectedFrame = e.target.value);
});

function drawFrame(slot) {
  ctx.strokeStyle = "#7b5e57";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20 + slot * 290, 260, 260);

  if (selectedFrame === "vintage1") {
    ctx.fillStyle = "rgba(165, 140, 115, 0.2)";
  } else if (selectedFrame === "vintage2") {
    ctx.fillStyle = "rgba(60, 40, 30, 0.25)";
  } else if (selectedFrame === "vintage3") {
    ctx.fillStyle = "rgba(255, 253, 208, 0.25)";
  }
  ctx.fillRect(20, 20 + slot * 290, 260, 260);
}

function startCountdown(callback) {
  let count = 3;
  countdownEl.style.display = "block";
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(interval);
      countdownEl.style.display = "none";
      callback();
    }
  }, 1000);
}

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => alert("Izinkan kamera di browser ya!"));

captureBtn.addEventListener("click", () => {
  if (slot >= 3) return;
  startCountdown(() => {
    if (isMirrored) {
      ctx.save();
      ctx.translate(20 + 260, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 20 + slot * 290, 260, 260);
      ctx.restore();
    } else {
      ctx.drawImage(video, 20, 20 + slot * 290, 260, 260);
    }
    drawFrame(slot);
    slot++;
    if (slot === 3) downloadBtn.disabled = false;
  });
});

resetBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  slot = 0;
  downloadBtn.disabled = true;
});

downloadBtn.addEventListener("click", () => {
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "photobooth_strip.png";
  link.href = dataUrl;
  link.click();

  const img = document.createElement("img");
  img.src = dataUrl;
  gallery.appendChild(img);
});

invertBtn.addEventListener("click", () => {
  isMirrored = !isMirrored;
  video.style.transform = isMirrored ? "scaleX(-1)" : "scaleX(1)";
});