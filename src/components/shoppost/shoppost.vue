<template>
    <div>
        <div v-for="product in products" :key="product.id" class="product-card">
    <h2>{{ product.title }}</h2>
    <div class="product-content">
        <p v-if="!product.expanded && product.content.length > 100"
           @click="toggleExpand(product)"
           class="truncated-content"
           style="cursor: pointer;">
            {{ product.content.slice(0, 100) }}... <span class="read-more">详情</span>
        </p>
        <p v-else>
            {{ product.content }}
        </p>
        <div v-if="product.expanded" class="full-content">
            {{ product.content }}
            <button @click="toggleExpand(product)" class="collapse-btn">收起</button>
        </div>
        <div class="modal-content">
        <h3>商品详情</h3>
        <p>{{ product.name}}</p>
        <p>{{ product.price }}</p>
        <p>{{ product.description}}</p>
        <!-- 根据需要添加更多详情信息 -->
      </div>

    </div>
    <!-- 添加加入购物车按钮 -->

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
            products: [],
            loading: false,
            error: null
        };
    },
    created() {
        this.fetchProducts();
    },
    methods: {
        toggleExpand(product) {
            product.expanded =!product.expanded;
        },
        async fetchProducts() {
        try {
        this.loading =false;
        axios.get('http://127.0.0.1:8000/selling_post/')
        .then((response) => {
         // 成功获取数据后的操作
        this.products = response.data;
        this.loading = false;
        console.log(this.products);
        this.products.forEach((product) => {
        const productId = product.id;
        const productTitle = product.title;
        const productContent = product.content;
        console.log(`Post ID: ${productId}, Title: ${productTitle}, Content: ${productContent}`);
       // 在这里你可以根据需求进一步处理每个post的内容，比如渲染到页面上
     });
    })   
    } 
    catch (err) {
        this.error = '加载商品信息时出错';
        this.loading = false;
        console.error(err);
    }
},
   
}
    
};
</script>

<style scoped>
.product-card {
    background-color: #ffffff; /* 不透明白色背景 */
    border-radius: 8px; /* 圆角边框 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
    padding: 16px; /* 内边距 */
    margin-bottom: 16px; /* 外边距，用于商品展示之间的间距 */
    transition: transform 0.2s, box-shadow 0.2s; /* 添加过渡效果 */
}

.product-card:hover {
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
    marginTop: 8px;
    textAlign: right;
}

.add-to-cart-btn {
    textAlign: right;
    marginTop: 8px;
}
</style>