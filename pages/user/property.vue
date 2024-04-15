<template>
	<view class="property">
		<uni-nav-bar left-icon="left"  :title="$t('property.navbar.title')" background-color="rgb(1,2,3)" color="#fff" :border="false" right-icon="icon-record" @clickLeft="goBack" @clickRight="goRecord">
			<view slot="right">
				<uni-icons custom-prefix="iconfont" type="icon-record" size="22" color="#fff"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="top">
			<view class="header">
				<view class="title">{{$t('property.header.title')}}</view>
				<uni-icons :type="isShow?'eye':'eye-slash'" color="#fff" :size="24"  @click="showBalance"></uni-icons>
			</view>
			<view class="balance" v-if="isShow">${{divide(balance.totalBalance)}}</view>
			<view class="balance" v-else>${{gethideNum(balance.totalBalance)}}</view>
		</view>
		
		<view class="sub-page">
			<view class="sub-item" v-for="(item,index) in subPages" :key="index" @click="goPage(item.path)">
				<image :src="item.icon" mode="scaleToFill"></image>
				<view class="sub-item-title">{{item.title}}</view>
			</view>
		</view>
		
		<view class="sub-title">{{$t('property.navbar.title')}}</view>
		
		<view class="balances">
			<view class="balance-item" v-for="(item,index) in balance.list" :key="index">
				<view class="left">
					<img :src="item.currency.imgUrl"/>
				</view>
				<view class="right">
					<view class="menu-text">{{item.currency.name}}</view>
					<view class="menu-num">
						<view class="up">{{divide(item.balance)}}</view>
						<view class="rate">${{divide(item.balance * item.currency.rate)}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {divide} from '@/utils/util.js'
	export default {
		data() {
			return {
				isShow:true,
				hidenum:'',
				subPages:[
					{title:this.$t('property.subpage.title1'),icon:'../../static/images/user/10023.png',path:'./recharge'},
					{title:this.$t('property.subpage.title2'),icon:'../../static/images/user/zjtq.png',path:'./withdraw'},
					{title:this.$t('property.subpage.title3'),icon:'../../static/images/user/sd.png',path:'./exchange'}
				],
				// balances:[
				// 	{name:'USD',num:'100',icon:'../../static/images/user/10024.png',path:''},
				// 	{name:'USDT',num:'100',icon:'../../static/images/user/10025.png',path:''},
				// 	{name:'TFI',num:'0',icon:'../../static/images/user/10026.png',path:''}
				// ],
				balance:{
					// totalBalance:'0',
					// list:[
					// 	{
					// 	balance: '100',
					// 	currency: {
					// 		name: "USD",
					// 		imgUrl: "../../static/images/user/10024.png",
					// 		rate: '7.12'
					// 	}},
					// 	{
					// 	balance: '0',
					// 	currency: {
					// 		name: "USDT",
					// 		imgUrl: "../../static/images/user/10025.png",
					// 		rate: '7.12'
					// 	}},
					// 	{
					// 	balance: '80',
					// 	currency: {
					// 		name: "TFI",
					// 		imgUrl: "../../static/images/user/10026.png",
					// 		rate: '7.12'
					// 	}},
						
					// ]
				},
				divide:divide
			}
		},
		onLoad() {
			this.getCurrency()
		},
		methods: {
			getCurrency(){
				this.$http.get('/player/currency/list',res=>{
					if(res.code == 200){
						this.balance = res.data
					}
				})
			},
			goPage(path){
				uni.navigateTo({
					url:path
				})
			},
			showBalance(){
				console.log(this.isShow)
				this.isShow = !this.isShow
			},
			gethideNum(num){
				let val = "*"
				if(num){
					num = num.toString();
					for(var i = 0;i<num.length ;i++){
						val +='*'
					}
				}
				return val
			},
			goBack(){
				uni.switchTab({
					url:'/pages/user/user'
				})
			},
			goRecord(){
				uni.navigateTo({
					url:'./balanceRecord'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.property{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.top{
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		.header{
			display: flex;
			align-items: center;
			.title{
				font-size: 40upx;
			}
		}
		.balance{
			font-size: 50upx;
			color: $fontColor;
		}
		
	}
	.sub-page{
		margin-top: 40upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.sub-item{
			width: 33%;
			display: flex;
			flex-direction: column;
			align-items: center;
			color:#fff;
			image{
				width: 100upx;
				height: 100upx;
			}
			.sub-item-title{
				margin-top: 20upx;
			}
		}
	}
	.sub-title{
		height: 60upx;
		color: #fff;
		line-height: 60upx;
		font-size: 40upx;
		margin-top: 40upx;
	}
	.balances{
		.balance-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 100upx;
			color: #fff;
			.left{
				width: 10%;
				img{
					width: 60upx;
					height: auto;
				}
			}
			.right{
				width: 88%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid $fontColor;
				padding-bottom: 6upx;
				.menu-num{
					.up{
						font-size: 36upx;
					}
					.rate{
						font-size: 24upx;
						text-align: right;
					}
				}
			}
		}
	}
}
</style>
