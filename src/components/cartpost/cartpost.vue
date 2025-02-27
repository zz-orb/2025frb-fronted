<template>
    <div>
      <div v-for="product in products" :key="product.id" class="product-card">
        <h2>{{ product.title }}</h2>
        <div class="product-content">
          <p>
            {{ product.description }}
          </p>
          <p>
            {{ product.price }}
          </p>
          <p>
            {{ product.amount }}
          </p>
        </div>
        
        <!-- 添加购买按钮和删除按钮 -->
        <div class="action-btns">
          <a-icon :type="'plus-circle'" @click="purchaseProduct(product)"></a-icon>
          <span>购买</span>
          <a-icon :type="'delete'" @click="deleteProduct(product)"></a-icon>
          <span>删除</span>
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
        products: [],
        loading: false,
        error: null,
        total: 0 // 添加总价变量并初始化为0
      };
    },
    created() {
      // 可以调用 fetchCartProducts() 方法从后端获取购物车数据
      this.fetchCartProducts();
    },
    methods: {
      toggleExpand(product) {
        product.expanded =!product.expanded;
      },
      async fetchCartProducts() {
    try {
      this.loading = false;
        axios.get('http://127.0.0.1:8000/cart/')
       .then((response) => {
            this.products = response.data;
            this.loading = false;
            console.log(this.products);
        })   
    } catch (err) {
        this.error = '加载购物车商品信息时出错';
        this.loading = false;
        console.error(err);
    }
},
purchaseProduct(product) {
  // 切换商品的购买状态
  const id = product.id;
  axios.post('http://127.0.0.1:8000/checkout/', {
          id:id 
      })
        .then(this.afterPurchaseProduct);

},afterPurchaseProduct(res) {
  console.log("Start the condition");
     if (res.status==201) {
        console.log("success");
        this.$message.success(res.data.message, 10);
    
      } else {
        console.log("flase");
        this.error = res.data.error;
}
},
deleteProduct(product) {
  const id = product.id;
  axios.post('http://127.0.0.1:8000/remove_cart/', {
          id:id 
      })
        .then(this.afterDeleteProduct);
},
afterDeleteProduct(res) {
  console.log("Start the condition");
     if (res.status==201) {
        console.log("success");
        this.$message.success(res.data.message, 10);
    
      } else {
        console.log("flase");
        this.error = res.data.error;
}
}    
        
}
  };
  </script>
  
  <style scoped>
  .product-card {
    background-color: #ffffff; /* 不透明白色背景 */
    borderRadius: 8px; /* 圆角边框 */
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
    marginLeft: 8px;
  }
  
  .collapse-btn {
    display: block;
    marginTop: 8px;
    textAlign: right;
  }
  
  .action-btns {
    textAlign: right;
    marginTop: 8px;
  }
  </style>