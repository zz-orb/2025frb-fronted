<template>
    <div>
        
        <h1>公告栏</h1>

        <div v-for="announcement in announcements" :key="announcement.id" class="announcement-card">
           
            <h2>{{ announcement.title }}</h2>
              
            <div class="announcement-content">
                <p>
                    {{ announcement.content }}
                </p>
            </div>
            <!-- 已读按钮 -->
            <div class="read-btn">
                <a-button type="primary"
                          @click="markAsRead(announcement)"
                        :disabled="announcement.read">{{ announcement.read? '已读' : '标记已读' }}
                </a-button>
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
            announcements: [],
            loading: false,
            error: null
        };
    },
    created() {
        // 可以调用 fetchAnnouncements() 方法从后端获取数据
        this.fetchAnnouncements();
    },
    methods: {
        markAsRead(announcement) {
            announcement.read = true;
            axios.post('http://127.0.0.1:8000/remove_announcement/',{id:announcement.id})
            .then(this.AfterRead);
        },
        AfterRead(res) {
        console.log("Start the condition");
     if (res.status==201) {
        console.log("success");
        this.$message.success(res.data.message, 30);
    
      } else {
        console.log("flase");
        this.error = res.data.error;
}
   },
        async fetchAnnouncements() {
         try {
        this.loading = false;
        axios.get('http://127.0.0.1:8000/show_announcements/')
       .then((response) => {
        this.announcements = response.data;
        this.loading = false;
        console.log(this.announcements);
        this.announcements.forEach((announcement) => {
       const announcementId = announcement.id;
       const announcementTitle = announcement.title;
       const announcementContent = announcement.content;
       console.log(`Post ID: ${announcementId}, Title: ${announcementTitle}, Content: ${announcementContent}`);
           
            this.loading = false;
            console.log(this.products);
        }) 
    })  
    } catch (err) {
                this.error = '加载公告时出错';
                this.loading = false;
                console.error(err);
            }
        }
    }
};
</script>

<style scoped>
/* 在公告组件的样式中添加 */

.announcement-card {
    background-color: #f9f9f9; /* 浅灰色背景，与帖子区分开 */
    border-radius: 8px; /* 圆角边框 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 较淡的阴影 */
    padding: 16px; /* 内边距 */
    margin-bottom: 16px; /* 外边距，用于公告之间的间距 */
    transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.announcement-card:hover {
    transform: translateY(-2px); /* 鼠标悬停时稍微上移 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 鼠标悬停时增加阴影 */
}

.announcement-content {
    margin: 0;
}

.read-btn {
    text-align: right;
    margin-top: 8px;
}
</style>