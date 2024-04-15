<template>
	<view class="set-about">
		<uni-nav-bar left-icon="left"  :title="$t('setting.menu2.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="top">
			<image src="../../static/images/login/logo.png"></image>
			<view class="sub-title">
				{{$t('login.logo.text')}}
			</view>
		</view>
		<view class="form">
			<view class="title">{{$t('setting.aboutus.version.text')}} {{version}}</view>
			<view class="down-box" @click="down">
				<view class="down-text">{{$t('login.down.text')}}</view>
			</view>
				
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version:'1.0.0',
				osType:'',
				downObj:''
			}
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
			goBack(){
				uni.navigateTo({
					url:'./setting'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.set-about{
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
			width: 200upx;
			background-color: $fontColor;
			color: #fff;
			height: 90upx;
			line-height: 90upx;
			border-radius: 10upx;
			margin: 20upx auto;
		}
	}
}
</style>
