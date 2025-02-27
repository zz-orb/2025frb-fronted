<template>
  <div class="page-container">
    <header class="page-header">
      <h1 class="page-title">管理页面</h1>
      <div class="button-group">
        <button class="btn-primary" @click="openPostModal">发布公告</button>
        <button class="btn-secondary" @click="openSellingModal">发布科普文章</button>
        <button class="btn-exit" @click="goTomain">退出管理员页面</button>
      </div>
    </header>
    <main class="main-content">
      <div class="post-list-container">
        <adminpost /> <!-- 使用post.vue组件 -->
      </div>
    </main>
    <!-- 使用帖子发布弹窗组件 -->
    <announcemodel :visible="postModalVisible" @update:visible="postModalVisible = $event" />
    <sellingPostmodel :visible="sellingModalVisible" @update:visible="sellingModalVisible = $event"/>
  </div>
</template>

<script>
import Adminpost from '../../components/adminpost/adminpost.vue';
import Announcemodel from '../../components/announcemodel/announcemodel.vue';
import SellingPostmodel from '../../components/sellingpostmodel/sellingpostmodel.vue';

export default {
  components: {
    Adminpost,
    Announcemodel,
    SellingPostmodel
  },
  data() {
    return {
      postModalVisible: false,
      sellingModalVisible: false
    };
  },
  methods: {
    goTomain() {
      this.$router.push('/');
    },
    openPostModal() {
      this.postModalVisible = true;
    },
    openSellingModal() {
      this.sellingModalVisible = true;
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
}

.button-group {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #28a745;
  color: white;
}

.btn-secondary:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.btn-exit {
  background-color: #dc3545;
  color: white;
}

.btn-exit:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.main-content {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.post-list-container {
  width: 90%;
  max-width: 1000px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: white;
}
</style>