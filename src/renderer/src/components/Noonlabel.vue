<script lang="ts" setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Label'
  },
  value: {
    type: String,
    default: 'Value'
  }
});
</script>
<template>
  <div class="noonlabel">
    <label>{{props.label}}</label>
    <span>{{props.value}}</span>
  </div>
</template>
<style lang="scss" scoped>
.noonlabel{
  label{  
    background: linear-gradient(145deg, rgb(152, 148, 148) 0%, rgb(128, 128, 128) 100%);
    color: white;
    padding-inline: 8px;
    border-radius: 8px 0px 8px 0px;
  }
  span{
    // graident background white to black
    background: black;
    color: white;
    padding-inline: 8px;
    border-radius: 8px 0px 8px 0px;
    margin-left: -4px;
  }

}
</style>