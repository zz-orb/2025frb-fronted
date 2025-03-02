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
           
            <!-- 评论区 -->
            <div class="comments-section">
                <a-button @click="toggleComments(post)" type="link">
                    {{ post.showComments ? '收起评论' : `展开评论` }}
                </a-button>

                <div v-if="post.showComments" class="comment-list">
                    <div v-if="commentsLoading[post.post_id]" class="loading-comments">加载中...</div>
                    <div v-else>
                        <div v-for="comment in comments[post.post_id]" :key="comment.id" class="comment">
                            <div class="comment-author">{{ comment.username }}</div>
                            <div class="comment-content">{{ comment.content }}</div>
                            <!-- <div class="comment-time">{{ formatTime(comment.created_at) }}</div> -->
                        </div>
                    </div>
                </div>

                <div v-if="post.showComments" class="comment-input">
                    <a-input 
                        v-model="newComment[post.post_id]" 
                        placeholder="写下你的评论..."
                        @pressEnter="CommentTo(post)"
                    ></a-input>
                    <a-button 
                        type="primary" 
                        @click="CommentTo(post)"
                        :disabled="!newComment[post.post_id]"
                    >提交</a-button>
                </div>
            </div>

        </li>
    </ul>
    
    </div>
        <div v-if="error">{{ error }}</div>
</div>
</template>


<script>
import axios from 'axios';
import moment from 'moment';
export default {
    data() {
        return {
            posts: [],
            loading: false,
            error: null,
            collectedPosts: [],
            collectStatus: {},
            // 评论区相关数据
            comments: {},
            newComment: {},
            commentsLoading: {},
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
        // 格式化时间
        formatTime(time) {
            return moment(time).format('YYYY-MM-DD HH:mm');
        },

        // 切换评论显示
        async toggleComments(post) {
            post.showComments = !post.showComments;
            console.log(post.showComments);
            if (post.showComments) {
                await this.fetchComments(post.post_id);
            }
        },

        // 获取评论
        async fetchComments(postId) {
            this.$set(this.commentsLoading, postId, true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/show_comments/', {
                    params: { id: postId }
                }); 
                this.$set(this.comments, postId, response.data.data);
            } catch (error) {
                console.error('获取评论失败:', error);
                this.$message.error('获取评论失败');
            } finally {
                this.$set(this.commentsLoading, postId, false);
            }
        },

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
        this.posts.forEach(post => {
        this.$set(post, 'showComments', false); // 使用 $set 确保响应式
        });
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
    const content = this.newComment[post.post_id]?.trim();
    if (!content) return;
    axios.post('http://127.0.0.1:8000/create_comment/', {
        id:post.post_id,
        content: content
    }).then((res) => { // 使用箭头函数
        this.afterComment(res, post.post_id); // 明确传递 postId
    }).catch(error => {
        console.error('评论提交失败:', error);
        this.$message.error('评论提交失败');
  });
}

,afterComment(res, postId) { // 接收 postId 参数
  console.log("Comment response:", res);
  if (res.status === 201) {
    this.$message.success(res.data.message, 8);
    // 强制刷新评论列表
    this.fetchComments(postId).then(() => {
      // 可添加额外逻辑（如滚动到底部）
    });
    // 清空输入框
    this.$set(this.newComment, postId, '');
  } else {
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

.truncated-content {
    display: -webkit-box;
    -webkit-line-clamp: 10; /* 限制显示的行数 */
    line-clamp: 10; /* 限制显示的行数 */
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

/* 新增评论样式 */
.comments-section {
    margin-top: 16px;
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
}

.comment-list {
    margin: 12px 0;
}

.comment {
    padding: 8px;
    background: #f8f8f8;
    border-radius: 4px;
    margin-bottom: 8px;
}

.comment-author {
    font-weight: 500;
    color: #1890ff;
    margin-bottom: 4px;
}

.comment-content {
    color: #333;
    margin-bottom: 4px;
}

.comment-time {
    color: #999;
    font-size: 0.8em;
}

.comment-input {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

.loading-comments {
    color: #999;
    text-align: center;
    padding: 8px;
}

.collect-btn {
    text-align: right;
    margin-top: 8px;
}

</style>