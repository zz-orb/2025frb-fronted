<template>
  <div class="common-layout">
    <div class="content"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: 'CommonLayout',
  computed: {
  }
}
</script>

<style scoped lang="less">
.common-layout{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: @layout-body-background;
  background-image: url('./img/background.png');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: 100%;
  .content{
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px){

      padding: 112px 0 24px;
    }
  }
}
</style>
