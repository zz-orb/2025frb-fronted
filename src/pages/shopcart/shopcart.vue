<template>  
    <div class="top">  
    <div class="header">
    </div> 
      <h1 class="page-title">讨论区</h1>  
      <div>
      <!-- 发帖子按钮 -->
          <button @click="openPostModal">发帖子</button>
      </div>
      <div class="post-list-container">  
        <post/> <!-- 使用post.vue组件 -->  
      </div> 
      <postmodel :visible="postModalVisible" @update:visible="postModalVisible = $event"></postmodel>
    </div>  
  </template>  
    
  <script>  
import Postmodel from '../../components/postmodel/postmodel.vue';
import Post from '../../components/post/post.vue'; // 假设post.vue在同一目录下
  export default {  
    components: {  
      Postmodel ,
      Post,
    } ,
    data() {
      return {
          // 用于控制发帖子弹窗的显示与隐藏，初始为 false，即隐藏状态
          postModalVisible: false
      };
  },
  methods:{
    openPostModal() {
          this.postModalVisible = true;
      }
  }
  };  
 
  </script>  
    
  <style scoped>  


  .page-container {  
    display: flex;  
    flex-direction: column;  
    align-items: center;  
    justify-content: center;  
    height: 100vh; /* 使容器高度等于视口高度 */  
    text-align: center;  
    padding: 20px; /* 可选，为页面内容提供一些内边距 */  
  }  
    
  .page-title {  
    margin-bottom: 10px; /* 可选，为标题和帖子列表之间提供一些间距 */  
  }  
    
  .post-list-container {  
    width: 80%; /* 可选，限制帖子列表容器的宽度 */  
    max-width: 800px; /* 可选，设置最大宽度以防止在小屏幕上溢出 */  
  }  
    
  /* 这里的样式将应用于post.vue组件内部的元素，但您需要在post.vue中定义它们 */  
  /* 例如，您可以在post.vue的<style>部分中添加.post-card的样式 */  
  </style>