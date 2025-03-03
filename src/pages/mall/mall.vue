<template>
  <div class="top">
    <div class="header"></div>

    <div class="post-container">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <!-- 文章内容 -->
        <div class="post-card">
          <h2 class="post-title">{{ currentPost.title }}</h2>
          <p class="post-content">{{ currentPost.content }}</p>
        </div>

        <!-- 翻页按钮 -->
        <div class="pagination">

          <button
              @click="prevPage"
              :disabled="currentIndex === 0"
              class="pagination-button"
          >
            上一页
          </button>
          <span class="page-indicator">
            {{ currentIndex + 1 }} / {{ posts.length }}
          </span>
          <button
              @click="nextPage"
              :disabled="currentIndex === posts.length - 1"
              class="pagination-button"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      posts: [], // 文章列表
      currentIndex: 0, // 当前文章索引
      loading: true,
      error: null,
    };
  },
  computed: {
    // 当前显示的文章
    currentPost() {
      return this.posts[this.currentIndex] || {};
    },
  },
  async created() {
    try {
      // 调用后端 API 获取文章列表
      const response = await axios.get('http://127.0.0.1:8000/show_articles/');
      this.posts = response.data;
    } catch (err) {
      this.error = '无法加载科普文章，请稍后再试。';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    // 上一页
    prevPage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    // 下一页
    nextPage() {
      if (this.currentIndex < this.posts.length - 1) {
        this.currentIndex++;
      }
    },
  },
};
</script>

<style scoped>
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.page-title {
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: bold;
}

.post-container {
  width: 90%;
  max-width: 800px;
  text-align: left;
}

.loading, .error {
  text-align: center;
  font-size: 18px;
  color: red;
}

.post-card {
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.post-content {
  font-size: 16px;
  color: #555;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background: #39c5bb;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
}

.pagination-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 16px;
  color: #555;
}
</style>