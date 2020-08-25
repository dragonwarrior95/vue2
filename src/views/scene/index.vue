<template>
  <div class="home-container">
    <scene />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Scene from '@/components/scene'

export default {
  name: 'home',
  components: {
    Scene
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 0px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
