<template>
	<view class="wallet">
		 <view class="page-title">
			 <view class="back" @click="goBack">
			 	<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
		 	{{$t('page.wallet.title')}}
		 </view>
		 <view class="user-balance">
			 <view class="balance-header">{{$t('home.balance.text')}}</view>
			 <view class="user-balance-num">
				 <view class="balance-num">{{getAmount(user.money || 0)}}</view>
				 <image src="../../static/images/wallet/Group 110.webp" mode="scaleToFill" @click="refreshUser"></image>
			 </view>
		 </view>
		 <view class="user-reward">
			 <view class="user-reward-item user-balance">
				 <view class="balance-header">{{$t('wallet.yesterday.reward')}}</view>
				 <view class="balance-num">{{getAmount(user.todayIncome || 0)}}</view>
			 </view>
			 <view class="user-reward-item user-balance">
				 <view class="balance-header">{{$t('wallet.cumulative.reward')}}</view>
				 <view class="balance-num">{{getAmount(user.totalIncome || 0)}}</view>
			 </view>
		 </view>
		 <view class="wallet-menu">
			 <view class="wallet-emnu-item" v-for="(item,index) in menus" :key="index" @click="goPage(item.path)">
				 <img :src="item.icon"/>
				 <view class="item-title">{{item.name}}</view>
				 <view class="item-sub-title" v-if="item.sub">({{item.sub}})</view>
			 </view>
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
				menus:[
					{name:this.$t('wallet.menus1.text'),sub:this.$t('wallet.menus1.sub.text'),icon:'../../static/images/wallet/Group 103.webp',path:'./transferSub'},
					{name:this.$t('wallet.menus2.text'),sub:this.$t('wallet.menus2.sub.text'),icon:'../../static/images/wallet/Group 105.webp',path:'./transferSelf'},
					{name:this.$t('wallet.menus3.text'),icon:'../../static/images/wallet/Group 96.webp',path:'./recharge?type=wallet'},
					{name:this.$t('wallet.menus4.text'),icon:'../../static/images/wallet/Group 107.webp',path:'./explanation'},
					{name:this.$t('wallet.menus5.text'),icon:'../../static/images/wallet/Group 109.webp',path:'./bilingDetails'}
				]
				  
			}
		},
		onLoad(option) {
			this.refreshUser()
		},
		methods: {
			goPage(path){
				uni.navigateTo({
					url:path
				})
			},
		   refreshUser(){
			 this.$http.get('/player/safe/info',res=>{
			 	if(res.code==200){
			 		this.user = res.data
			 	}
			 }) 
		   },
			goBack(){
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
		}	 
	}
</script>

<style scoped lang="scss">
.wallet{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-image: url('../../static/images/wallet/bg4.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;
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
	 .user-reward{
		 display: flex;
		 justify-content: space-between;
		 align-items: center;
		 width: 100%;
		 .user-reward-item{
			 width: 50%;
		 }
	 }
	 .wallet-menu{
		  margin-top: 80upx;
		  .wallet-emnu-item{
			  display: flex;
			  justify-content: flex-start;
			  align-items: center;
			  padding-left: 60upx;
			  margin-top: 60upx;
			  img{
				  width: 60upx;
				  height: auto;
			  }
			  .item-title{
				font-size: 28upx;
				font-weight: bold;
				letter-spacing: 2.6px;
				color: #b57d3c;
				margin-left: 20upx;
			  }
			  .item-sub-title{
				font-size: 24upx;
				font-weight: bold;
				letter-spacing: 1px;
				color: #c1a374;
			  }
		  }
	 }
}
</style>
