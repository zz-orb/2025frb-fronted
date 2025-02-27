<template>
  <div class="container">
    <!-- 增强型顶部导航 -->
    <nav class="cyber-nav">
      <h1 class="logo">AutoFuture</h1>
      <button class="cyber-button" @click="goToAdminPage">
        <span class="icon">🛸</span>
        <span class="glow-text">控制中心</span>
      </button>
    </nav>

    <!-- 动态展示区 -->
    <div class="hero">
      <img 
        alt="智能网联汽车" 
        class="hologram-car" 
        src="@/assets/img/car.jpg"
      />
      <div class="scanline"></div>
    </div>

    <!-- 公告组件容器 -->
    <div class="announcement-wrapper">
      <announcement />
    </div>
  </div>
</template>

<script>
import Announcement from '../../components/announcement/Announcement.vue'; // 引入公告组件
import axios from 'axios'
export default {
    components: {
      Announcement // 注册公告组件
  },
  methods: {
      // 处理点击管理员入口按钮的跳转逻辑，这里只是示例，实际需要替换为正确的路由跳转方式
      goToAdminPage() {
          // 假设使用Vue Router进行路由跳转，这里的'/admin'需要替换为实际的管理员页面路由路径
          console.log("is check");
          axios.post('http://127.0.0.1:8000/check_admin/', {})
          .then((res) => {
          if (res.data.message == 1) {
            this.$router.push('/admin');
          } else {
            this.$message.warning(`对不起，您无权访问页面: '/admin'，请联系管理员`);
            this.$router.push('/login');
          }
           })
          .catch((error) => {
           this.error = error.response.data.message;
           })
       },
      // 处理点击发帖子按钮打开弹窗的逻辑
     
  }
};
</script>



<style scoped>
.container {
  background: linear-gradient(45deg, #0a0a2e, #1a1a4a);
  min-height: 100vh;
  
  font-family: 'Roboto', sans-serif;
}

/* 赛博风格导航栏 */
.cyber-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background: rgba(0, 0, 30, 0.9);
  border-bottom: 2px solid #00f7ff;
  box-shadow: 0 0 20px rgba(0, 247, 255, 0.3);
}

.logo {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  background: linear-gradient(90deg, #00f7ff, #7d41ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 15px rgba(0, 247, 255, 0.5);
}

/* 未来感按钮 */
.cyber-button {
  background: rgba(0, 20, 40, 0.8);
  border: 1px solid #00f7ff;
  padding: 12px 24px;
  color: #00f7ff;
  font-family: 'Orbitron', sans-serif;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cyber-button:hover {
  background: rgba(0, 247, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 247, 255, 0.4);
  transform: translateY(-2px);
}

.glow-text {
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.7);
}

.icon {
  margin-right: 10px;
  filter: drop-shadow(0 0 5px #00f7ff);
}

/* 全息投影效果汽车展示 */
.hero {
  position: relative;
  max-width: 1200px;
  margin: 3rem auto;
  perspective: 1000px;
}

.hologram-car {
  width: 80%;
  display: block;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 
    0 0 40px rgba(0, 247, 255, 0.3),
    0 0 60px rgba(125, 65, 255, 0.3);
  transform: rotateX(5deg) rotateY(-5deg);
  animation: float 6s ease-in-out infinite;
  position: relative;
  z-index: 1;
}

/* 扫描线效果 */
.scanline {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 247, 255, 0.05) 51%,
    transparent 51%
  );
  background-size: 100% 4px;
  pointer-events: none;
}

/* 公告容器 */
.announcement-wrapper {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(0, 10, 30, 0.8);
  border: 1px solid #2a3a6a;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

/* 浮动动画 */
@keyframes float {
  0%, 100% { transform: translateY(0) rotateX(5deg) rotateY(-5deg); }
  50% { transform: translateY(-20px) rotateX(7deg) rotateY(-7deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-nav {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .hologram-car {
    width: 95%;
  }
}
</style>