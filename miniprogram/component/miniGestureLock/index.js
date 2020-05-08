import GestureLock from '../../utils/gestureLock.js';

Component({
  properties: {
    containerWidth: {
      type: Number
    },
    cycleRadius: {
      type: Number
    },
    password: {
      type: Array
    },
    flag: {
      type: String
    }
  },
  data: {
    gestureLock: {}, // 锁对象
    circleArray: [], // 圆对象数组
    lineArray: [], // 已激活锁之间的线段
    activeLine: {}, // 最后一个激活的锁与当前位置之间的线段
    error: false,
    time: ''
  },
  methods: {
    onTouchStart(e) {
      this.data.gestureLock.onTouchStart(e);
      this.refesh();
      if(this.data.time!=''){
        clearTimeout(this.data.time)
      }
    },

    onTouchMove(e) {
      this.data.gestureLock.onTouchMove(e);
      this.refesh();
    },
    onTouchEnd(e) {
      const checkPoints = this.data.gestureLock.onTouchEnd(e);
      //console.log(checkPoints.join(''))
      if (this.data.flag == 'resetgesture') {
        console.log("resetgesture")
        this.triggerEvent('end', checkPoints);
        var time = setTimeout(() => {
          this.refesh();
        }, 60000);
        this.setData({
          time: time
        })
      } else {
        console.log("signgesture")
        this.triggerEvent('end', checkPoints);
        setTimeout(() => {
          this.refesh();
        }, 1000);
      }
    },
    refesh() {
      this.setData({
        error: false,
        circleArray: this.data.gestureLock.getCycleArray(),
        lineArray: this.data.gestureLock.getLineArray(),
        activeLine: this.data.gestureLock.getActiveLine()
      });
    }
  },
  ready() {
    this.setData({
      gestureLock: new GestureLock(this.data.containerWidth, this.data.cycleRadius)
    });
    this.refesh();
  }
})