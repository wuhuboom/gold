<template>
	<view class="addbankcard">
		<view class="content">
			<view class="title">
				<view class="back" @click="goBack">
					<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
				</view>
				{{$t('page.addcard.title')}}
			</view>
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
					<uni-forms-item  name="bankId">
						<view class="type-select">
						<uni-data-select  v-model="formData.bankId" :placeholder="$t('card.form.bankid')" :localdata="bankList" :clear="false"></uni-data-select>
						</view>
					</uni-forms-item>
					<uni-forms-item  name="state">
						<uni-easyinput type="text" v-model="formData.state" :placeholder="$t('card.form.state')" />
					</uni-forms-item>
					<uni-forms-item  name="city">
						<uni-easyinput type="text" v-model="formData.city" :placeholder="$t('card.form.city')" />
					</uni-forms-item>
					<uni-forms-item  name="subBranch">
						<uni-easyinput type="text" v-model="formData.subBranch" :placeholder="$t('card.form.subbranch')" />
					</uni-forms-item>
					<uni-forms-item  name="cardName">
						<uni-easyinput type="text" v-model="formData.cardName" :placeholder="$t('card.form.holderName')" />
					</uni-forms-item>
					<uni-forms-item  name="cardNumber">
						<uni-easyinput type="text" v-model="formData.cardNumber" :placeholder="$t('card.form.bankNum')" />
					</uni-forms-item>
					<uni-forms-item name="cardNumberTwice">
						<uni-easyinput type="text" v-model="formData.cardNumberTwice" :placeholder="$t('card.form.confirmNum')" />
					</uni-forms-item>
					<uni-forms-item name="vertifyType">
						<view class="type-select">
							<uni-data-select v-model="formData.vertifyType" :localdata="vertifyTypes" :clear="false"></uni-data-select>
						</view>
					</uni-forms-item>
					<uni-forms-item  name="code" >
						<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('register.form.code')" >
							<template #right>
								<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendBtn')}}</view>
								<view v-else class="sendCode"> {{countTime}} s</view>
							</template>
						</uni-easyinput>
					</uni-forms-item>
					<uni-forms-item name="payPwd">
						<uni-easyinput type="password" v-model="formData.payPwd" :placeholder="$t('withdraw.form.paypassword')"/>
					</uni-forms-item>
				</uni-forms>
				<button class="btn" @click="submit">{{$t('btn.update.text')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {checkBankName} from '@/utils/util.js'
	export default {
		components:{ 
		},
		data() {
			return {
				formData:{
					bankId:'',
					subBranch :'',
					cardName :'',
					cardNumber :'',
					cardNumberTwice:'',
					code:'',
					payPwd:'',
					vertifyType:0
				},
				rules: {
					bankId: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('card.form.bankid')})}
						]
					},
					subBranch: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('card.form.subbranch')})},
						]
					},
					cardName: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('card.form.holderName')})},
							{
								validateFunction:(rule,value,data,callback)=>{
									if (!checkBankName(value)) {
										callback(this.$t('card.form.name.check.text'))
									}else{
										callback()
									}
								}
							}
						]
					},
					 cardNumber: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('card.form.bankNum')})}
					 	]
					 },
					 cardNumberTwice: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('card.form.confirmNum')})},
							{
								validateFunction:(rule,value,data,callback)=>{
									if (value != this.formData.cardNumber) {
										callback(this.$t('backapi.cardNumberTwiceDiff'))
									}else{
										callback()
									}
								}
							}
					 	]
					 },
					code: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('register.form.code')})}
						]
					},
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('withdraw.form.paypassword')})}
						]
					}
				},
				isSendCode:false,
				countTime:60,
				vertifyTypes:[
					{value:0,text:this.$t('forget.emailVerifiCode')},
					{value:1,text:this.$t('forget.phoneVerifiCode')}
				],
				bankList:[]
			}
		},
		onLoad() {
			 this.getBankList()
		},
		methods: {
			changeType(value){
				
			},
			getBankList(){
				this.bankList = []
				let url = '/player/banks'
				this.$http.get(url,res=>{
					if(res.code==200){
						let datas = res.data.banks || []
						this.bankList = datas.map(item=>{
							item.text=item.bankCname
							item.value=item.id
							return item;
						})
						if(this.bankList.length > 0){
							this.formData.bankId = this.bankList[0].id
						}
					}
				})
			},
			goBack(){
				uni.navigateTo({
					url:'/pages/user/withdraw'
				})
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/bind_bank_card',para,(res=>{
						if(res.code ==200){
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
								duration:2000,
								success() {
									setTimeout(this.goBack,2000)
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
				let url = '/player/mail/code'
				this.$http.get(url,res=>{
					if(res.code==200){
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
				let url = "/player/v2/phone_code/online"
				this.$http.post(url,{},res=>{
					if(res.code==200){
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
.addbankcard{
	width: 750upx;
	height: 100vh;
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
	}
}
</style>
