<template>
	<view class="register">
		<view class="content">
			<view class="title">
				{{$t('index.signup')}}
			</view>
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
					<uni-forms-item  name="username">
						<uni-easyinput type="text" v-model="formData.username" :placeholder="$t('register.form.username')" />
					</uni-forms-item>
					<uni-forms-item  name="password">
						<uni-easyinput type="password" v-model="formData.password" :placeholder="$t('register.form.pwd')" />
					</uni-forms-item>
					<uni-forms-item name="twoPassword">
						<uni-easyinput type="password" v-model="formData.twoPassword" :placeholder="$t('register.form.pwd.again')" />
					</uni-forms-item>
					<uni-forms-item name="invitationCode">
						<uni-easyinput type="text" v-model="formData.invitationCode" :placeholder="$t('register.form.inviteCode')" />
					</uni-forms-item>
					<uni-forms-item  name="email">
						<uni-easyinput type="text" v-model="formData.email" :placeholder="$t('register.form.email')" />
					</uni-forms-item>
					<uni-forms-item  name="emailCode" v-if="mailCodeRequired==0">
						<uni-easyinput type="text" v-model="formData.emailCode" :placeholder="$t('register.form.emailCode')" >
							<template #right>
								<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendBtn')}}</view>
								<view v-else class="sendCode"> {{countTime}} s</view>
							</template>
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="phone">
						<uni-easyinput type="text" v-model="formData.phone" :placeholder="$t('register.form.phone')" >
							<template #left>
								<view class="areacode-sel">
									<uni-data-select placeholder="Choose" v-model="formData.areaCode" :localdata="codeList" @change="areaCodeChange" :clear="false"></uni-data-select>
								</view>
							</template>
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="code">
						<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('register.form.code')" >
							<template #right>
								<image :src="vercodeImg" class="code-img" mode="scaleToFill" @click="getCodeData"></image>
							</template>
						</uni-easyinput>
					</uni-forms-item>
				</uni-forms>
				<button class="btn" @click="submit">{{$t('btn.ok.text')}}</button>
			</view>
			<view class="link">
				<view class="link-item top" @click="goLogin">{{$t('index.signin')}}</view>
				<view class="link-item" @click="goService">{{$t('index.service')}}</view>
				<view class="link-item" @click="download">{{$t('index.appdown')}}</view>
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
					username:'',
					password :'',
					twoPassword :'',
					invitationCode:'',
					verifyKey:'',
					email :'',
					emailCode :'',
					code:'',
					phone:'',
					areaCode:''
				},
				rules: {
					username: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.username')})}
						]
					},
					 password: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.pwd')})}
					 	]
					 },
					 twoPassword: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.pwd.again')})},
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
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.inviteCode')})}
					 	]
					 },
					email: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.email')})},
							{format: 'email',errorMessage: this.$t('ruls.email')},
						]
					},
					emailCode: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.emailCode')})}
						]
					},
					phone: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.phone')})}
						]
					},
					code: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.code')})}
						]
					}
				},
				isSendCode:false,
				countTime:60,
				invitation_code:1,
				mailCodeRequired:0,
				vercodeImg:'',
				verifyKey:'',
				osType:'',
				downObj:{},
				codeList:[]
			}
		},
		onLoad() {
			this.getSysConfig()
			this.getCodeData()
			this.getOsType()
		},
		methods: { 
			areaCodeChange(value){
				console.log(value)
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
						this.mailCodeRequired = res.data.mailCodeRequired || 0
						let codeList = res.data.area_code || []
						this.codeList = codeList.map(item=>{
							return {
								value:item,
								text:'+' + item
							}
						})
						if(codeList.length > 0){
							this.formData.areaCode = this.codeList[0].value
						}
					}
				}))
			},
			sendCode(){
				if(!this.formData.email){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('register.form.email')}),
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
			},
			goService(){
				this.$http.get('/player/home/serv',{},res=>{
					if(res.code==200){
						 window.location.href = res.data.serviceAddr
					}
				})
			},
			download(){
				this.$http.get('/player/home/app_url',res=>{
					res = res.data
					res.forEach(item => {
						if(item.appType==this.osType){
							this.downObj = item
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
			}
			
		}
	}
</script>

<style lang="scss" scoped>
.register{
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
			margin-top: 80upx;
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
			::v-deep .uni-select__input-text{
				color: #c1a374!important;
			}
			::v-deep .uni-icons{
				color: #c1a374!important;
			}
			.areacode-sel{
				width: 150upx;
			}
			.sendCode{
				padding: 3px 19px 2px 18px;
				border-radius: 3px;
				border: solid 0.7px #a5a5a5;
				margin-right: 20upx;
			}
			.code-img{
				width: 150upx;
				height: 60upx;
			}
			.btn{
				width: 342upx;
				height: 82upx;
				line-height: 82upx;
				background-image: url('../../static/images/index/okbtn.webp');
				background-size: 100%;
				color:#93643a;
				font-size: 26upx;
				font-weight: bold;
				font-style: normal;
				letter-spacing: 4upx;
			}
		}
		.link{
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			margin-top: 60upx;
			width: 620upx;
			.link-item{
				font-size: 20upx;
				color: #c1a374;
				font-weight: bold;
			    line-height: 2.8;
				letter-spacing: 1px;
			}
			.top{
				font-size: 26upx;
				font-weight: bold;
				line-height: 1.15;
				letter-spacing: 1.95px;
				color: #93643a;
				margin-bottom: 20upx;
			}
		}
	}
}
</style>
