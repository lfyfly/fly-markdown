<template lang="pug">
div#hello
  :markdown-it(linkify langPrefix='')
    # asdasd
    > ## asdasd
    ```js
      var codeBlocks=1;
      var codeBlocks=function () {};
    ```
  h2 heheda
  :markdown-it
    # asdasd
    > ## asdasd
    ```js
      var codeBlocks;
    ```
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: 'this is hello.vue'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
h1 {
  color: red;
}
</style>
