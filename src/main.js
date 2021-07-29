let brush = document.getElementById("brush");
let eraser = document.getElementById("eraser");
let save = document.getElementById("save");
let clear = document.getElementById("clear");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let eraserEnabled = false;
let painting = false;
let lastPoint;

//设置画布的宽高为屏幕的宽高
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

//检测是否支持触屏
var isTouchDevice = "ontouchstart" in document.documentElement;
if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    //获取第一个触碰点
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    if (eraserEnabled) {
      ctx.clearRect(x - 15, y - 15, 30, 30);
    }
    lastPoint = [x, y];
  };
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    if (eraserEnabled) {
      ctx.clearRect(x - 15, y - 15, 30, 30);
    } else {
      drawLine(lastPoint[0], lastPoint[1], x, y);
    }
    lastPoint = [x, y]; //更新上一次的坐标点
  };
} else {
  canvas.onmousedown = (e) => {
    painting = true;
    let x = e.clientX;
    let y = e.clientY;
    if (eraserEnabled) {
      ctx.clearRect(x - 15, y - 15, 30, 30);
    }
    lastPoint = [x, y]; //初始化lastPoint
  };
  canvas.onmousemove = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    if (painting) {
      if (eraserEnabled) {
        ctx.clearRect(x - 15, y - 15, 30, 30);
      } else {
        drawLine(lastPoint[0], lastPoint[1], x, y);
      }
      lastPoint = [x, y]; //更新上一次的坐标点
    }
  };
  canvas.onmouseup = () => {
    painting = false;
  };
}

//画线函数
function drawLine(x1, y1, x2, y2) {
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//点击画笔
brush.onclick = function () {
  eraserEnabled = false;
  brush.classList.add("active");
  eraser.classList.remove("active");
};

//点击橡皮擦
eraser.onclick = function () {
  eraserEnabled = true;
  eraser.classList.add("active");
  brush.classList.remove("active");
};

//点击保存
save.onclick = function () {
  let imgUrl = canvas.toDataURL("image/png");
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.href = imgUrl;
  a.download = "mypic" + new Date().getTime();
  a.target = "_blank";
  a.click();
};

//点击清屏
clear.onclick = function () {
  ctx.fillStyle = "#cdedba";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

//选择画笔颜色
const events = {
  ".black": "black",
  ".red": "red",
  ".yellow": "yellow",
  ".green": "green",
  ".blue": "blue",
};
function selectColor() {
  for (let key in events) {
    if (events.hasOwnProperty(key)) {
      document.querySelector(key).onclick = function () {
        eraserEnabled = false;
        ctx.strokeStyle = events[key];
        brush.classList.add("active");
        eraser.classList.remove("active");
        let colorList = this.parentNode.children;
        for (let i = 0; i < colorList.length; i++) {
          colorList[i].classList.remove("selected");
        }
        this.classList.add("selected");
      };
    }
  }
}
selectColor();
