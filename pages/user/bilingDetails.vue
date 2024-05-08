<template>
	<view class="billing-detail">
		<view class="page-title">
			 <view class="back" @click="goBack">
				<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
			{{$t('wallet.menus5.text')}}
		</view>
		<view class="content">
			<view class="tips-item">
				<view class="tip-item-title">{{$t('billingdetail.creatdate.text')}}</view>
				<view class="tip-item-val">2024-05-08</view>
			</view>
			<view class="tips-item">
				<view class="tip-item-title">{{$t('billingdetail.payee.text')}}</view>
				<view class="tip-item-val">123</view>
			</view>
			<view class="tips-item">
				<view class="tip-item-title">{{$t('billingdetail.state.text')}}</view>
				<view class="tip-item-val">123</view>
			</view>
			<view class="tips-item">
				<view class="tip-item-title">{{$t('billingdetail.oddnum.text')}}</view>
				<view class="tip-item-val">123</view>
			</view>
			<view class="tips-item">
				<view class="tip-item-title">{{$t('billingdetail.amount.text')}}</view>
				<view class="tip-item-val">123</view>
			</view>
			<view class="tips-item">
				<view class="tip-item-title">{{$t('billingdetail.confirmDate.text')}}</view>
				<view class="tip-item-val">13</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {formatDate,divide100} from '@/utils/util.js'
	export default {
		components:{ 
		},
		data() {
			return {
				formatDate:formatDate,
				divide:divide100,
				item:{}
			}
		},
		onLoad() {
		},
		methods: {
			goBack(){
				uni.navigateTo({
					url:'/pages/user/wallet'
				})
			}
			 
		}
	}
</script>

<style lang="scss" scoped>
.billing-detail{
	width: 670upx;
	padding: 0upx 40upx;
	.content{
	  margin-top: 150upx;
	  width: 100%;
	  min-height: 600upx;
	  border-radius: 26px;
	  border: solid 1px #cfa05e;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  padding-top: 100upx;
	  padding-bottom: 100upx;
	  .tips-item{
		  display: flex;
		  flex-direction: column;
		  justify-content: center;
		  align-items: center;
		  padding: 40upx 20upx;
		  .tip-item-title{
			  font-size: 24upx;
			  font-weight: bold;
			  color: #c1a374;
		  }
		  .tip-item-val{
			  font-size: 26upx;
			  font-weight: bold;
			  color: #93643a;
		  }
	  }
	}
}
</style>
