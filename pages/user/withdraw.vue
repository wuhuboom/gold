<template>
	<view class="withdraw">
		 <view class="page-title">
			 <view class="back" @click="goBack">
			 	<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
		 	{{$t('page.withdraw.title')}}
		 </view>
		 <view class="user-balance">
			 <view class="balance-header">
				<view>{{$t('home.balance.text')}}</view>
				<view class="history" @click="showHistory">
					<image src="../../static/images/wallet/Path 121.webp" mode="aspectFill"></image>
					<view class="history-text">{{$t('withdraw.history.text')}}</view>
				</view>
			 </view>
			 <view class="balance-num">{{getAmount(user.balance || 0)}}</view>
		 </view>
		 <view class="form">
			 <uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
			 	<uni-forms-item :label="$t('withdraw.form.methodtype')"  name="type">
			 		<view class="type-select">
						<uni-data-select v-model="payWayType" :localdata="payways" :clear="false" @change="changeWay"></uni-data-select>
						<view  class="bindBtn" v-if="curWalletList.length == 0" @click="addWalletPage"> {{$t('withdraw.form.bind')}}</view>
					</view>
			 	</uni-forms-item>
				<uni-forms-item :label="$t('withdraw.form.address')"  name="walletListIndex" v-if="curWalletList.length > 0">
					<view class="type-select">
						<uni-data-select v-model="walletListIndex" :localdata="curWalletList" :clear="false"></uni-data-select>
					</view>
				</uni-forms-item>
				<uni-forms-item :label="$t('withdraw.form.enteramount')"  name="money">
					<uni-easyinput type="text" v-model="formData.money" :clearable="false">
						<template #right>
							<view class="input-right">{{sectItem.currencySymbol}}</view>
						</template>
					</uni-easyinput>
					<view class="form-input-tips">
						{{$t('withdraw.form.limit')}}:{{sectItem.withdrawMin}}-{{sectItem.withdrawMax}}
					</view>
				</uni-forms-item>
			 	<uni-forms-item :label="$t('withdraw.form.actualmount')" name="actualmount">
			 		<uni-easyinput type="text" v-model="formData.actualmount" :disabled="true">
						<template #right>
							<view class="input-right">{{sectItem.currencySymbol}}</view>
						</template>
					</uni-easyinput>
					<view class="form-input-tips">
						{{$t('withdraw.form.exchangeRate')}}:{{sectItem.rate}}
					</view>
			 	</uni-forms-item>
			 	<uni-forms-item :label="$t('forget.select.tips')" name="vertifyType" v-if="formData.vertifyType==3">
			 		<view class="type-select">
			 			<uni-data-select v-model="vertifyTypeIndex" :localdata="vertifyTypes" :clear="false"></uni-data-select>
			 		</view>
			 	</uni-forms-item>
			 	<uni-forms-item :label="vertifyTypeIndex==0 ? $t('forget.emailVerifiCode'):$t('forget.phoneVerifiCode')"  name="code" v-if="formData.vertifyType > 0">
			 		<uni-easyinput type="text" v-model="formData.code"  >
			 			<template #right>
			 				<view v-if="!isSendCode" @click="sendCode" class="sendCode">{{$t('register.sendBtn')}}</view>
			 				<view v-else class="sendCode"> {{countTime}} s</view>
			 			</template>
			 		</uni-easyinput>
			 	</uni-forms-item>
				<uni-forms-item :label="$t('withdraw.form.paypassword')" name="payPwd">
					<uni-easyinput type="password" v-model="formData.payPwd" />
				</uni-forms-item>
			 </uni-forms>
			 <button class="btn" @click="submitPre">{{$t('page.withdraw.title')}}</button>
		 </view>
		<popup-dialog ref="tipDialog" :title="$t('withdraw.success.title.text')" :content="$t('withdraw.success.content.text')" @confirm="closeTip"></popup-dialog>
		<popup-dialog ref="vipClearDialog"  :content="$t('withdraw.clearvip.tip.text')" @confirm="submit" :show-cancel="true"></popup-dialog>
		<popup-dialog ref="vipCountDialog"  :content="$t('withdraw.vipcount.tip.text',{level:user.vipLevel,count:wiClearVipCount})" @confirm="submit" :show-cancel="true"></popup-dialog>
		<popup-dialog ref="riskDialog" :title="$t('withdraw.risk.warning')" :content="$t('withdraw.risk.content')" @confirm="jumpIdcard"></popup-dialog>
	</view>
</template>

