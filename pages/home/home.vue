<template>
	<view class="home">
		<view class="page-title">
			{{$t('page.home.title')}}
		</view>
		<view class="notice">
			<image src="../../static/images/home/Group7.webp" mode="scaleToFill"></image>
			<uni-notice-bar scrollable single :text="notice.content" :speed="50" background-color="#dde0e8" color="#c1a374"></uni-notice-bar>
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
		
		 
		 
	 
		
		 
		<uni-popup ref="versionPopup" type="center" :animation="false" background-color="transparent" border-radius="10px 10px 0 0" :is-mask-click="false">
			<view class="version-dialog">
				<view class="popup-title">{{$t('version.dialog.title')}}</view>
				<view class="popup-content">{{$t('version.dialog.content')}}</view>
				<view class="popup-btn" v-if="!showProcess">
					<view class="yes-btn" @click="yesUpdate">{{$t('btn.yes.text')}}</view>
					<view class="no-btn" @click="noUpdate">{{$t('btn.no.text')}}</view>
				</view>
				<view class="update-process" v-else>
					<progress :percent="process" :show-info="false" stroke-width="6" border-radius="5" activeColor="#b57d3c" background-color="#fff"/>
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
						this.curVersion = res
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
	.notice{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		image{
			width: 50upx;
			height: 50upx;
		}
		::v-deep .uni-noticebar{
			margin-bottom: 0upx;
		}
	}
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
	 		background-size: 100% 100%;
			margin-top: 60upx;
	 		width: 368upx;
	 		height: 72upx;
	 		font-size: 26upx;
	 	    font-weight: bold;
	 	    letter-spacing: 1.95px;
	 	    color: #93643a;
	 		display: flex;
			justify-content: space-between;
			align-items: center;
			.yes-btn{
				margin-left: 80upx;
			}
			.no-btn{
				margin-right: 60upx;
			}
	 	}
		.update-process{
			margin-top: 60upx;
			width: 60%;
		}
	 }
}
</style>
