<template>
	<view class="transferSub">
		<view class="content">
			<view class="title">
				<view class="back" @click="goBack">
					<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
				</view>
				<view class="">
					<view class="">{{$t('wallet.menus1.text')}}</view>
					<view class="sub-title">{{$t('wallet.menus1.sub.text')}}</view>
				</view>
			</view>
			<view class="user-balance">
				 <view class="balance-header">{{$t('home.balance.text')}}</view>
				 <view class="user-balance-num">
					 <view class="balance-num">{{getAmount(user.money || 0)}}</view>
					 <image src="../../static/images/wallet/Group 110.webp" mode="scaleToFill" @click="getSafeInfo"></image>
				 </view>
			</view>
			<view class="form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
					<uni-forms-item  name="aimName">
						<uni-easyinput type="text" v-model="formData.aimName" :placeholder="$t('wallet.transfer.ainname')" />
					</uni-forms-item>
					<uni-forms-item  name="money">
						<uni-easyinput type="text" v-model="formData.money" :placeholder="$t('wallet.transfer.money')" />
					</uni-forms-item>
					<uni-forms-item name="payPwd">
						<uni-easyinput type="password" v-model="formData.payPwd" :placeholder="$t('wallet.transfer.pwd')"/>
					</uni-forms-item>
				</uni-forms>
				<button class="btn" @click="submit">{{$t('btn.confirm.text')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {getAmount} from '@/utils/util.js'
	export default {
		components:{ 
		},
		data() {
			return {
				getAmount:getAmount,
				user:{},
				formData:{
					aimName :'',
					money  :'',
					payPwd:''
				},
				rules: {
					aimName: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('wallet.transfer.ainname')})}
						]
					},
					money: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('wallet.transfer.money')})},
						]
					},
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('wallet.transfer.pwd')})}
						]
					}
				}
			}
		},
		onLoad() {
			this.getSafeInfo()
		},
		methods: {
			 getSafeInfo(){
				this.$http.get('/player/safe/info',res=>{
					if(res.code==200){
						this.user = res.data
					}
				}) 
			 },
			goBack(){
				uni.navigateTo({
					url:'/pages/user/wallet'
				})
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/safe/transfer',para,(res=>{
						if(res.code ==200){
							this.formData = {
								aimName:'',
								money :'',
								payPwd:''
							}
							this.getSafeInfo()
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
								icon:'success',
								duration:2000
							})
						}
					}))
				}).catch(err =>{
					console.log( err);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.transferSub{
	width: 750upx;
	height: 100vh;
	.content{
		padding: 40upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title{
			margin-top: 20upx;
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
			.sub-title{
				color: #c1a374;
				font-size: 26upx;
			}
		}
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
			.user-balance-num{
				display: flex;
				align-items: center;
				image{
					width: 40upx;
					height: 40upx;
					margin-left: 20upx;
				}
			}
			.balance-num{
			  width: 260upx;
			  height: 70upx;
			  line-height: 70upx;
			  margin: 0 auto;
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
