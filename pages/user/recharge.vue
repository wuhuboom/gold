<template>
	<view class="recharge">
		 <view class="page-title">
			 <view class="back" @click="goBack">
			 	<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
		 	{{$t('page.recharge.title')}}
		 </view>
		 <view class="user-balance">
			 <view class="balance-header">{{$t('home.balance.text')}}</view>
			 <view class="balance-num">{{getAmount(user.balance || 0)}}</view>
		 </view>
		 <view class="form">
			 <uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
			 	<uni-forms-item :label="$t('recharge.form.method')"  name="payId">
			 		<view class="type-select">
						<uni-data-select v-model="channelIndex" :localdata="channelList" :clear="false" @change="changeChannel"></uni-data-select>
					</view>
			 	</uni-forms-item>
				<uni-forms-item :label="$t('withdraw.form.enteramount')"  name="money">
					<uni-easyinput type="text" v-model="formData.money" :clearable="false">
						<template #right>
							<view class="input-right">{{sectItem.currencySymbol}}</view>
						</template>
					</uni-easyinput>
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
			 </uni-forms>
			 <button class="btn" @click="submit">{{$t('page.recharge.title')}}</button>
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
				rechargeType:'',
				user:{},
				formData:{
					money:'',
					payId:'',
					actualmount:''
				},
				rules: {
					money: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('withdraw.form.enteramount')})},
							{
								validateFunction:(rule,value,data,callback)=>{
									if (value < 4) {
										callback(this.$t('backapi.payMoneyTooMinOrMax'))
									}else{
										callback()
									}
								}
							}
						]
					},
					// payId: {
					// 	rules: [
					// 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('recharge.confirm.notSelectPayMet.text')})}
					// 	]
					// }
				}, 
				channelList:[],
				sectItem:{},
				channelIndex:0
			}
		},
		onLoad(option) {
			this.fromType = option.type
			this.rechargeType = option.flag
			this.$store.dispatch('getUserInfo')
			this.user = uni.getStorageSync('accountInfo')
			if(this.rechargeType === 'safe'){
				this.reachargePre()
			}
			this.getChannelList()
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
			changeChannel(val){
				this.sectItem = this.channelList[val]
			},
			reachargePre(){
				let url = '/player/safe/recharge_pre'
				this.$http.get(url,res=>{
					if(res.code==200){
						this.sectItem = res.data
					}
				})
			},
			getChannelList(){
				this.channelList=[]
				let url = ''
				if(this.rechargeType === 'safe'){
					url = '/player/safe/recharge_pre_mult'
				}else{
					url = '/player/recharge_pre'
				}
				this.$http.get(url,res=>{
					if(res.code==200){
						let datas = res.data || []
						this.channelList = datas.map((item,index)=>{
							item.text = item.name
							item.value = index
							return item
						})
						if(this.rechargeType != 'safe' && this.channelList.length > 0){
							this.sectItem = this.channelList[this.channelIndex]
						}
					}
				})
			},
			submit(){
				if(!this.sectItem.id){
					uni.showToast({
						title:this.$t('recharge.confirm.notSelectPayMet.text'),
						icon:'none'
					})
					return
				}
				this.$refs.form.validate().then(res=>{
					let url = ''
					if(this.rechargeType === 'safe'){
						url = '/player/safe/recharge'
					}else{
						url = '/player/recharge'
					}
					const para = {
						payId: this.sectItem.id,
						money: this.formData.money
					}
					this.$http.post(url,para,(res=>{
						if(res.code ==200){
							this.formData.money = ''
							this.formData.payId = ''
							location.href = res.data.UrlAddress
						}
					}))
				}).catch(err =>{
					console.log( err);
				})
			},
			goBack(){
				// let pages = getCurrentPages()
				// if(pages && pages.length > 1){
				// 	let path = pages[0].route
				// 	console.log(path)
				// 	uni.reLaunch({
				// 		url:path
				// 	})
				// }else{
				// 	history.go(-1)
				// }
				let path = ""
				if(this.fromType=='home'){
					path = '/pages/home/home'
				}else if(this.fromType=='wallet'){
					path = '/pages/user/wallet'
				}else{
					path = '/pages/user/user'
				}
				uni.reLaunch({
					url: path
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.recharge{
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