<script>
	import PopupDialog from '@/components/popup-dialog.vue'
	import {getAmount} from '@/utils/util.js'
	export default {
		components:{
			PopupDialog
		},
		data() {
			return {
				getAmount:getAmount,
				fromType:'',
				user:{},
				formData:{
					money:'',
					type:'',
					payPwd:'',
					usdtId:'',
					code:'',
					deviceUa:navigator.userAgent,
					vertifyType:'' ,// 0不验证1手机2邮件3两者
					actualmount:''
				},
				rules: {
					money: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('withdraw.form.enteramount')})}
						]
					},
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('withdraw.form.paypassword')})}
						]
					}
				}, 
				payways:[],
				sectItem:{},
				vertifyTypes:[
					{value:0,text:this.$t('forget.emailVerifiCode')},
					{value:1,text:this.$t('forget.phoneVerifiCode')}
				],
				isSendCode:false,
				countTime:60,
				bankList:[],
				usdtList:[],
				walletList:[],
				curWalletList:[],
				walletListIndex:-1,
				payWayType:2,
				vertifyTypeIndex:0,
				isBind:false,
				wiClearVipCount:0,
				riskCode:'3',
				submitted:''
			}
		},
		onLoad(option) {
			this.fromType = option.type
			this.$store.dispatch('getUserInfo')
			this.user = uni.getStorageSync('accountInfo')
			this.loadPayWays()
			if(this.payWayType==1){
				this.getBankList()
			}else if(this.payWayType==2){
				this.getUsdtList()
			}else if(this.payWayType==4){
				this.getWalletList()
			}
		},
		watch:{
			'formData.money':{
				handler(val){
					if(val){
						this.formData.actualmount = val * this.sectItem.rate
					}
				}
			}
		},
		methods: {
			jumpIdcard(){
				 if (this.riskCode == 2) {
					// this.routingJump('pages/wallet/uploadIdCard')
				} else if (this.riskCode == 3 || this.riskCode === 4) {
					this.initFaceRecognition()
				}
			},
			async initFaceRecognition() {
			    // 在调用服务端初始化请求时需要传入该MetaInfo值
			    var MetaInfo = window.getMetaInfo();
			
			    let data = {
			        info: JSON.stringify(MetaInfo),
			        returnUrl: location.href
			    }
			    try {
			        let reqUrl = '/player/risk/secure3'
			        const res = await http.post(reqUrl,data)
					
			        let url  = res.url
			        // 接下来您进行调用服务端初始化请求获取TransactionUrl
			        var TransactionUrl = url; // 此处值应为调用服务端初始化接口返回的TransactionUrl
			        // 接下来直接跳转TransactionUrl即可开始服务
			        window.location.href = TransactionUrl;
			    } catch (error) {
			        console.log(error);
			    }
			},
			showHistory(){
				uni.navigateTo({
					url:'/pages/user/withdrawLog'
				})
			},
			submitPre(){
				this.$refs.form.validate().then(res=>{
					let item = this.curWalletList[this.walletListIndex] || {}
					this.wiClearVipCount = item.wiClearVipCount
					if(this.wiClearVipCount > 0){
						this.wiClearVipCount = this.wiClearVipCount - 1
						this.$refs.vipCountDialog.open()
					}else{
						if(item.wiClearVip==0){
							this.submit()
						}else{
							this.$refs.vipClearDialog.open()
							// this.$refs.riskDialog.open()
						}
					}
				})
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = {
						type: this.sectItem.type,
						usdtId: this.curWalletList[this.walletListIndex].id,
						money: this.formData.money,
						payPwd: this.formData.payPwd,
						code:this.formData.code,
						deviceUa:navigator.userAgent
					}
					this.$http.post('/player/withdrawal',para,(res=>{
						if(res.code ==200){
							this.formData.money = ''
							this.formData.payPwd = ''
							this.formData.code = ''
							this.$refs.tipDialog.open()
						}else if(res.code ==103){
							res = res.data[0]
							 if(res.msgKey == 'withdrawalRisk'){
								this.riskCode = res.data
								this.submitted = res.submitted
								if(this.submitted === 1){
									uni.showToast({
									    title: this.$t("withdraw.risk.waitAudit"),
									    icon: 'none',
									    duration: 5000,
									});
									return
								}else{
									let riskStatus = [2, 3, 4]
									if (riskStatus.includes(this.riskCode)) {
										this.$refs.riskDialog.open()
									}
									return
								}
							}else{
								uni.showToast({
								    title: res.withdrawalLimitMsg,
								    icon: 'none',
								    duration: 5000,
								});
								return
							}
						}else{
							this.isSendCode = false
						}
					}))
				}).catch(err =>{
					console.log( err);
				})
			},
			changeWay(val){
				this.payWayType = val
				
				this.sectItem = this.payways.find(item=>{
					return item.type===val
				})
				 this.curWalletList = []
				let type = this.sectItem.type
				 if(type==1){
					 this.getBankList()
				 }else if(type==2){
					 this.getUsdtList()
				 }else if(type==4){
					 this.getWalletList()
				 }
			},
			addWalletPage(){
				let path = ''
				let type = this.sectItem.type
				if(type==1){
					path="./addBankCard"		 
				}else if(type==2){
					path="./addUsdtAddress"				 
				}else if(type==4){
					path="./addWallet"
				}
				uni.navigateTo({
					url:path
				})
			},
			goBack(){
				let path = ""
				if(this.fromType=='home'){
					path = '/pages/home/home'
				}else{
					path = '/pages/user/user'
				}
				uni.switchTab({
					url: path
				})
			},
			
			loadPayWays(){
				this.$http.get('/player/withdrawal_pre',res => {
					if(res.code==200){
						let ways = res.data || []
						this.payways = ways.map(item=>{
							item.text = item.name.toUpperCase()
							item.value = item.type
							return item
						})
						
						this.sectItem = this.payways.find(item=>{
							return item.type=== this.payWayType
						})
						this.formData.vertifyType = this.sectItem.codeMode || 0
						if(this.formData.vertifyType==1){
							this.vertifyTypeIndex = 1
						}else if(this.formData.vertifyType==2){
							this.vertifyTypeIndex = 0
						}
					}
					
				})
			},
			formatCurrWalletList(){
				this.curWalletList = this.curWalletList.map((item,index)=>{
					item.value = index
					item.text = item.addr
					return item
				})
				if(this.curWalletList.length > 0){
					this.walletListIndex = 0
				}
			},
			getBankList(){
				this.bankList = []
				let url = '/player/bank_card_info'
				this.$http.get(url,res=>{
					 if(res.code==200){
						 res = res.data
						 if (Array.isArray(res)) {
							 res.forEach(item => {
								 item.addr = this.maskString(item.cardNumber)
							 })
							 this.bankList = res
						 } else if (typeof res === 'object' && res !== null) {
							 this.bankList = []
							 res.addr = this.maskString(res.cardNumber)
							 this.bankList.push(res)
						 }
						 this.curWalletList = this.bankList 
						 this.formatCurrWalletList()
					 }
				})
			},
			getUsdtList(){
				this.usdtList = []
				 let url = '/player/virtual_currency_list'
				 this.$http.post(url,{},res=>{
					 if(res.code==200){
						 let datas = res.data || []
						 datas.forEach(item => {
							item.addr = item.addr.slice(0, 4) + '****' + item.addr.slice(-4)
						})
						this.usdtList = datas || []
						this.curWalletList = this.usdtList
						this.formatCurrWalletList()
					 }
				 })
			},
			getWalletList(){
				this.walletList = []
				let url = '/player/wallet_info'
				this.$http.get(url,res=>{
					 if(res.code==200){
						 res = res.data
						res.forEach(item => {
							 item.addr = item.address
						})
						this.walletList = res
						this.curWalletList = this.bankList
						this.formatCurrWalletList()
					 }
				})
			},
			maskString(str) {
			    if (str.length <= 4) {
			        return str;
			    }
			    const maskedPart = '*'.repeat(str.length - 4);
			    const visiblePart = str.slice(-4);
			    return maskedPart + visiblePart;
			},
			sendCode(){
				
				if(this.vertifyTypeIndex==0){
					this.getEmailCode()
				}else if(this.vertifyTypeIndex==1){
					this.getPhoneCode()
				}
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
			closeTip(){//关闭提示弹窗
				
			}
		}
	}
