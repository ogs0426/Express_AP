<template>
  <div id="header">
    <img src="../../assets/images/example_logo_menu.png" @click="$router.push('/')" id="logo">
    <ul id="mainMenu">
      <li v-for="item in menu" :key="item.title">
        <template v-if="item.children && item.children.length > 0">
          <a @mouseover="activeMenu = true" @mouseout="activeMenu = false">
            {{ item.title }}
            <ul id="subMenu" v-show="activeMenu">
              <li v-for="subItem in item.children" :key="subItem.title">
                <router-link :to="subItem.path">{{ subItem.title }}</router-link>
              </li>
            </ul>
          </a>
        </template>
        <template v-else>
          <router-link :to="item.path">{{ item.title }}</router-link>
        </template>
      </li>
    </ul>
    <label id="logoutBtn" @click="clickLogout">로그아웃</label>
  </div>
</template>

<script>
import * as CommonStore from '@/store/common'

export default {
  name: 'mainHeader',
  components: {},
  data() {
    return {
      menu: [
        {title: '배너', path: '/banner'},
        {title: '채널', path: '/channel'},
        {title: '프로그램', path: '/program'},
        {title: '링크', path: '/link'},
        {title: '공지/이벤트', path: '/board'},
        {title: '편성표', path: '/schedule'},
      ],
      activeMenu: false
    }
  },
  methods: {
    ...CommonStore.mapActions([
      'logout'
    ]),
    clickLogout() {
      this.logout()
    }
  }
}
</script>

<style lang="less">
#header {
  font-family: 'NanumSquare', sans-serif;
  background-color: #fff;
  width: 100%;
  height: 80px;
  position: relative;
  display: flex;
  left: 0;
  right: 0;
  margin: auto;
  align-items: center;
  justify-content: center;
  // max-width: 1920px;
  &::after {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 4px;
    bottom: 0;
    background: transparent linear-gradient(90deg, #FFFF8C 0%, #FF4171 100%) 0% 0% no-repeat padding-box;
  }
  #logo {
    width: 150px; 
    padding: 10px;
    cursor: pointer;
    margin-left: 100px;
  }

  #mainMenu {
    list-style: none;
    display: flex;
    height: 100%;
    margin-left: 35px;

    > li {
      display: inline;
      cursor: pointer;

      > a {
        color: #000000;
        font-weight: 600;
        padding: 0 20px;
        display: flex;
        height: 100%;
        align-items: center;
        position: relative;

        &.router-link-active {
          color: #FF4171;
          font-weight: 900;
        }
      }
    }
  }

  #subMenu {
    list-style: none;
    position: absolute;
    background-color: #fff;
    left: 0px;
    top: 65px;
    width: 100%;
    text-align: center;

    > li {
      cursor: pointer;

      > a {
        color: inherit;
        white-space: nowrap;
        display: inline-block;
        line-height: 37px;
        width: 100%;
      }
    }
  }

  #logoutBtn {
    margin-left: auto;
    margin-right: 30px;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>