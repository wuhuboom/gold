import http from './apiRequest'
// import {baseUrl} from '../utils/global'
import {baseUrl} from '../static/config/config.js'
import Vue from 'vue'
import VueI18n from "vue-i18n"
import messages from "../i18n/index"

// i18国际化
let i18nConfig = {
	locale: uni.getLocale(), // 获取已设置的语言
	messages,
};
Vue.use(VueI18n);
const i18n = new VueI18n(i18nConfig);
const vueInstance = new Vue({
  i18n,
});

const AUTH_TOKEN = 'token'
http.setBaseUrl(baseUrl)
http.beforeRequestFilter = function(res){
	const token = uni.getStorageSync(AUTH_TOKEN);
	if(token){
		http.header.token = token
	}
	if(res.url.indexOf("/login") < 0){
		if (uni.getStorageSync(AUTH_TOKEN)) {
			http.header[AUTH_TOKEN] = uni.getStorageSync(AUTH_TOKEN);
		}
	} 
	return res;
}
http.beforeResponseFilter = function (res) {
    //X-Auth-Token
	if(res.statusCode==200){
		res = res.data
		if(res.code == 200){
			return res
		}else if(res.code == 103 || res.code == 105){
			const data = res.data;
			if(data.length > 0){
				uni.showToast({
					title:vueInstance.$t('backapi.'+data[0].msgKey),
					duration:2000,
					icon:'error'
				})
			}
			
		}else if(res.code==401 || res.code==402 || res.code==403) {
			uni.showToast({
			  icon: "none",
			  title: res.msg,
			  success: () => {
			    uni.reLaunch({
			      url: "/pages/index/index",
			      success() {},
			    });
			  },
			});
			return
		}else{
			uni.showToast({
				title:res.msg,
				icon:'error',
				duration:2000,
			})
		}
		return res;
	}else{
		uni.showToast({
			 icon: 'none',
			 title: res.errMsg,
		})
		return res;
	}
   
}
 
let req = {
    'http': http
}
export default req