Component({
  properties: {
    isshow: {
      type: Boolean,
      value: true
    }
  },
  height: {
    type: String,
    value: '80%'
  },
  data: {},
  methods: {
    clickMask() {
      // this.setData({show: false})
    },

    check_cancel() {
      this.setData({
        isshow: false
      })
      this.triggerEvent('cancel')
    },

    check_center() {
      this.setData({
        isshow: false
      })
      this.triggerEvent('confirm')
    }
  }
})