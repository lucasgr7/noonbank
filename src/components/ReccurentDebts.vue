<script lang="ts" setup>
</script>
<template>
  <el-card id="recurrent-debts">
    <el-row justify="center">
      <h1> <span class="color-dark">27</span>/<span class="color-light">30</span></h1>
    </el-row>
    <ul>
      <li>
        <div class="circle light"></div> CPFL
      </li>
      <li>
        <div class="circle light"></div> SABESP
      </li>
      <li>
        <div class="circle dark"></div> Agnelo
      </li>
    </ul>
  </el-card>
</template>
<style lang="scss" scoped>
#recurrent-debts{
  background: white;
  height: 100%;

  h1{    
    font-size: 55px;
    padding: 0;
    margin: 7px;
    color: #3f9614;
    font-weight: revert;
  }
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
    li{
      display: flex;
      align-items: center;
      margin: 10px 0;
      color: gray;
      .circle{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .light{
    background: #dab68e;
  }
  .color-light{
    color: #dab68e;
  }
  .dark{
    background: #2a670c;
  }
  .color-dark{
    color: #2a670c;
  }
}
</style>