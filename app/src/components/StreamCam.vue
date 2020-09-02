<template>
  <div class="stream">
        <h1>{{imageUrl}}</h1>
        <img :src="imageUrl"/>
  </div>
</template>

<script>
   
export default {
  name: 'StreamCam',
  data: ()=>{
    return{
      isConnected: false
    }
  },
  created: function(){
   this.$socket.emit('start-stream');
  },
  computed: {
    imageUrl (){
      return this.$store.state.imageUrl;
    }
  }
}
</script>

