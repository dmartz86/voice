(($) => {
  class Engine {
    constructor() {
      this.context;
      this.chunks = [];
      this.index = 0;
      this.elePause = document.getElementById('pause');
      this.eleRecord = document.getElementById('record');
      this.eleTarget = document.getElementById('target');
      this.eleNumbers = document.getElementById('numbers');
      this.init();
    }

    async init() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleSize: 16,
          channelCount: 2,
          echoCancellation: true
        },
        video: false
      });

      this.recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      this.recorder.ondataavailable = event => this.buildBlob(event.data);

      this.buildNumbers();
      this.setActive(this.index);
    }

    setActive(index) {
      const target = document.getElementsByClassName('block up')[index];
      if (target) {
        this.content = index;
        target.classList = ['block up active'];
        this.eleTarget.innerText = index;
      }
    }

    updateProgress() {
      const [active] = document.getElementsByClassName('block up active');
      if (active) {
        const [first, midd, last] = active.nextSibling.childNodes;
        if (first.classList.value === 'col intent') {
          first.classList.value = 'col intent active';
          active.classList.value = ['block up'];
        } else if (midd.classList.value === 'col intent') {
          midd.classList.value = 'col intent active';
          active.classList.value = ['block up'];
        } else if (last.classList.value === 'col intent') {
          last.classList.value = 'col intent active';
          active.classList.value = ['block up full'];
          active.nextSibling.classList.value = ['grid block down full'];
        }
      }
      this.next();
    }

    start() {
      this.recorder.start();
      this.elePause.hidden = false;
      this.eleRecord.hidden = true;
    }

    stop() {
      this.recorder.requestData();
      this.recorder.stop();
      this.elePause.hidden = true;
      this.eleRecord.hidden = false;
    }

    next() {
      this.index === 9 ? this.index = 0 : this.index++;
      this.setActive(this.index);
    }

    async buildBlob(blob) {
      if (!blob || !blob.size) return;

      const method = 'POST';
      const body = new FormData();
      body.append('audio', blob);
      body.append('index', this.index);
      const res = await fetch('/audios', { body, method });
      this.updateProgress();
      console.log(res);
    }

    buildNumbers() {
      const grid = this.addElement(this.eleNumbers, { class: 'grid' });

      for (let it = 0; it < 10; it++) {
        const col = this.addElement(grid, { class: 'col' });
        const properties = { class: 'block up' };
        this.addElement(col, properties, it);
        const intents = this.addElement(col, { class: 'grid block down' });
        [0, 1, 2].map(() => this.addElement(intents, { class: 'col intent' }));
      }
    }

    addElement(parent, properties = {}, text = '', type = 'div') {
      const element = document.createElement(type);
      element.innerText = text;
      Object.keys(properties).map(name => element.setAttribute(name, properties[name]));
      parent.append(element);
      return element;
    }

  }

  $.engine = new Engine();

})(window);
