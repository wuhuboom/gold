<template>
	<view class="login">
		<view class="content">
			<view class="title">
				{{$t('index.signin')}}
			</view>
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
					<uni-forms-item name="username">
						<uni-easyinput type="text" v-model="formData.username" :placeholder="$t('login.form.username')" />
					</uni-forms-item>
					<uni-forms-item name="password">
						<uni-easyinput type="password" v-model="formData.password" :placeholder="$t('login.form.pwd')" />
					</uni-forms-item>
					<uni-forms-item name="code" class="code-item">
						<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('login.form.code')" />
						<image :src="vercodeImg" class="code-img" mode="scaleToFill" @click="getCodeData"></image>
					</uni-forms-item>
				</uni-forms>
				 
				<button class="btn" @click="submit">{{$t('btn.ok.text')}}</button>
			</view>
		</view>
		
		 
	</view>
</template>

<script>
	export default {
		components:{
		},
		data() {
			return {
				formData:{
					password :'',
					username :'',
					code:''
				},
				rules: {
					username: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('login.form.username')})}
						]
					},
					 password: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('login.form.pwd')})}
					 	]
					 },
					 code: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('login.form.code')})}
					 	]
					 }
				},
				vercodeImg:'',
				verifyKey:''
			}
		},
		onLoad() {
			this.getCodeData()
		},
		methods: {
			goReset(){
				uni.navigateTo({
					url:'/pages/login/forgetPwd'
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
					para.verifyKey = this.verifyKey
					this.$http.post('/player/auth/login',para,(res=>{
						if(res.code ==200){
							uni.setStorageSync("token",res.data.token)
							uni.setStorageSync("user",res.data.user)
							uni.switchTab({
								url:'/pages/home/home'
							})
						}else{
							this.getCodeData()
						}
					}))
				}).catch(err =>{
					console.log(err);
				})
			},
			getCodeData() { //获取验证码方法
			    this.verifyKey = "";
			    this.vercodeImg = ""
			    this.formData.verificationCode = ''
				const verifyKey = new Date().getTime()
				this.$http.get('/player/auth/verify_code?verifyKey=' + verifyKey,{},res=>{
					if(res.code==200){
						this.vercodeImg = res.data.img
						this.verifyKey = res.data.verifyKey
					}
				})
			},
		}	 
	}
</script>

<style lang="scss" scoped>
.login{
	width: 750upx;
	height: 100vh;
	background-image: url('../../static/images/login/bg.webp');
	background-repeat: no-repeat;
	background-size: 100% 100%;
	.content{
		padding: 40upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title{
			margin-top: 20upx;
			font-size: 32upx;
			font-weight: bold;
			font-stretch: normal;
			font-style: normal;
			line-height: 1.23;
			letter-spacing: 2.6px;
			color: #b57d3c;
		}
		.form{
			width: 580upx;
			margin-top: 200upx;
			::v-deep .uni-easyinput__content{
				background-color: transparent!important;
				border: solid 1px #a5a5a5!important;
				font-size: 10px;
				font-weight: bold;
				letter-spacing: 1px;
				color: #c1a374!important;
			}
			::v-deep .uni-input-placeholder{
				letter-spacing: 1px;
				color: #c1a374!important;
			}
			::v-deep .uni-forms-item__label{
				display: none;
			}
			::v-deep .uni-icons{
				color: #c1a374!important;
			}
			.code-item{
				position: relative;
				.code-img{
					position: absolute;
					right: 10upx;
					top:6upx;
					width: 150upx;
					height: 60upx;
				}
			}
			
			.btn{
				width: 342upx;
				height: 82upx;
				background-image: url('../../static/images/index/okbtn.webp');
				background-size: 100%;
			}
		}
	}
}
</style>
