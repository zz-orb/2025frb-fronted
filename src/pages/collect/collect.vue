<template>  
    <div class="top">  
    <div class="header">
    </div> 
      <h1 class="page-title">这是您已经收藏的帖子</h1>  
      <div class="post-list-container">  
        <Normalpost /> <!-- 使用post.vue组件 -->  
      </div> 
    </div>  
  </template>  
    
  <script>  
  import Normalpost from '../../components/normalpost/normalpost.vue';
    
  export default {  
    components: {  
      Normalpost// 注册post.vue组件  
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