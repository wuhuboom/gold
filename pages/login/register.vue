<template>
	<view class="register">
		<language></language>
		<view class="back" @click="goBack">
			<uni-icons type="arrow-left" size="40" color="#fff"></uni-icons>
		</view>
		<view class="title">
			{{$t('register.title.text')}}
		</view>
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
				<uni-forms-item :label="$t('register.username.text')" name="username">
					<uni-easyinput type="text" prefixIcon="auth" v-model="formData.username" :placeholder="$t('ruls.xxx.please',{name:$t('register.username.text')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.email.text')" name="email">
					<uni-easyinput type="text" prefixIcon="email" v-model="formData.email" :placeholder="$t('ruls.xxx.please',{name:$t('register.email.text')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.code.text')" name="code">
					<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('ruls.xxx.please',{name:$t('register.code.text')})" >
						<template #right>
								<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendCode.text')}}</view>
								<view v-else class="sendCode"> {{countTime}} s</view>
							</template>
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item :label="$t('register.password.text')" name="password">
					<uni-easyinput type="password" prefixIcon="locked" v-model="formData.password" :placeholder="$t('ruls.xxx.please',{name:$t('register.password.text')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.twoPassword.text')" name="twoPassword">
					<uni-easyinput type="password" prefixIcon="locked" v-model="formData.twoPassword" :placeholder="$t('ruls.xxx.please',{name:$t('register.twoPassword.text')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.invitationCode.text')" name="invitationCode">
					<uni-easyinput type="text" prefixIcon="personadd" v-model="formData.invitationCode" :placeholder="$t('ruls.xxx.please',{name:$t('register.invitationCode.text')})" />
				</uni-forms-item>
			</uni-forms>
			<button class="btn" @click="submit">{{$t('register.confirm.text')}}</button>
		</view>
		
		<view class="hasAccount">
			<view class="tips">{{$t('login.hasaccount.text')}}</view>
			<view class="login-link" @click="goLogin">{{$t('login.login.text')}}</view>
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
					username:'',
					password :'',
					twoPassword :'',
					invitationCode:'',
					code :'',
					email :''
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
					 },
					 twoPassword: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.twoPassword.text')})},
							{
								validateFunction:(rule,value,data,callback)=>{
									if (value != this.formData.password) {
										callback(this.$t('ruls.twoPassword'))
									}
									return true
								}
							}
					 	]
					 },
					 invitationCode: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.invitationCode.text')})}
					 	]
					 },
					 code: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.code.text')})}
					 	]
					 },
					email: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.email.text')})},
							{format: 'email',errorMessage: this.$t('ruls.email')},
						]
					}
				},
				isSendCode:false,
				countTime:60,
				invitation_code:1
			}
		},
		onLoad() {
			this.getSysConfig()
		},
		methods: {
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			goLogin(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			submit(){
				if(this.invitation_code ==2){
					delete this.rules.invitationCode
				}
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/auth/regist',para,(res=>{
						if(res.code ==200){
							uni.setStorageSync("token",res.data.token)
							uni.setStorageSync("user",res.data.user)
							uni.showToast({
								title:this.$t('register.success.text'),
								duration:2000,
								success() {
									uni.navigateTo({
										url:'/pages/login/login'
									})
								}
							})
						}else{
							this.isSendCode = false
						}
					}))
				}).catch(err =>{
					console.log( err);
				})
			},
			getSysConfig(){
				this.$http.get('/player/auth/sys_config',(res=>{
					if(res.code == 200){
						this.invitation_code = res.data.invitation_code || 1
					}
				}))
			},
			sendCode(){
				if(!this.formData.email){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('register.email.text')}),
						duration: 3000
					})
					return 
				}
				let para = {
					email : this.formData.email
				}
				this.$http.post('/player/auth/code', para,(res)=>{
					if(res.code == 200){
						uni.showToast({
							title:this.$t('register.sendCode.success'),
							duration:2000
						})
						this.isSendCode = true
						this.startCount()
					}
				})
			},
			startCount(){
				if(this.countTime <= 0){
					this.countTime = 60
					this.isSendCode = false
				}else{
					this.countTime--
					setTimeout(this.startCount,1000)
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.register{
	width: 670upx;
	height: 100vh;
	padding: 40upx;
	.title{
		height: 8vh;
		color: #fff;
		font-size: 24px;
		margin-top: 40upx;
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
		.sendCode{
			color: $fontColor;
			padding-right: 30upx;
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
}
</style>
