<script lang='ts' setup>
import { ref } from 'vue';

const props = defineProps(['title']);
const filter = ref({} as any);

const handleRefresh = () => {
  console.log('refresh');
}

const handleClick = () => {
  console.log('click');
}

const handleGoProfile = () => {
  console.log('profile');
}

</script>

<template>
    <el-row class="container" align="middle">
      <el-col :lg="14" :md="14" :sm="12" :xs="24">
        <h2 class="title">{{ props.title }}</h2>
      </el-col>
      <el-col :lg="6" :md="5" :sm="5" :xs="24">
        <el-date-picker v-model="filter" format="DD/MM/YYYY" type="day" placeholder="Data" style="width: 100%;"/>
      </el-col>
      <el-col :lg="4" :md="5" :sm="7" :xs="24">
        <el-row class="icon_container"> 
          <div class="circle" @click="handleRefresh()">
            <img :src="'src/assets/icons/update-button.svg'" />
          </div>
          <div class="circle" @click="handleClick()">
            <img :src="'src/assets/icons/plus-button.svg'" />
          </div>
          <div class="circle" @click="handleGoProfile()">
            <img :src="'src/assets/icons/profile.png'" />
          </div>
        </el-row>
      </el-col>
    </el-row>
</template>

<style scoped lang='scss'>
.container {
  width: 100%;
  padding: 0px 20px;

  border-radius: 5px;
}

.title {
  color: rgba(48, 48, 48, 1);
  font-weight: 400;
  font-size: 32px;
}

.circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 31px;
  height: 31px;
  background: rgba(255, 255, 255, 1);
  border-radius: 50%;
  margin-left: 25px;
  cursor: pointer;
}

@media screen and (max-width: 767px) {

  .container{
    text-align: center;
  }
  .icon_container {
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
  }
}
</style>
