<template>
  <div>
    <div v-for="post in posts" :key="post.id" class="post-card">
      <h2>{{ post.title }}</h2>
      <div class="post-content">
        {{ post.content }}
      </div>
      <!-- 取消收藏按钮 -->
      <div class="collect-btn">
        <a-icon :type="'close-circle'" @click="removecollectPost(post)"></a-icon>
        <span>取消收藏</span>
      </div>
    </div>
    <div v-if="loading">加载中...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      posts: [],
      loading: false,
      error: null,
      collectedPosts: []
    };
  },
  created() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      try {
        this.loading = false;
        axios.get('http://127.0.0.1:8000/favorite/')
            .then((response) => {
              this.posts = response.data;
              this.loading = false;
              console.log(this.posts);
              this.posts.forEach((post) => {
                const postId = post.id;
                const postTitle = post.title;
                const postContent = post.content;
                const postType = post.type;
                console.log(`Post ID: ${postId}, Title: ${postTitle}, Content: ${postContent}, Type: ${postType}`);
              });
            });
      } catch (err) {
        this.error = '加载帖子时出错';
        this.loading = false;
        console.error(err);
      }
    },
    removecollectPost(post) {
      const id = post.id;
      axios.post('http://127.0.0.1:8000/favorite_remove/', {
        id: id
      }).then(this.afterRemoveFavorite);
    },
    afterRemoveFavorite(res) {
      console.log("Start the condition");
      if (res.status == 201) {
        console.log("success");
        this.$message.success(res.data.message, 10);
      } else {
        console.log("false");
        this.error = res.data.error;
      }
    }
  },
};
</script>

<style scoped>
.post-card {
  position: relative; /* 设置为相对定位，方便子元素绝对定位 */
  background-color: #ffffff; /* 不透明白色背景 */
  border-radius: 8px; /* 圆角边框 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
  padding: 16px; /* 内边距 */
  margin-bottom: 16px; /* 外边距，用于帖子之间的间距 */
  transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.post-card:hover {
  transform: translateY(-4px); /* 鼠标悬停时稍微上移 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.post-content {
  margin-bottom: 16px; /* 为取消收藏按钮留出空间 */
}

.collect-btn {
  position: absolute; /* 绝对定位 */
  right: 16px; /* 距离右侧16px */
  bottom: 16px; /* 距离底部16px */
  display: flex;
  align-items: center;
  gap: 8px; /* 图标和文字之间的间距 */
  cursor: pointer;
  color: #ff4d4f; /* 红色，表示删除操作 */
}

.collect-btn:hover {
  color: #ff7875; /* 鼠标悬停时颜色变浅 */
}
</style>