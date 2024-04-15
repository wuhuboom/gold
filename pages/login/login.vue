<template>
	<view class="login">
		<language></language>
		<view class="back" @click="goBack">
			<uni-icons type="arrow-left" size="40" color="#fff"></uni-icons>
		</view>
		<view class="title">
			{{$t('login.title.text')}}
		</view>
		<view class="sub-title">
			{{$t('login.subtitle.text')}}
		</view>
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
				<uni-forms-item :label="$t('register.username.text')" name="username">
					<uni-easyinput type="text" prefixIcon="auth" v-model="formData.username" :placeholder="$t('ruls.xxx.please',{name:$t('register.username.text')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.password.text')" name="password">
					<uni-easyinput type="password" prefixIcon="locked" v-model="formData.password" :placeholder="$t('ruls.xxx.please',{name:$t('register.password.text')})" />
				</uni-forms-item>
				
			</uni-forms>
			<view class="forget-box">
				<view class="forget">
					{{$t('login.forgetpwd.text')}}
				</view>
				<view class="reset" @click="goReset">
					{{$t('login.resetpwd.text')}}
				</view>
			</view>
			<button class="btn" @click="submit">{{$t('login.login.text')}}</button>
		</view>
		
		<view class="hasAccount">
			<view class="tips">{{$t('login.noaccount.text')}}</view>
			<view class="login-link" @click="goRegister">{{$t('login.register.text')}}</view>
		</view>
		
		<view class="down-box">
			<view class="down-text">{{$t('login.down.text')}}</view>
			<uni-icons type="download" size="30" color="#fff"></uni-icons>
		</view>
	</view>
</template>

<script>
	import language  from '@/components/language.vue'
	export default {
		components:{
			language
		},
		data() {
			return {
				formData:{
					password :'',
					username :''
				},
				rules: {
					username: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.username.text')})}
						]
					},
					 password: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.password.text')})}
					 	]
					 }
				}
			}
		},
		onLoad() {
		},
		methods: {
			goReset(){
				uni.navigateTo({
					url:'/pages/login/forgetPwd'
				})
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			goRegister(){
				uni.navigateTo({
					url:'/pages/login/register'
				})
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/auth/login',para,(res=>{
						if(res.code ==200){
							uni.setStorageSync("token",res.data.token)
							uni.setStorageSync("user",res.data.user)
							uni.switchTab({
								url:'/pages/home/home'
							})
						}
					}))
				}).catch(err =>{
					console.log(err);
				})
			},
		}	 
	}
</script>

<style lang="scss" scoped>
.login{
	width: 670upx;
	height: 100vh;
	padding: 40upx;
	.title{
		color: #fff;
		font-size: 24px;
		margin-top: 40upx;
	}
	.sub-title{
		color:#fff;
		font-size: 14px;
		margin-bottom: 60upx;
		letter-spacing: 2upx;
	}
	.form{
		width: 670upx;
		::v-deep .uni-forms-item__label{
			color: #fff;
		}
		::v-deep .uni-easyinput__content{
			background-color: rgb(24, 24, 34)!important;
			border-color: rgb(24, 24, 34)!important;
			color: rgb(255,255,255)!important;
		}
		::v-deep .uni-icons{
			color: $fontColor!important;
		}
		.btn{
			background-color: $fontColor;
			color: #fff;
		}
		.forget-box{
			display: flex;
			justify-content: end;
			color: #fff;
			margin-bottom: 40upx;
			.reset{
				color: $fontColor;
			}
		}
	}
	.hasAccount{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40upx;
		.tips{
			margin-right: 20upx;
			color:#fff;
		}
		.login-link{
			margin-left: 20upx;
			color: $fontColor;
		}
	}
	.down-box{
		display: flex;
		width: 670upx;
		align-items: center;
		justify-content: center;
		background-color: $fontColor;
		color: #fff;
		height: 90upx;
		border-radius: 10upx;
		margin-top: 20upx;
		.down-text{
			margin-right: 30upx;
		}
	}
}
</style>
