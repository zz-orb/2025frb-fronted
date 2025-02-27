<template>
    <div>
        <h1>帖子列表</h1>
        <div v-if="loading">加载中...</div>
        <div v-else>
        <ul>   
        <li v-for="post in posts" :key="post.post_id" class="post-card">
            <h2>{{ post.titles }}</h2>
            <div class="post-content">
                {{ post.description}}
            </div>
            <!-- 添加收藏按钮 -->
            <div class="collect-btn">
                <a-icon :type="collectStatus[post.post_id] === 'collected'? 'check' :'star-o'" @click="toggleCollect(post)"></a-icon>
                <span>{{ collectStatus[post.post_id] === 'collected'? '已收藏' : '收藏' }}</span>
            </div>
           
        </li>
    </ul>
    
    </div>
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
            collectedPosts: [],
            collectStatus: {},
            isModalVisible: false, // 控制弹窗显示与隐藏的状态
        };
    }, 
    created() {
        this.fetchPosts();
        this.posts.forEach(post => {
            this.collectStatus[post.post_id] = 'not_collected';
        });
    },
    methods: {
        toggleExpand(post) {
            post.expanded =!post.expanded;
        },
async fetchPosts() {
    try {
        this.loading =false;
        axios.get('http://127.0.0.1:8000/show_posts/')
        .then((response) => {
         // 成功获取数据后的操作
        this.posts = response.data;
        this.loading = false;
        console.log(this.posts);
        this.posts.forEach((post) => {
       const postId = post.post_id;
       const postTitle = post.titles;
       const postContent = post.description;
       console.log(`Post ID: ${postId}, Title: ${postTitle}, Content: ${postContent}`);
       // 在这里你可以根据需求进一步处理每个post的内容，比如渲染到页面上
     });
    })   
    } catch (err) {
        this.error = '加载帖子时出错';
        this.loading = false;
        console.error(err);
    }
},

 toggleCollect(post) {       
    console.log("post")
    axios.post('http://127.0.0.1:8000/favorite_post/', {
        id:post.post_id
    }).then(this.afterFavorite);
}

,CommentTo(post) {
    const id = post.id;   
    axios.post('http://127.0.0.1:8000/create_comment/', {
        id:id
    }).then(this.afterComment);
}

,afterComment(res)  {
    console.log("Start the condition");
     if (res.status==201) {
        console.log("success");
        this.$message.success(res.data.message, 8);
        console.log( this.collectStatus[res.data.id]);
    
      } else {
        console.log("flase");
        this.error = res.data.error;
      }
}

,afterFavorite(res) {
    console.log("Start the condition");
     if (res.status==201) {
        console.log("success");
        this.$message.success(res.data.message, 8);
        this.collectStatus[res.data.id] ='collected';
        console.log( this.collectStatus[res.data.id]);
    
      } else {
        console.log("flase");
        this.error = res.data.error;
      }
    },
closeModal() {
    this.isModalVisible= false;
} 
}
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
    margin-left: 8px;
}

.collapse-btn {
    display: block;
    margin-top: 8px;
    text-align: right;
}

.collect-btn {
    text-align: right;
    margin-top: 8px;
}



</style>