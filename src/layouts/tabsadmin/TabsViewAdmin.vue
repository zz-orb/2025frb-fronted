<template>
    <admin-layout>
      <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect" />
      <tabs-head
          v-if="multiPage"
          :active="activePage"
          :page-list="pageList"
          @change="changePage"
          @close="remove"
          @refresh="refresh"
          @contextmenu="onContextmenu"
      />
      <div :class="['tabs-view-content', layout, pageWidth]" :style="`margin-top: ${multiPage? -24 : 0}px`"></div>
        <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
            <router-view v-if="!refreshing" ref="tabContent" :key="$route.fullPath" />
            <default-page v-else /> 
          <router-view ref="tabContent" v-if="!refreshing" />
          <default-page v-else /> 
        </page-toggle-transition>
      </admin-layout>
    </template>
    
    <script>
    import AdminLayout from '@/layouts/AdminLayout'
    import Contextmenu from '@/components/menu/Contextmenu'
    import PageToggleTransition from '@/components/transition/PageToggleTransition'
    import {mapState, mapMutations} from 'vuex'
    import {getI18nKey} from '@/utils/routerUtil'
    import TabsHead from '@/layouts/tabsadmin/TabsHead'
    import DefaultPage from '../../pages/demo';
    
    export default {
      name: 'TabsViewAdmin',
      i18n: require('./i18n'),
      components: {TabsHead, PageToggleTransition, Contextmenu, AdminLayout, DefaultPage},
      data () {
        return {
          pageList: [],
          activePage: '',
          menuVisible: false,
          refreshing: false,
        }
      },
      computed: {
       ...mapState('setting', ['multiPage', 'cachePage', 'animate', 'layout', 'pageWidth']),
        // 根据路由动态生成侧边栏菜单项列表
        menuItemList() {
          const currentRoute = this.$route;
          if (currentRoute.path === '/admin') {
            return [
              { key: 'admin_1', icon: 'admin_icon_1', text: this.$t('admin_closeLeft') },
              { key: 'admin_2', icon: 'admin_icon_2', text: this.$t('admin_closeRight') },
              { key: 'admin_3', icon: 'admin_icon_3', text: this.$t('admin_closeOthers') },
              { key: 'admin_4', icon: 'admin_icon_4', text: this.$t('admin_refresh') },
            ];
          } else {
            return [
              { key: '1', icon: 'vertical-right', text: this.$t('closeLeft') },
              { key: '2', icon: 'vertical-left', text: this.$t('closeRight') },
              { key: '3', icon: 'close', text: this.$t('closeOthers') },
              { key: '4', icon: 'sync', text: this.$t('refresh') },
            ];
          }
        },
        tabsOffset() {
          return this.multiPage? 24 : 0
        }
      },
      created () {
        const route = this.$route;
        if (route.path === '/admin') {
          // 这里可以添加根据/admin路由获取特定缓存配置或其他初始化操作的逻辑
          this.loadAdminCacheConfig(route);
        } else {
          this.loadCacheConfig(this.$router?.options?.routes);
        }
        this.loadCachedTabs();
        if (this.pageList.findIndex(item => item.path === route.fullPath) === -1) {
          this.pageList.push(this.createPage(route));
        }
        this.activePage = route.fullPath;
        if (this.multiPage) {
          this.$nextTick(() => {
            this.setCachedKey(route);
          });
          this.addListener();
        }
      },
      watch: {
        '$router.options.routes': function (val) {
          this.excludeKeys = [];
          if (this.$route.path === '/admin') {
            // 处理/admin路由下路由配置变化时的缓存配置加载逻辑
            this.loadAdminCacheConfig(this.$route, val);
          } else {
            this.loadCacheConfig(val);
          }
        },
        '$route': function (newRoute) {
          if (newRoute.path === '/admin') {
            // 清除可能影响侧边栏显示的缓存数据
            sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY);
            // 重新加载/admin路由下的侧边栏相关缓存数据（如果有）
            this.loadAdminCachedTabs();
          }
          this.activePage = newRoute.fullPath;
          const page = this.pageList.find(item => item.path === newRoute.fullPath);
          if (!this.multiPage) {
            this.pageList = [this.createPage(newRoute)];
          } else if (page) {
            page.fullPath = newRoute.fullPath;
          } else if (!page) {
            this.pageList.push(this.createPage(newRoute));
          }
          if (this.multiPage) {
            this.$nextTick(() => {
              this.setCachedKey(newRoute);
            });
          }
        },
        'multiPage': function (newVal) {
          if (!newVal) {
            this.pageList = [this.createPage(this.$route)];
            this.removeListener();
          } else {
            this.addListener();
          }
        },
        tabsOffset(newVal, oldVal) {
          this.correctPageMinHeight(oldVal - newVal);
        }
      },
      methods: {
        changePage (key) {
          this.activePage = key;
          const page = this.pageList.find(item => item.path === key);
          this.$router.push(page.fullPath);
        },
        remove (key, next) {
          if (this.pageList.length === 1) {
            return this.$message.warning(this.$t('warn'));
          }
          //清除缓存
          let index = this.pageList.findIndex(item => item.path === key);
          this.clearCaches = this.pageList.splice(index, 1).map(page => page.cachedKey);
          if (next) {
            this.$router.push(next);
          } else if (key === this.activePage) {
            index = index >= this.pageList.length? this.pageList.length - 1 : index;
            this.activePage = this.pageList[index].path;
            this.$router.push(this.activePage);
          }
        },
        refresh (key, page) {
          page = page || this.pageList.find(item => item.path === key);
          page.loading = true;
          this.clearCache(page);
          if (key === this.activePage) {
            this.reloadContent(() => page.loading = false);
          } else {
            // 其实刷新很快，加这个延迟纯粹为了 loading 状态多展示一会儿，让用户感知刷新这一过程
            setTimeout(() => page.loading = false, 500);
          }
        },
        onContextmenu(pageKey, e) {
          if (pageKey) {
            e.preventDefault();
            e.meta = pageKey;
            this.menuVisible = true;
          }
        },
        onMenuSelect (key, target, pageKey) {
          switch (key) {
            case 'admin_1': this.closeAdminLeft(pageKey); break;
            case 'admin_2': this.closeAdminRight(pageKey); break;
            case 'admin_3': this.closeAdminOthers(pageKey); break;
            case 'admin_4': this.refreshAdmin(pageKey); break;
            default: break;
          }
        },
        closeAdminOthers (pageKey) {
          // 清除缓存
          const clearPages = this.pageList.filter(item => item.path!== pageKey &&!item.unclose);
          this.clearCaches = clearPages.map(item => item.cachedKey);
          this.pageList = this.pageList.filter(item =>!clearPages.includes(item));
          // 判断跳转
          if (this.activePage!= pageKey) {
            this.activePage = pageKey;
            this.$router.push(this.activePage);
          }
        },
        closeAdminLeft (pageKey) {
          const index = this.pageList.findIndex(item => item.path === pageKey);
          // 清除缓存
          const clearPages = this.pageList.filter((item, i) => i < index &&!item.unclose);
          this.clearCaches = clearPages.map(item => item.cachedKey);
          this.pageList = this.pageList.filter(item =>!clearPages.includes(item));
          // 判断跳转
          if (!this.pageList.find(item => item.path === this.activePage)) {
            this.activePage = pageKey;
            this.$router.push(this.activePage);
          }
        },
        closeAdminRight (pageKey) {
          // 清除缓存
          const index = this.pageList.findIndex(item => item.path === pageKey);
          const clearPages = this.pageList.filter((item, i) => i > index &&!item.unclose);
          this.clearCaches = clearPages.map(item => item.cachedKey);
          this.pageList = this.pageList.filter(item =>!clearPages.includes(item));
          // 判断跳转
          if (!this.pageList.find(item => item.path === this.activePage)) {
            this.activePage = pageKey;
            this.$router.push(this.activePage);
          }
        },
        clearCache(page) {
          page._init_ = false;
          this.clearCaches = [page.cachedKey];
        },
        reloadContent(onLoaded) {
          this.refreshing = true;
          setTimeout(() => {
            this.refreshing = false;
            this.$nextTick(() => {
              this.setCachedKey(this.$route);
              if (typeof onLoaded === 'function') {
                onLoaded.apply(this, []);
              }
            });
          }, 200);
        },
        pageName(page) {
          return this.$t(getI18nKey(page.keyPath));
        },
        /**
         * 添加监听器
         */
        addListener() {
          window.addEventListener('page:close', this.closePageListener);
          window.addEventListener('page:refresh', this.refreshPageListener);
          window.addEventListener('unload', this.unloadListener);
        },
        /**
         * 移出监听器
         */
        removeListener() {
          window.removeEventListener('page:close', this.closePageListener);
          window.removeEventListener('page:refresh', this.refreshPageListener);
          window.removeEventListener('unload', this.unloadListener);
        },
        /**
         * 页签关闭事件监听
         * @param event 页签关闭事件
         */
        closePageListener(event) {
          const {closeRoute, nextRoute} = event.detail;
          const closePath = typeof closeRoute === 'string'? closeRoute : closeRoute.path;
          const path = closePath && closePath.split('?')[0];
          this.remove(path, nextRoute);
        },
        /**
         * 页面刷新事件监听
         * @param event 页签关闭事件
         */
        refreshPageListener(event) {
          const {pageKey} = event.detail;
          const path = pageKey && pageKey.split('?')[0];
          this.refresh(path);
        },
        /**
         * 页面 unload 事件监听器，添加页签到 session 缓存，用于刷新时保留页签
         */
        unloadListener() {
          const tabs = this.pageList.map(item => ({...item, _init_: false}));
          sessionStorage.setItem(process.env.VUE_APP_TBAS_KEY, JSON.stringify(tabs));
        },
        createPage(route) {
          return {
            keyPath: route.matched[route.matched.length - 1].path,
            fullPath: route.fullPath, loading: false,
            path: route.fullPath,
            title: route.meta && route.meta.page && route.meta.page.title,
            unclose: route.meta && route.meta.page && (route.meta.page.closable === false),
          }
        },
        /**
         * 设置页面缓存的key
         * @param route 页面对应的路由
         */
        setCachedKey(route) {
          const page = this.pageList.find(item => item.path === route.fullPath);
          page.unclose = route.meta && route.meta.page && (route.meta.page.closable === false);
          if (!page._init_) {
            const vnode = this.$refs.tabContent.$vnode;
            page.cachedKey = vnode.key + vnode.componentOptions.Ctor.cid;
            page._init_ = true;
          }
        },
        /**
         * 加载缓存的 tabs
         */
        loadCachedTabs() {
          const cachedTabsStr = sessionStorage.getItem(process.env.VUE_APP_TBAS_KEY);
          if (cachedTabsStr) {
            try {
              const cachedTabs = JSON.parse(cachedTabsStr);
              if (cachedTabs.length > 0) {
                this.pageList = cachedTabs;
              }
            } catch (e) {
              console.warn('failed to load cached tabs, got exception:', e);
            } finally {
              sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY);
            }
          }
        },
        loadCacheConfig(routes, pCache = true) {
          routes.forEach(item => {
            const cacheAble = item.meta?.page?.cacheAble?? pCache?? true;
            if (!cacheAble) {
              this.excludeKeys.push(new RegExp(`${item.path.replace(/:[^/]*/g, '[^/]*')}(\\?.*)?\\d*$`));
            }
            if (item.children) {
              this.loadCacheConfig(item.children, cacheAble);
            }
          });
        },
        // 加载/admin路由下的缓存配置
        loadAdminCacheConfig(route, routes) {
          // 这里添加具体的/admin路由下缓存配置加载逻辑，例如只加载特定模块或路径的缓存配置
          const adminRoutes = routes.filter(r => r.path.startsWith('/admin'));
          this.loadCacheConfig(adminRoutes, false);
        },
        // 加载/admin路由下的缓存tabs
        loadAdminCachedTabs() {
          const adminCachedTabsStr = sessionStorage.getItem('admin_' + process.env.VUE_APP_TBAS_KEY);
          if (adminCachedTabsStr) {
            try {
              const adminCachedTabs = JSON.parse(adminCachedTabsStr);
              if (adminCachedTabs.length > 0) {
                this.pageList = adminCachedTabs;
              }
            } catch (e) {
              console.warn('failed to load admin cached tabs, got exception:', e);
            } finally {
              sessionStorage.removeItem('admin_' + process.env.VUE_APP_TBAS_KEY);
            }
          }
        },
       ...mapMutations('setting', ['correctPageMinHeight'])
      }
    }
    </script>
    
    <style scoped lang="less">
     .tabs-view{
        margin: -16px auto 8px;
        &.head.fixed{
          max-width: 1400px;
        }
      }
     .tabs-view-content{
        position: relative;
        &.head.fixed{
          width: 1400px;
          margin: 0 auto;
        }
      }
    </style>