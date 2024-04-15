<template>
	<view class="update-email">
		<uni-nav-bar left-icon="left"  :title="$t('security.update.fundpwd.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" :label-width="300">
				<uni-forms-item :label="$t('security.update.fundpwd.label')" name="newpwd">
					<uni-easyinput type="password" prefixIcon="locked" v-model="formData.newpwd " :placeholder="$t('ruls.xxx.please',{name:$t('security.update.fundpwd.label')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('security.update.fundpwd.confirm.label')" name="confirmed">
					<uni-easyinput type="password" prefixIcon="locked" v-model="formData.confirmed  " :placeholder="$t('ruls.xxx.please',{name:$t('security.update.fundpwd.confirm.label')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.code.text')" name="code">
					<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('ruls.xxx.please',{name:$t('register.code.text')})" >
						<template #right>
								<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendCode.text')}}</view>
								<view v-else class="sendCode"> {{countTime}} s</view>
							</template>
					</uni-easyinput>
				</uni-forms-item>
			</uni-forms>
			<button class="btn" @click="submit">{{$t('btn.change.confirm.text')}}</button>
			<view class="cancelBtn" @click="goBack">{{$t('btn.caancle.text')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					newpwd  :'',
					confirmed   :'',
					code :'',
				},
				rules: {
					 code: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.code.text')})}
					 	]
					 },
					newpwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.fundpwd.label')})}
						]
					},
					confirmed: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.fundpwd.confirm.label')})},
							{
								validateFunction:(rule,value,data,callback)=>{
									if (value != this.formData.newpwd ) {
										callback(this.$t('ruls.confirmed'))
									}
									return true
								}
							}
						]
					}
				},
				isSendCode:false,
				countTime:60,
				type:''
			}
		},
		onLoad(option) {
			console.log(option)
			this.type = option.type
		},
		methods: {
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/editPwdPay',para,(res=>{
						if(res.code ==200){
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
								icon:'none',
								success() {
									uni.navigateTo({
										url:'/pages/user/security'
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
				 
				this.$http.get('/player/mail/code',(res)=>{
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
			goBack(){
				if(this.type=='home'){
					uni.switchTab({
						url:'/pages/home/home'
					})
				}else{
					uni.navigateTo({
						url:'./security'
					})
				}
				
			}
		}
	}
</script>

<style scoped lang="scss">
.update-email{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
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
		.cancelBtn{
			margin-top: 40upx;
			color: $fontColor;
			text-align: center;
		}
	}
	
}
</style>
