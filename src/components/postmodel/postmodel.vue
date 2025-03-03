<template>
    <transition name="modal-fade">
        <div class="post-modal" v-if="visible">
            <div class="modal-content">
                <h2>发布帖子</h2>
                <!-- 输入文字的文本框 -->
              <a-textarea
                  v-model="postTitles"
                  placeholder="请输入帖子标题"
              ></a-textarea>
              <a-textarea
                  v-model="postContent"
                  placeholder="请输入帖子内容"
              ></a-textarea>

                <div class="modal-buttons">

                  <a-button
                      type="primary"
                      @click="confirmPost"
                  >确认</a-button>
                  <a-button
                      type="primary"
                      @click="cancelPost"
                  >取消</a-button>
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
            showModal :false,
            postContent: '',
            postTitles:'',
           
        };
    },
    methods: {
        handleFileUpload(event) {
            // 这里可以处理文件上传逻辑，比如获取文件对象等
            this.uploadedFile = event.target.files[0];
        },
        confirmPost() {
            axios.post('http://127.0.0.1:8000/create_post/', {
                description:this.postContent,
                titles:this.postTitles,
            })
          .then((res) => {
                if (res.status == 201) {
                    this.$emit('update:visible', false);
                    // 这里可以添加一些提示信息，比如弹出成功发布帖子的提示框等
                    this.$message.success("success!",5);
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
        },
        handleFormSubmit() {
      // 在这里处理表单提交，比如发送到服务器
      console.log('提交的物品信息：', this.product);
      // 提交后关闭弹窗
      this.showModal = false;
      // 你可以在这里添加其他逻辑，比如清空表单等
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
.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #888;
  background-color: #888;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 500px;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>