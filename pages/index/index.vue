<template>
	<view class="gold-index">
		<language></language>
		 <view class="content">
			 <view class="welcome">{{$t('index.welcome')}}</view>
			 <view class="sign">
				 <image src="../../static/images/index/icon1.webp" mode="scaleToFill"></image>
				 <view class="tips" @click="goLogin">{{$t('index.signin')}}</view>
			 </view>
			 <view class="sign">
				 <image src="../../static/images/index/icon2.webp"  mode="scaleToFill"></image>
				 <view class="tips" @click="goRegister">{{$t('index.signup')}}</view>
			 </view>
		 </view>
	</view>
</template>

<script>
	import language from '@/components/language.vue'
	export default {
		components:{
			language
		},
		data() {
			return {
				osType:'',
				downObj:''
			}
		},
		onLoad() {
			this.getOsType()
		},
		methods: {
			down(){
				this.$http.get('/player/home/app_url',res=>{
					res = res.data
					res.forEach(item => {
						if(item.appType==this.osType){
							downObj = item
						}
					});
					    if(this.downObj.appUrl){
					        setTimeout(() => {
					            window.location.href = this.downObj.appUrl
					        }, 1000)
					    }
				})
			},
			getOsType() {
			    if (navigator.userAgent.indexOf('iPhone') !== -1) {
			        this.osType = 1
			    } else if (navigator.userAgent.indexOf('Android') !== -1) {
			        this.osType = 0
			    }
			},
			goLogin(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			goRegister(){
				uni.navigateTo({
					url:'/pages/login/register'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.gold-index{
	width: 750upx;
	height: 100vh;
	background-image: url('../../static/images/index/bg.webp');
	background-size: contain;
	background-repeat: no-repeat;
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 800upx;
		.welcome{
			color: #b57d3c;
			font-size: 26upx;
			letter-spacing: 5.2upx;
			font-weight: bold;
			margin-bottom: 60upx;
		}
		.sign{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 50upx;
			image{
				width: 60upx;
				height: 60upx;
			}
			.tips{
				margin-top: 20upx;
				font-size: 26upx;
				font-weight: bold;
				font-stretch: normal;
				font-style: normal;
				line-height: 1.15;
				letter-spacing: 1.95px;
				color: #93643a;
			}
		}
	}
}
</style>
