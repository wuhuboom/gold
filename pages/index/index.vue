<template>
	<view class="login">
		<language></language>
		<view class="top">
			<image src="../../static/images/login/logo.png"></image>
			<view class="sub-title">
				{{$t('login.logo.text')}}
			</view>
		</view>
		<view class="form">
			<view class="title">{{$t('login.begin.text')}}</view>
			<view class="email-box" @click="goRegister">
				<uni-icons type="email-filled" size="30" color="#000"></uni-icons>
				<view class="text">{{$t('login.email.placehoder')}}</view>
			</view>
			<view class="hasAccount">
				<view class="tips">{{$t('login.hasaccount.text')}}</view>
				<view class="login-link" @click="gologin">{{$t('login.login.text')}}</view>
			</view>
			
			<view class="down-box" @click="down">
				<view class="down-text" >{{$t('login.down.text')}}</view>
				<uni-icons type="download" size="30" color="#fff"></uni-icons>
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
			gologin(){
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
.login{
	height: 100vh;
	width: 750upx;
	color: #fff;
	.top{
		padding-top: 20vh;
		text-align: center;
		image{
			width: 500upx;
			height: 12vh;
		}
		.sub-title{
			font-size: 14px;
			letter-spacing: 1.5upx;
			margin-top: 10upx;
		}
	}
	.form{
		margin-top: 10vh;
		padding:40upx;
		text-align: center;
		.title{
			font-size: 16px;
		}
		.email-box{
			display: flex;
			align-items: center;
			background-color: #fff;
			height: 90upx;
			border-radius: 10upx;
			margin-top: 20upx;
			padding-left: 40upx;
			.text{
				color: #000;
				padding-left: 80upx;
			}
		}
		.hasAccount{
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 40upx;
			.tips{
				margin-right: 20upx;
			}
			.login-link{
				margin-left: 20upx;
				color: $fontColor;
			}
		}
		.down-box{
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: $fontColor;
			color: #fff;
			height: 90upx;
			border-radius: 10upx;
			margin-top: 20upx;
			padding-left: 40upx;
			.down-text{
				margin-right: 30upx;
			}
		}
	}
}
</style>
