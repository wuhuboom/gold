<template>
	<view class="address-add">
		<uni-nav-bar left-icon="left"  :title="$t('withdraw.payway.addressEdit.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="form">
			<view class="add-form-title">
				<view class="left">{{$t('withdraw.payway.addressAdd.text')}}</view>
			</view>
			<uni-forms ref="addForm" :modelValue="addFormData" :rules="addRules" label-position="top" :label-width="300">
				<uni-forms-item :label="$t('backapi.self.whitdraw.type.ewallet.form.wallet.addr.text')" name="addr">
					<uni-easyinput type="text " prefixIcon="wallet" v-model="addFormData.addr" :placeholder="$t('backapi.self.whitdraw.type.ewallet.form.wallet.addr.text')" />
				</uni-forms-item>
				<uni-forms-item :label="$t('security.update.fundpwd.label')" name="payPwd">
					<uni-easyinput type="password" prefixIcon="locked" v-model="addFormData.payPwd" :placeholder="$t('ruls.xxx.please',{name:$t('security.update.fundpwd.label')})" />
				</uni-forms-item>
				<uni-forms-item :label="$t('register.code.text')" name="code">
					<uni-easyinput type="text" v-model="addFormData.code" :placeholder="$t('ruls.xxx.please',{name:$t('register.code.text')})" >
						<template #right>
							<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendCode.text')}}</view>
							<view v-else class="sendCode"> {{countTime}} s</view>
						</template>
					</uni-easyinput>
				</uni-forms-item>
			</uni-forms>
			<button class="btn" @click="submitAdd">{{$t('btn.save.text')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addFormData:{
					id:'',
					type:'usdt',
					subType:'1',
					addr:'',
					payPwd:'',
					code:''
				},
				addRules: {
					addr: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('backapi.self.whitdraw.type.ewallet.form.wallet.addr.text')})}
						]
					},
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.fundpwd.label')})}
						]
					},
					code: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.code.text')})}
						]
					}
				},
				isSendCode:false,
				countTime:60
			}
		},
		onLoad(option) {
			this.addFormData.id = option.id
			this.addFormData.addr = option.addr
		},
		methods: {
			submitAdd(){
				this.$refs.addForm.validate().then(res=>{
					const para = Object.assign({},this.addFormData)
					this.$http.post('/player/virtual_currency_edit',para,(res=>{
						if(res.code ==200){
							 uni.showToast({
							 	title:this.$t('oper.tip.success.text'),
								icon:'success',
								duration:2000,
								success() {
									uni.navigateTo({
										url:'./addressManage'
									})
								}
							 })
						}
					}))
				}).catch(err =>{
					console.log(err);
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
				uni.navigateTo({
					url:'./addressManage'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.address-add{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.form{
		width: 670upx;
		margin-top: 20upx;
		::v-deep .uni-forms-item__label{
			color: #fff;
		}
		::v-deep .uni-easyinput__content{
			background-color: rgb(41,41,55)!important;
			border-color: rgb(41,41,55)!important;
			color: rgb(255,255,255)!important;
		}
		::v-deep .uni-icons{
			color: $fontColor!important;
		}
		.choose-usdt-box{
			position: relative;
			background-color: rgb(41,41,55);
			.choose-usdt-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10upx 20upx;
				.left{
					display: flex;
					align-items: center;
					color: #fff;
					image{
						width: 60upx;
						height: 60upx;
						margin-right: 20upx;
					}
				}
			}
			.choose-usdt-select{
				position: absolute;
				background-color: rgb(41,41,55);
				z-index: 99;
				width: 670upx;
				.choose-usdt-item{
					display: flex;
					align-items: center;
					color: #fff;
					image{
						width: 60upx;
						height: 60upx;
					}
				}
			}
		}
		.btn{
			background-color: $fontColor;
			color: #fff;
		}
		.sendCode{
			color: $fontColor;
			padding-right: 20upx;
		}
	}
}
</style>