</script>

<style scoped lang="scss">
.withdraw{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.user-balance{
		margin-top: 40upx;
		.balance-header{
			font-size: 24upx;
		   font-weight: bold;
		  line-height: 2;
		  letter-spacing: 1px;
		  text-align: center;
		  color: #c1a374;
		  position: relative;
		  .history{
			  position: absolute;
			  top: 3upx;
			  right: -90upx;
			  display: flex;
			  align-items: center;
			  image{
				  width: 27upx;
				  height: 22upx;
				  margin-left: 20upx;
			  }
			  .history-text{
				  margin-left: 10upx;
				  font-size: 20upx;
				  font-weight: bold;
				  line-height: 2;
				  letter-spacing: 1px;
				  color: #82502b;
			  }
		  }
		}
		.balance-num{
		  width: 260upx;
		  height: 70upx;
		  line-height: 70upx;
		  background-color: #c9ac7f;
		   font-size: 30upx;
		    font-weight: bold;
		    letter-spacing: 0.65px;
		    text-align: center;
		    color: #fff;
		}
	}
	.form{
		width: 580upx;
		margin-top: 100upx;
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
			 width: 100%!important;
			 display: flex;
			 justify-content: center!important;
			   font-size: 24upx;
			   font-weight: bold;
			   letter-spacing: 1px;
			   color: #c1a374;
			   padding-bottom: 0upx!important;
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
		.form-input-tips{
			width: 100%;
			text-align: center;
			font-size: 24upx;
			font-weight: bold;
			letter-spacing: 0.8px;
			color: #c1a374;
		}
		.input-right{
			background-color: #484a53;
			 width: 100upx;
			 height: 70upx;
			 line-height: 70upx;
			 text-align: center;
			 font-size: 24upx;
			 font-weight: bold;
			 letter-spacing: 0.8px;
			 color: #fff;
		}
		.type-select{
			border: solid 1px #a5a5a5!important;
			display: flex;
			align-items: center;
			::v-deep .uni-select__selector-item{
				color: #c1a374!important;
				font-weight: bold;
				font-size: 26upx;
				letter-spacing: 1px;
			}
			.bindBtn{
				padding: 3px 19px 2px 18px;
				border-radius: 3px;
				border: solid 0.7px #a5a5a5;
				margin-right: 20upx;
				 font-size: 24upx;
			  font-weight: bold;
			  letter-spacing: 1px;
			  color: #93643a;
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
</style>
