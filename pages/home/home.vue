<template>
	<view class="home">
		<view class="page-title">
			{{$t('page.home.title')}}
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
		 
		 
		 
	 
		
		 
		<uni-popup ref="versionPopup" type="center" :animation="false" background-color="transparent" border-radius="10px 10px 0 0" :is-mask-click="false">
			<view class="version-dialog">
				<view class="popup-title">{{$t('version.dialog.title')}}</view>
				<view class="popup-content">{{$t('version.dialog.content')}}</view>
				<view class="popup-btn" v-if="!showProcess">
					<view class="yes-btn" @click="yesUpdate">{{$t('btn.yes.text')}}</view>
					<view class="no-btn" @click="noUpdate">{{$t('btn.no.text')}}</view>
				</view>
				<view class="update-process" v-else>
					
				</view>
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
				curVersion:0,
				showProcess:false,
				process:0
			}
		},
		onLoad() {
			this.checkSetPwd()
			this.getSwitch()
			this.loadNotice()
			this.getVersion()
		},
		methods: {
			async yesUpdate(){
				uni.setStorageSync('cur_version',this.curVersion)
				this.showProcess = true
				while(this.process < 100){
					this.process += 10
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}
				this.noUpdate()
				this.showProcess = false
				window.location.reload()
			},
			noUpdate(){
				this.$refs.versionPopup.close()
			},
			getVersion(){
				this.curVersion = uni.getStorageSync('cur_version') || 0
				this.$http.get('/player/home/version',res=>{
					if(this.curVersion > 0 && this.curVersion != res){
						this.$refs.versionPopup.open()
					}
				})
			},
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
	 .version-dialog{
	 	background-image: url('../../static/images/index/poup-bg.webp');
	 	background-size: 100%;
	 	width:600upx;
	 	height: 460upx;
	 	display: flex;
	 	flex-direction: column;
	 	align-items: center;
	 	position: relative;
	 	.popup-title{
	 		font-size: 26upx;
	 		font-weight: bold;
	 		line-height: 1.15;
	 		letter-spacing: 1.95px;
	 		color: #93643a;
	 		margin-top: 100upx;
	 	}
	 	.popup-content{
	 	  font-size: 20upx;
	 	  font-weight: bold;
	 	  line-height: 2;
	 	  letter-spacing: 1px;
	 	  text-align: center;
	 	  color: #c1a374;
	 	  margin-top: 40upx;
	 	  padding: 20upx;
	 	}
	 	.popup-btn{
	 		background-image: url('../../static/images/index/okbtn.webp');
	 		background-size: 100%;
	 		width: 268upx;
	 		height: 72upx;
	 		line-height: 72upx;
	 		text-align: center;
	 		position: absolute;
	 		bottom: 60upx;
	 		font-size: 26upx;
	 	    font-weight: bold;
	 	    letter-spacing: 1.95px;
	 	    color: #93643a;
	 		
	 	}
	 }
}
</style>
