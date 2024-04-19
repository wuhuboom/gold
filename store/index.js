import Vue from 'vue'
import Vuex from 'vuex'
import req from '../http'
const http = req.http
 
Vue.use(Vuex)
 
const store = new Vuex.Store({
  state: {
    sysStatus: 0,
	accountInfo: {}
  },
  mutations: {
    changeStatus(state,status) {
	  uni.setStorageSync("sysStatus",status)
      state.sysStatus = status
    }
  },
  actions: {
    changeStatus(context,status) {
	  uni.setStorageSync("sysStatus",status)
      context.commit('changeStatus',status)
    },
	async getUserInfo() {
	  let res = await http.get("/player/player_info")
	  if(res.statusCode==200){
		  res = res.data
		  if(res.code == 200){
			  const account = uni.getStorageSync("accountInfo");
			  if(!account || res.data.balance >= 0){
			    this.accountInfo = res.data
			    uni.setStorageSync("accountInfo", this.accountInfo);
			  }
		  }
	  }
	}
  },
  getters:{
	  getSysStatus:status=>{
		  return uni.getStorageSync('sysStatus')
	  }
  }
})
 
export default store