<template>
    <div>
        <div v-for="post in posts" :key="post.id" class="post-card">
            <h2>{{ post.title }}</h2>
            
            <div class="post-content">
                {{ post.content}}
            </div>
            <!-- 添加取消收藏按钮 -->
      
      <div class="collect-btn">
                <a-icon :type= "'close-circle'" @click="removecollectPost(post)"></a-icon>
                <span>取消收藏</span>
            </div>
        </div>
        <div v-if="loading">加载中...</div>
        <div v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import axios from 'axios'
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
        // 可以调用 fetchPosts() 方法从后端获取数据
        this.fetchPosts();
    },
    methods: {
        toggleExpand(post) {
            post.expanded =!post.expanded;
        },
        async fetchPosts() {
            try {
        this.loading =false;
        axios.get('http://127.0.0.1:8000/favorite/')
        .then((response) => {
         // 成功获取数据后的操作
        this.posts = response.data;
        this.loading = false;
        console.log(this.posts);
        this.posts.forEach((post) => {
       const postId = post.id;
       const postTitle = post.title;
       const postContent = post.content;
       const postType = post.type;
       console.log(`Post ID: ${postId}, Title: ${postTitle}, Content: ${postContent}, Type: ${postType}`);
       // 在这里你可以根据需求进一步处理每个post的内容，比如渲染到页面上
     });
    })   
    } catch (err) {
        this.error = '加载帖子时出错';
        this.loading = false;
        console.error(err);
    }
        },
removecollectPost(post) {
    const id = post.id;   
    axios.post('http://127.0.0.1:8000/favorite_remove/', {
        id:id
    }).then(this.afterRemoveFavorite);}

    ,afterRemoveFavorite(res) {
    console.log("Start the condition");
     if (res.status==201) {
        console.log("success");
        this.$message.success(res.data.message, 10);
    
      } else {
        console.log("flase");
        this.error = res.data.error;
      }
    }

            
    },
};
</script>

<style scoped>
.post-card {
    background-color: #ffffff; /* 不透明白色背景 */
    borderRadius: 8px; /* 圆角边框 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
    padding: 16px; /* 内边距 */
    margin-bottom: 16px; /* 外边距，用于帖子之间的间距 */
    transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.post-card:hover {
    transform: translateY(-4px); /* 鼠标悬停时稍微上移 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.truncated-content {
    display: -webkit-box;
    -webkit-line-clamp: 10; /* 限制显示的行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.read-more {
    color: blue;
    cursor: pointer;
    marginLeft: 8px;
}

.collapse-btn {
    display: block;
    marginTop: 8px;
    textAlign: right;
}

.collect-btn {
    textAlign: right;
    marginTop: 8px;
}
</style>