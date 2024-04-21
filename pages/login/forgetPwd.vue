<template>
	<view class="forgetPwd">
		<view class="content">
			<view class="title">
				<view class="back" @click="goBack">
					<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
				</view>
				{{$t('index.forgetPwd')}}
			</view>
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
					<uni-forms-item  name="username">
						<uni-easyinput type="text" v-model="formData.username" :placeholder="$t('register.form.username')" />
					</uni-forms-item>
					<uni-forms-item  name="newPwd">
						<uni-easyinput type="password" v-model="formData.newPwd" :placeholder="$t('register.form.pwd')" />
					</uni-forms-item>
					<uni-forms-item name="twicePwd">
						<uni-easyinput type="password" v-model="formData.twicePwd" :placeholder="$t('register.form.pwd.again')" />
					</uni-forms-item>
					<uni-forms-item name="vertifyType">
						<view class="select-tips">{{$t('forget.select.tips')}}</view>
						<view class="type-select">
							<uni-data-select v-model="formData.vertifyType" :localdata="vertifyTypes" :clear="false"></uni-data-select>
						</view>
					</uni-forms-item>
					<uni-forms-item  name="email" v-if="formData.vertifyType==0">
						<uni-easyinput type="text" v-model="formData.email" :placeholder="$t('register.form.email')" />
					</uni-forms-item>
					<uni-forms-item name="phone" v-if="formData.vertifyType==1">
						<uni-easyinput type="text" v-model="formData.phone" :placeholder="$t('register.form.phone')" >
							<template #left>
								<view class="areacode-sel">
									<uni-data-select placeholder="Choose" v-model="formData.areaCode" :localdata="codeList" @change="areaCodeChange" :clear="false"></uni-data-select>
								</view>
							</template>
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item  name="code" >
						<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('register.form.code')" >
							<template #right>
								<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendBtn')}}</view>
								<view v-else class="sendCode"> {{countTime}} s</view>
							</template>
						</uni-easyinput>
					</uni-forms-item>
				</uni-forms>
				<button class="btn" @click="submit">{{$t('btn.update.text')}}</button>
			</view>
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
					newPwd :'',
					twicePwd :'',
					email :'',
					code:'',
					phone:'',
					areaCode:'',
					vertifyType:0
				},
				rules: {
					username: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.username')})}
						]
					},
					 newPwd: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.pwd')})}
					 	]
					 },
					 twicePwd: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.pwd.again')})},
							{
								validateFunction:(rule,value,data,callback)=>{
									if (value != this.formData.newPwd) {
										callback(this.$t('ruls.twicePwd'))
									}
									return true
								}
							}
					 	]
					 },
					email: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.email')})},
							{format: 'email',errorMessage: this.$t('ruls.email')},
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
				codeList:[],
				vertifyTypes:[
					{value:0,text:this.$t('forget.emailVerifiCode')},
					{value:1,text:this.$t('forget.phoneVerifiCode')}
				]
			}
		},
		onLoad() {
			this.getSysConfig()
		},
		methods: {
			changeType(value){
				
			},
			goBack(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/mail/change_pwd_online',para,(res=>{
						if(res.code ==200){
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
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
			sendCode(){
				if(this.formData.vertifyType==0){
					this.getEmailCode()
				}else{
					this.getPhoneCode()
				}
			},
			
			getEmailCode(){
				if(!this.formData.username){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('register.form.username')}),
						duration: 3000
					})
					return 
				}
				if(!this.formData.email){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('register.form.email')}),
						duration: 3000
					})
					return 
				}
				this.isSendCode = true
				this.startCount()
				let para = {
					username:this.formData.username,
					email : this.formData.email
				}
				this.$http.post('/player/mail/change_pwd', para,(res)=>{
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
			getPhoneCode(){
				if(!this.formData.username){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('register.form.username')}),
						duration: 3000
					})
					return 
				}
				if(!this.formData.phone){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('register.form.phone')}),
						duration: 3000
					})
					return 
				}
				let para = {
					username:this.formData.username,
					phone : this.formData.areaCode+this.formData.phone
				}
				this.$http.post('/player/v2/phone_code/change_pwd', para,(res)=>{
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
			getSysConfig(){
				this.$http.get('/player/auth/sys_config',(res=>{
					if(res.code == 200){
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
			}
		}
	}
</script>

<style lang="scss" scoped>
.forgetPwd{
	width: 750upx;
	height: 100vh;
	background-image: url('../../static/images/login/bg.webp');
	background-repeat: no-repeat;
	background-size: 100%;
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
			position: relative;
			width: 100%;
			text-align: center;
			.back{
				position: absolute;
				top:-8upx
			}
		}
		.form{
			width: 580upx;
			margin-top: 150upx;
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
				font-weight: bold;
				font-size: 26upx;
			}
			::v-deep .uni-icons{
				color: #c1a374!important;
			}
			::v-deep .uni-select__selector{
				background-color: #dde0e8;
			}
			::v-deep .uni-popper__arrow::after{
				border-bottom-color: #dde0e8!important;
			}
			.select-tips{
			  font-size: 26upx;
			  font-weight: bold;
			  line-height: 1.1;
			  letter-spacing: 1px;
			  color: #c1a374;
			  margin-bottom: 10upx;
			}
			.type-select{
				border: solid 1px #a5a5a5!important;
				::v-deep .uni-select__selector-item{
					color: #c1a374!important;
					font-weight: bold;
					font-size: 26upx;
					letter-spacing: 1px;
				}
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
				background-color: transparent;
				color:#93643a;
				font-size: 26upx;
				font-weight: bold;
				font-style: normal;
				letter-spacing: 4upx;
				margin-top: 100upx;
			}
		}
		.link{
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			margin-top: 80upx;
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
