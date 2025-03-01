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
    <div class="layout">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <ul class="sidebar-menu">
          <li class="menu-item" @click="showOverview">概况</li>
          <li class="menu-item" @click="ManageAnnouncementModal()">公告管理</li>
          <li class="menu-item" @click="ManagePostModal()">帖子管理</li>
          <li class="menu-item" @click="ManageArticleModal()">文章管理</li>
        </ul>
      </aside>
      <div class="main-content">
        <!-- 使用 Adminpost 组件 -->
        <Adminpost v-if="postManagementVisible" @close="postManagementVisible = false" />
        <Adminannouncement v-if="announcementManagementVisible" @close="announcementManagementVisible=false" />
        <Adminarticle  v-if="articleManagementVisible" @close="articleManagementVisible=false" />
        <div v-if="overviewVisible" class="overview-container">
          <h2>平台概况</h2>
          <ul class="overview-list">
            <li><strong>总访问量：</strong> {{ overviewData.totalVisits }}</li>
            <li><strong>帖子数量：</strong> {{ overviewData.postCount }}</li>
            <li><strong>帖子阅读量：</strong> {{ overviewData.postViews }}</li>
            <li><strong>公告数量：</strong> {{ overviewData.announcementCount }}</li>
            <li><strong>公告阅读量：</strong> {{ overviewData.announcementViews }}</li>
            <li><strong>文章数量：</strong> {{ overviewData.articleCount }}</li>
            <li><strong>文章阅读量：</strong> {{ overviewData.articleViews }}</li>
            <li><strong>注册用户数量：</strong> {{ overviewData.registeredUsers }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 使用帖子发布弹窗组件 -->
    <announcemodel :visible="postModalVisible" @update:visible="postModalVisible = $event" />
    <sellingPostmodel :visible="sellingModalVisible" @update:visible="sellingModalVisible = $event"/>
  </div>
</template>

<script>
import Adminpost from '../../components/adminpost/adminpost.vue';
import Announcemodel from '../../components/announcemodel/announcemodel.vue';
import SellingPostmodel from '../../components/sellingpostmodel/sellingpostmodel.vue';
import Adminannouncement from '../../components/adminannouncement/adminannouncement.vue';
import Adminarticle from '../../components/adminarticle/adminarticle.vue';


export default {
  components: {
    Adminpost,
    Announcemodel,
    SellingPostmodel,
    Adminannouncement,
    Adminarticle
  },
  data() {
    return {
      postModalVisible: false,
      sellingModalVisible: false,
      postManagementVisible: false, // 控制 Adminpost 显示/隐藏
      announcementManagementVisible:false,
      articleManagementVisible:false,
      overviewVisible: false, // 控制概况信息显示/隐藏
      overviewData: { // 概况的假数据，可以替换成从后端获取的真实数据
        totalVisits: 12345,
        postCount: 50,
        postViews: 2000,
        announcementCount: 30,
        announcementViews: 1500,
        articleCount: 40,
        articleViews: 1800,
        registeredUsers: 200
      }
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
    },
    ManagePostModal() {
      this.postManagementVisible = true; // 显示 Adminpost 组件
      this.announcementManagementVisible = false;
      this.articleManagementVisible=false;
      this.overviewVisible=false; // 控制概况信息显示/隐藏

    },
    ManageAnnouncementModal() {
      this.announcementManagementVisible = true;
      this.articleManagementVisible=false;
      this.postManagementVisible = false;
      this.overviewVisible=false; // 控制概况信息显示/隐藏

    },
    ManageArticleModal() {
      this.articleManagementVisible = true;
      this.announcementManagementVisible = false;
      this.postManagementVisible = false;
      this.overviewVisible=false; // 控制概况信息显示/隐藏
    },
    showOverview() {
      this.overviewVisible = true; // 显示概况信息
      this.postManagementVisible = false;
      this.announcementManagementVisible = false;
      this.articleManagementVisible = false;
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
  margin-top: 30px;

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
.layout {
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 20px;
}

.sidebar {
  width: 200px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 10px 15px;
  margin: 5px 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.menu-item:hover {
  background-color: #007bff;
  color: white;
  transform: translateX(5px);
}
</style>