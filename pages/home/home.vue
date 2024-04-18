<template>
	<view class="home">
		<view class="page-title">
			{{$t('index.signin')}}
		</view>
		<view class="swiper" v-if="swipers.length > 0">
			<uni-swiper-dot :info="swipers" :current="current" field="content" :mode="mode">
				<swiper class="swiper-box" :autoplay="true" :circular="true">
					<swiper-item v-for="(item ,index) in swipers" :key="index">
						<view class="swiper-item">
							<image :src="item.imageUrl" model="scaleToFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<view class="notice">
			<uni-notice-bar scrollable single showIcon showGetMore :text="notice.content" :speed="50" background-color="" color="#fff" @getmore="getNotice"></uni-notice-bar>
		</view>
		 
		 
		 
	 
		
		<uni-popup ref="popup" :mask-click="false" background-color="#001413">
			<view class="popup-content">
				<view class="popup-logo">
					<image src="" mode="scaleToFill"></image>
				</view>
				<view class="popup-title">{{$t('security.update.fundpwd.text')}}</view>
				<view class="popup-info">{{$t('security.update.fundpwd.set.text')}}</view>
				<button @click="goSetPwd" class="popup-btn">{{$t('btn.change.confirm.text')}}</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {formatNum} from '@/utils/util.js'
	export default {
		data() {
			return {
				swipers:[],
				current: 0,
				mode: 'round',
				notice:{
					content:'[单行] 这是 NoticeBar '
				},
			}
		},
		onLoad() {
			this.checkSetPwd()
			this.getSwitch()
			this.loadNotice()
		},
		methods: {
			goSetPwd(){
				uni.navigateTo({
					url:'/pages/user/updateFundPwd?type=home'
				})
			},
			checkSetPwd(){
				this.$http.get('/player/getPwdPay',res=>{
					const type = res.data.paySet
					if(type==2){
						this.$refs.popup.open('center')
					}
				})
				
			},
			getSwitch(){
				const lang = uni.getLocale();
				this.$http.get('/player/home/slider?lang=' + lang,res=>{
					if(res.code==200){
						this.swipers  = res.data
					}
				})
			},
			loadSwiper(){
				this.$http.get('/player/home/slider',(res)=>{
					
				})
			},
			loadNotice(){
				this.$http.get('/player/home/notice',(res)=>{
					if(res.code == 200){
						const datas = res.data
						if(datas && datas.length > 0){
							this.notice = datas[0]
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.home{
	 width: 670upx;
	 height: 100vh;
	 padding-left: 40upx;
	 padding-right: 40upx;
	 .swiper{
		 height: 20vh;
		 ::v-deep .uni-swiper__warp,.swiper-box{
		 	height: 100%;
		 }
		 .swiper-item{
		 	width: 670upx;
		 	height: 100%;
		 	image{
		 		width: 100%;
		 		height: 100%;
		 	}
		 }
	 }
}
</style>
