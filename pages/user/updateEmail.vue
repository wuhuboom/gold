<template>
	<view class="update-email">
		<uni-nav-bar left-icon="left"  :title="$t('security.update.email.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
				<uni-forms-item :label="$t('security.update.oldemail.text')" name="oldEmail">
					<uni-easyinput type="text" prefixIcon="email" v-model="formData.oldEmail" :placeholder="$t('ruls.xxx.please',{name:$t('security.update.oldemail.text')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.code.text')" name="code">
					<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('ruls.xxx.please',{name:$t('register.code.text')})" >
						<template #right>
								<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendCode.text')}}</view>
								<view v-else class="sendCode"> {{countTime}} s</view>
							</template>
					</uni-easyinput>
				</uni-forms-item>
				<uni-forms-item :label="$t('security.update.newemail.text')" name="email">
					<uni-easyinput type="text" prefixIcon="email" v-model="formData.email" :placeholder="$t('ruls.xxx.please',{name:$t('security.update.newemail.text')})" />
				</uni-forms-item>
			</uni-forms>
			<button class="btn" @click="submit">{{$t('register.confirm.text')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					oldEmail:'',
					code :'',
					email :''
				},
				rules: {
					 code: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.code.text')})}
					 	]
					 },
					oldEmail: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.oldemail.text')})},
							{format: 'email',errorMessage: this.$t('ruls.email')},
						]
					},
					email: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.newemail.text')})},
							{format: 'email',errorMessage: this.$t('ruls.email')},
						]
					}
				},
				isSendCode:false,
				countTime:60
			}
		},
		onLoad() {
			const user = uni.getStorageSync('user')
			this.formData.oldEmail = user.email
		},
		methods: {
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/mail/bind',para,(res=>{
						if(res.code ==200){
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
								icon:'none',
								success() {
									uni.switchTab({
										url:'/pages/user/user'
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
				if(!this.formData.oldEmail){
					uni.showToast({
						title: this.$t('ruls.xxx.empty',{name:this.$t('security.update.oldemail.text')}),
						icon:'none',
						duration: 3000
					})
					return 
				}
				let para = {
					email : this.formData.oldEmail
				}
				this.$http.post('/player/mail/code', para,(res)=>{
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
				uni.navigateTo({
					url:'./security'
				})
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
	}
	
}
</style>
