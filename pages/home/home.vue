<template>
	<view class="home">
		<view class="swiper">
			<uni-swiper-dot :info="swipers" :current="current" field="content" :mode="mode">
				<swiper class="swiper-box" @change="change" :autoplay="true" :circular="true">
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
		<view class="game-tools">
			<view class="title">{{$t('home.game.tool.title.text')}}</view>
			<view class="more" @click="getMore">
				<view>{{$t('home.game.tool.more.text')}}</view>
				<uni-icons type="right" color="#fff"></uni-icons>
			</view>
		</view>
		<view class="game">
			<swiper class="swiper-game" @change="change" :display-multiple-items="2">
				<block v-for="(item ,index) in gameTools" :key="index">
					<swiper-item  @click="showDetail(item)" next-margin="20" v-if="index < 4">
						<view class="swiper-item">
							<view class="img-bg">
								<img :src="item.img"/>
							</view>
							<view class="game-tools-title">{{item.name}}</view>
							<view class="game-tools-money">{{item.price}}</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		 
		<view class="game-tab">
			<view class="tab-bar" :class="tabIndex==1?'tab-active':''" @click="changeTab(1)">{{$t('home.game.zhishu.text')}}</view>
			<view class="tab-bar" :class="tabIndex==2?'tab-active':''" @click="changeTab(2)">{{$t('home.game.down.text')}}</view>
		</view>
		<view class="game-zhi" v-if="tabIndex==1">
			<view class="game-item" v-for="(item,index) in gamezhis" :key="index" :style="{'backgroundImage':'url('+item.path+')'}">
				<view class="title">{{item.name}}</view>
				<view class="info">
					<view class="left">
						<image src="../../static/images/home/10026.png" mode="scaleToFill"></image>
						<view class="number">{{$t('home.game.player.num.text')}} {{formatNum(item.num)}}</view>
					</view>
					<view class="right">
						<image src="../../static/images/home/10027.png" mode="scaleToFill"></image>
						<view class="number">{{$t('home.game.rate.num.text')}} {{formatNum(item.rate)}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="game-down" v-else>
			<view class="game-item" v-for="(item,index) in gamedowns" :key="index" :style="{'backgroundImage':'url('+item.path+')'}" @click="download(item)">
				<view class="title">{{item.name}}</view>
			</view>
		</view>
		
		<uni-popup ref="popup" :mask-click="false" background-color="#001413">
			<view class="popup-content">
				<view class="popup-logo">
					<image src="../../static/images/home/lock.webp" mode="scaleToFill"></image>
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
	// console.log(formatNum(12345))
	export default {
		data() {
			return {
				swipers:[
					{id:'1',name:'',imageUrl:'../../static/images/home/10001.jpg'},
					{id:'2',name:'',imageUrl:'../../static/images/home/10002.jpg'},
					{id:'3',name:'',imageUrl:'../../static/images/home/10003.jpg'}
				],
				current: 0,
				mode: 'round',
				notice:{
					content:'[单行] 这是 NoticeBar '
				},
				gameTools:[],
				tabIndex:1,
				gamezhis:[
					
				],
				gamedowns:[
					
				],
				formatNum:formatNum
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
			// 
			changeTab(index){
				this.tabIndex = index
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
			},
			change(e) {
				this.current = e.detail.current;
			},
			getNotice(){
				uni.navigateTo({
					url:'./notice'
				})
			},
			getMore(){
				uni.navigateTo({
					url:'/pages/home/gameTools'
				})
			},
			download(item){
				if(item.url){
					window.location.href=item.url
				}
			},
			showDetail(item){
				uni.navigateTo({
					url:'/pages/home/gameToolsDetai?id=' + item.id,
					
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.home{
	width: 670upx;
	padding: 40upx;
	min-height: 100vh;
	background-image: url('../../static/images/home/10046.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
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
	.notice{
		margin-top: 20upx;
		::v-deep .uni-noticebar{
			border: 1px solid $fontColor;
			box-shadow: inset 0 0 16upx 0upx $fontColor;
		}
		::v-deep .uniui-sound{
			color: $fontColor!important;
		}
	}
	.game-tools{
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #fff;
		.title{
			font-size: 40upx;
			font-weight: 600;
		}
		.more{
			display: flex;
			align-items: center;
			color: #fff;
			font-size: 26upx;
		}
	}
	.game{
		width: 100%;
		height: 25vh;
		margin-top: 40upx;
		.swiper-game{
			width: 100%;
			height: 100%;
			::v-deep .uni-swiper__warp,.swiper-box{
				height: 100%;
			}
			::v-deep .uni-swiper-slide-frame{
				width: 45%!important;
			}
			.swiper-item{
				padding:40upx;
				color: #fff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.img-bg{
					background-image: url('../../static/images/home/10048.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 320upx;
					height: 18vh;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: -100upx;
					img{
						max-width: 150upx;
						height: auto;
					}
				}
				.game-tools-title{
					text-align: center;
					font-size: 24upx;
					height: 4vh;
				}
				.game-tools-money{
					height: 4vh;
					background-color: rgb(23, 23, 23);
					color: rgb(250, 217, 167);
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 30upx;
					margin-top: 30upx;
					margin-bottom: 20upx;
					padding-left: 30upx;
					padding-right: 30upx;
					min-width: 100upx;
				}
			}
		}
	} 
	.game-tab{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: rgb(183,186,188);
		width: 100%;
		.tab-bar{
			min-width: 200upx;
			height: 90upx;
		}
		.tab-active{
			color: #fff;
			background-image: url('../../static/images/home/10049.png');
			background-size: 100% 100%;
			height: 90upx;
		}
	}
	.game-zhi,.game-down {
		.game-item{
			height: 120upx;
			background-size: 100% 100%;
			padding-top: 240upx;
			padding-left: 20upx;
			padding-right: 20upx;
			margin-bottom: 40upx;
			box-shadow: inset 0px -30px 30px -20px $fontColor;
			// box-shadow: inset 0px 0px 0px -0px transparent, 
			// 			inset 0px -20px 10px -10px $fontColor;
			.title{
				color: #fff;
				margin-bottom: 10upx;
			}
			.info{
				color: #fff;
				display: flex;
				justify-content: space-between;
				font-size: 24upx;
				.left,.right{
					display: flex;
				}
				image{
					width: 50upx;
					height: 50upx;
				}
			}
		}
	}
	.popup-content{
		width: 600upx;
		color: #fff;
		padding: 40upx 20upx;
		.popup-logo{
			width: 100%;
			height: 120upx;
			display: flex;
			justify-content: center;
			image{
				width: 100upx;
				height: 100upx;
			}
		}
		.popup-title{
			text-align: center;
			font-size: 28upx;
			font-weight: 600;
		}
		.popup-info{
			margin-top: 20upx;
			font-size: 26upx;
		}
		.popup-btn{
			background-color: $fontColor;
			color: #fff;
			height: 80upx;
			width: 300upx;
			margin-top: 60upx;
		}
	}
}
</style>
