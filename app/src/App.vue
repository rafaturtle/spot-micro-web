<template>
  <div id="app">
    <StreamCam/>
  </div>
</template>

<script>
import StreamCam from './components/StreamCam.vue'

export default {
  name: 'App',
  components: {
    StreamCam
  },
   sockets : {
    connect: function(){
      console.log('socket connected');
    },
    image_updated : function(val){
      this.$store.dispatch("UPDATE_IMAGE",val);
    }
  }
}
</script>

<style>
#app {
  }
</style>
