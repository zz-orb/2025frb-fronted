<template>
    <transition name="modal-fade">
        <div class="post-modal" v-if="visible">
            <div class="modal-content">
                <h2>发布公告</h2>
                <!-- 输入文字的文本框 -->
                <textarea v-model="posttitle" placeholder="请输入公告标题"></textarea>
                <!-- 输入文字的文本框 -->
                <textarea v-model="postContent" placeholder="请输入公告内容"></textarea>
                <!-- 上传图片部分，这里只是示例，实际可能需要使用文件上传组件等 -->
                <div class="modal-buttons">
                    <!-- 确认按钮，点击时调用confirmPost方法并隐藏弹窗 -->
                    <button @click="confirmPost">确认</button>
                    <!-- 取消按钮，点击时隐藏弹窗 -->
                    <button @click="cancelPost">取消</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            postContent: '',
            posttitle:'',
            postType:0,
            uploadedFile: null
        };
    },
    methods: {
        handleFileUpload(event) {
            // 这里可以处理文件上传逻辑，比如获取文件对象等
            this.uploadedFile = event.target.files[0];
        },
        confirmPost() {
            const content = this.postContent;
            const titles = this.posttitle;
            
            axios.post('http://127.0.0.1:8000/create_announcement/', {
                content:content,
                titles:titles,

            })
          .then((res) => {
                if (res.status == 201) {
                    this.$emit('update:visible', false);
                    // 这里可以添加一些提示信息，比如弹出成功发布帖子的提示框等
                    this.$message.success(res.data.message,10);
                    console.log(res.data.message);
                    this.cancelPost();
                } else {
                    // 处理发布失败的情况，比如弹出错误提示框等
                    console.log(res.data.message);
                    this.cancelPost();
                }
            })
          .catch((error) => {
                // 处理请求过程中出现的错误，比如网络错误等
                console.log(error);
                this.cancelPost();
            });
        },
        cancelPost() {
            // 隐藏弹窗
            this.$emit('update:visible', false);
        }
    }
};
</script>

<style scoped>
.post-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 60%;
    max-width: 600px;
}

.modal-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.modal-buttons button {
    margin-left: 10px;
}

textarea {
    width: 100%;
    height: 200px;
    margin-bottom: 20px;
}

input[type="file"] {
    margin-bottom: 20px;
}

/* 定义过渡效果的样式 */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.5s;
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}
</style>