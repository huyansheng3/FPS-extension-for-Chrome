class FPS {
  constructor() {
    this.width = 150;
    this.height = 65;

    this.container = document.createElement('div');
    this.container.classList.add('fps_container');

    this.result = document.createElement('div');
    this.result.classList.add('fps_container_result');
    
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.classList.add('fps_draw');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.container.appendChild(this.canvas)
    this.container.appendChild(this.result) 
    document.body.appendChild(this.container);

    this.ctx.font = 'bold 16px Arial';
    var that = this;
    
    this.canvas.addEventListener('click', function () {
      that.staypause();
    });

    this.hidden = true;
    this.startTime = 0;
    this.frame = 0;

    this.allFPS = [];
    this.playing = false;

    this.perf = performance || Date;

    this.durationBegin = 0;
  }
  
  staypause() {
    this.playing = this.playing ? false : true;
    if (this.playing) {
        this.result.classList.remove('is_visible');
        this.loop();
        this.durationBegin = this.perf.now();
    } else {
        const duration = ((this.perf.now() - this.durationBegin)/1000).toFixed(2);
        const avgFPS= this.getAverageFPS();
        const lowFPS = this.getOnePercentLowFPS()
        this.result.innerHTML = `<div>持续时间：${duration}s </div><div>平均帧：${avgFPS} </div> <div>1% low帧：${lowFPS} </div>`
        this.result.classList.add('is_visible');
    }
  }
  
  toggle() {
    this.hidden = this.hidden ? false : true;
    if (!this.hidden) {
      this.container.classList.add('is_visible');
      this.loop();
    } else {
      this.container.classList.remove('is_visible');
    }
  }

  
  getAverageFPS() {
    if (this.allFPS.length === 0) return 0;
    var totalFPS = 0;
    for (var i = 0; i < this.allFPS.length; i++) {
      totalFPS += this.allFPS[i];
    }
    return  parseInt(totalFPS / this.allFPS.length);
  }

  
  getOnePercentLowFPS() {
    if (this.allFPS.length === 0) return 0;
    this.allFPS.sort((a, b) => a - b);
    var index = Math.floor(this.allFPS.length * 0.01);
    return parseInt(this.allFPS[index]);
  }

  loop() {
    if (this.hidden || !this.playing) return false;
    var that = this;
    window.requestAnimationFrame(function () {
      that.draw();
      that.loop();
    });
  }

  add(x) {
    this.allFPS.unshift(x);
    
    this.allFPS = this.allFPS.slice(0, this.width);
  }

  draw() {
    var currentFPS = this.getFPS();
    this.add(currentFPS);
    
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#000000';
    
    for (var i = 0; i <= this.width; i++) {
      this.ctx.fillRect(i, 0, 1, 5 + 60 - this.allFPS[i]);
    }
    this.ctx.fillText(currentFPS + ' fps', 22, 52); 
    this.ctx.fillStyle = '#ffffff';
    for (var i = 0; i <= this.width; i++) {
      
      this.ctx.fillRect(i, 5 + 60 - this.allFPS[i], 1, 2);
    }
    
    this.ctx.fillText(currentFPS + ' fps', 20, 50);
  }
  getFPS() {
    this.frame++;
    var d = this.perf.now();
    this.currentTime = (d - this.startTime) / 1000;
    var result = Math.floor(this.frame / this.currentTime);
    if (this.currentTime > 1) {
      this.startTime = this.perf.now();
      this.frame = 0;
    }
    return result;
  }
}

var fps = new FPS();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'clicked_browser_action') {
    fps.toggle();
    fps.staypause();
  }
});
