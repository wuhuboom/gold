<template>
	<view class="home">
		<view class="page-title">
			{{$t('page.home.title')}}
		</view>
		<view class="notice">
			<img src="../../static/images/home/Group7.webp"></img>
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
		<view class="user-header">
			<view class="user-title">{{$t('home.hello.text')}} 
				<text class="user-name">{{perInfo.username}}</text>
			</view>
			<view class="user-title">{{$t('home.welcome.text')}}</view>
		</view>
		<view class="user-info">
			<view class="bg-img">
				<img src="../../static/images/home/Union3.webp"></img>
			</view>
			<view class="user-content">
				<view class="left">
					<view class="handle-item" v-for="(item,index) in menus" :key="index" @click="goPage(item.path)">
						<img class="menu-icon" :src="item.icon"/>
					    <view class="handle-text">{{item.name}}</view>
					</view>
					<!-- <view class="handle-item">
						<img src="../../static/images/home/Group17.webp"></img>
						<view class="handle-text">{{$t('home.wallet.text')}}</view>
					</view>
					<view class="handle-item" @click="">
						<img src="../../static/images/home/Group20.webp"></img>
						<view class="handle-text">{{$t('home.recharge.text')}}</view>
					</view>
					<view class="handle-item">
						<img src="../../static/images/home/Group23.webp"></img>
						<view class="handle-text">{{$t('home.withdraw.text')}}</view>
					</view> -->
				</view>
				<view class="right">
					<img src="../../static/images/home/profile.webp">
					<view class="balance">
						<view class="balance-title">{{$t('home.balance.text')}}</view>
						<view class="balance-num">{{getAmount(perInfo.balance || 0)}}</view>
					</view>
				</view>
			</view>
			<view class="bg-img">
				<img src="../../static/images/home/Union4.webp"></img>
			</view>
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
	import {getAmount} from '@/utils/util.js'
	export default {
		data() {
			return {
				getAmount:getAmount,
				swipers:[],
				current: 0,
				mode: 'round',
				notice:{
					content:''
				},
				curVersion:0,
				showProcess:false,
				process:0,
				perInfo:{},
				menus:[
					{name:this.$t('home.wallet.text'),icon:'../../static/images/home/Group17.webp',path:'/pages/user/wallet'},
					{name:this.$t('home.recharge.text'),icon:'../../static/images/home/Group20.webp',path:'/pages/user/recharge?type=home'},
					{name:this.$t('home.withdraw.text'),icon:'../../static/images/home/Group23.webp',path:'/pages/user/withdraw?type=home'}
				]
			}
		},
		onShow() {
			this.checkSetPwd()
			this.getSwitch()
			this.loadNotice()
			this.getVersion()
			this.$store.dispatch('getUserInfo')
			this.perInfo = uni.getStorageSync('accountInfo')
		},
		methods: {
			goPage(path){
				uni.navigateTo({
					url:path
				})
			},
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
					}else{
						uni.setStorageSync('cur_version',res)
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
				this.$store.dispatch('getUserInfo',2)
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
		img{
			width: 50upx;
			height: auto;
		}
		::v-deep .uni-noticebar{
			margin-bottom: 0upx;
		}
	}
	.user-header{
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 28upx;
		font-weight: bold;
		line-height: 40upx;
		letter-spacing: 1.56px;
		color: #93643a;
		margin-top: 30upx;
		margin-bottom: 30upx;
		.user-name{
			margin-left: 20upx;
			color: #484a53;
		}
	}
	.user-info{
		width: 670upx;
		.bg-img{
			img{
				width: 100%;
				height: auto;
			}
		}
		.user-content{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 330upx;
			.left{
				width: 40%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				.handle-item{
					display: flex;
					flex-direction: column;
					align-items: center;
					img{
						width:60upx;
						height: auto;
					}
					.handle-text{
					  font-size: 26upx;
					  font-weight: bold;
					  line-height: 1.1;
					  letter-spacing: 1px;
					  color: #c1a374;
					  margin-top: 10upx;
					}
				}
			}
			.right{
				width: 60%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				 img{
					 width: 230upx;
					 height: auto;
				 }
				 .balance{
					 display: flex;
					 flex-direction: column;
					 align-items: center;
					 .balance-title{
						font-size: 24upx;
						font-weight: bold;
						line-height: 1.1;
						letter-spacing: 1px;
						color: #c1a374;
					 }
					 .balance-num{
						width: 256upx;
						height: 70upx;
						line-height: 70upx;
						margin: 6upx 58upx 24upx 22upx;
						background-color: #c9ac7f;
						text-align: center;
						font-size: 28upx;
						font-weight: bold;
						letter-spacing: 0.65px;
						color: #fff;
					 }
				 }
			}
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
	.user-header{}
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
