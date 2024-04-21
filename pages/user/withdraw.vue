<template>
	<view class="withdraw">
		 <view class="page-title">
			 <view class="back" @click="goBack">
			 	<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
		 	{{$t('page.withdraw.title')}}
		 </view>
		 <view class="user-balance">
			 <view class="balance-header">{{$t('home.balance.text')}}</view>
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
						{{$t('withdraw.form.limit')}}:{{getAmount(user.balance)}}
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
			 			<uni-data-select v-model="formData.vertifyType" :localdata="vertifyTypes" :clear="false"></uni-data-select>
			 		</view>
			 	</uni-forms-item>
			 	<uni-forms-item :label="$t('register.form.code')"  name="code" >
			 		<uni-easyinput type="text" v-model="formData.code" :placeholder="$t('register.form.code')" >
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
			 <button class="btn" @click="submit">{{$t('page.withdraw.title')}}</button>
		 </view>
	</view>
</template>

<script>
	import {getAmount} from '@/utils/util.js'
	export default {
		data() {
			return {
				getAmount:getAmount,
				fromType:'',
				user:{},
				formData:{
					money:0,
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
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('recharge.money.text')})}
						]
					},
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('withdraw.password.text')})}
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
				bankList:[],
				usdtList:[],
				walletList:[],
				curWalletList:[],
				walletListIndex:-1,
				payWayType:1,
				isBind:false
			}
		},
		onLoad(option) {
			this.fromType = option.type
			this.$store.dispatch('getUserInfo')
			this.user = uni.getStorageSync('accountInfo')
			this.loadPayWays()
		},
		methods: {
			changeWay(val){
				this.payWayType = val
				this.sectItem = this.payways.find(item=>{
					return item.type===val
				})
			},
			addWalletPage(){
				
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
					}
					this.sectItem = this.payways[0] || {}
					this.formData.vertifyType = this.sectItem.codeMode || 0
					let type = this.sectItem.type
					 if(type==1){
						 this.getBankList()
					 }else if(type==2){
						 this.getUsdtList()
					 }else if(type==4){
						 this.getWalletList()
					 }
				})
			},
			formatCurrWalletList(){
				this.curWalletList = this.curWalletList.map((item,index)=>{
					item.value = index
					item.text = item.addr
					return item
				})
			},
			getBankList(){
				this.bankList = []
				let url = '/player/bank_card_info'
				this.$http.get(url,res=>{
					 if(res.code==200){
						 res = res.data
						 if (Array.isArray(res)) {
							 res.forEach(item => {
								 item.addr = maskString(item.cardNumber)
							 })
							 this.bankList = res
						 } else if (typeof res === 'object' && res !== null) {
							 this.bankList = []
							 res.addr = maskString(res.cardNumber)
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
