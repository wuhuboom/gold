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
			 		<uni-easyinput type="text" v-model="formData.type"  />
			 	</uni-forms-item>
			 	<uni-forms-item  name="newPwd">
			 		<uni-easyinput type="newPwd" v-model="formData.newPwd" :placeholder="$t('register.form.pwd')" />
			 	</uni-forms-item>
			 	<uni-forms-item name="twicePwd">
			 		<uni-easyinput type="newPwd" v-model="formData.twicePwd" :placeholder="$t('register.form.pwd.again')" />
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
					vertifyType:''
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
				sectItem:{}
			}
		},
		onLoad(option) {
			this.fromType = option.type
			this.$store.dispatch('getUserInfo')
			this.user = uni.getStorageSync('accountInfo')
			this.loadPayWays()
		},
		methods: {
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
						this.payways = res.data
					}
					this.sectItem = this.payways[0] || {}
				})
			},
			changeWay(item){
				this.sectItem = item
				this.isShow = ! this.isShow
			},
			  
		}
	}
</script>

<style scoped lang="scss">
.withdraw{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	 
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
</style>
