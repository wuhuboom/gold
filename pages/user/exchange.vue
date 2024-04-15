<template>
	<view class="exchange">
		<uni-nav-bar left-icon="left"  :title="$t('property.subpage.title3')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="form">
			<view class="send-title">{{$t('exchange.send.text')}} </view>
			<view class="payways">
				<view class="show-box">
					<view class="way-item">
						<view class="recive-money">
							<uni-easyinput type="text" v-model="money" :clearable="false"/>
						</view>
						<view class="right" @click="isBfShow = !isBfShow">
							<img :src="bFitem.currency.imgUrl"/>
							<view class="way-name">{{bFitem.currency.name}}</view>
							<uni-icons :type="isBfShow?'up':'down'" color="#fff" size="24"></uni-icons>
						</view>
					</view>
				</view>
				<view class="hide-box" v-if="isBfShow">
					<view class="way-item" v-for="(item,index) in balance.list" :key="index" @click="changeBfWay(item)">
						<img :src="item.currency.imgUrl"/>
						<view class="way-name">{{item.currency.name}}</view>
					</view>
				</view>
			</view>
			<view class="enable-money">
			{{$t('exchange.enable.text')}}<text>{{divide(bFitem.balance)}}</text>
			</view>
			<view class="trans">
				<view class="logo">
					<img src="../../static/images/user/trans.png"/>
				</view>
			</view>
			<view class="send-title">{{$t('exchange.recive.text')}}</view>
			<view class="payways">
				<view class="show-box" >
					<view class="way-item">
						<view class="recive-money">{{exchangeMoney}}</view>
						<view class="right" @click="isAfShow = !isAfShow">
							 <img :src="aFitem.currency.imgUrl"/>
							 <view class="way-name">{{aFitem.currency.name}}</view>
							 <uni-icons :type="isAfShow?'up':'down'" color="#fff" size="24"></uni-icons>
						</view>
					</view>
				</view>
				<view class="hide-box" v-if="isAfShow">
					<view class="way-item" v-for="(item,index) in balance.list" :key="index" @click="changeAfWay(item)">
						<img :src="item.currency.imgUrl"/>
						<view class="way-name">{{item.currency.name}}</view>
					</view>
				</view>
			</view>
			
			<button class="btn" @click="submit" :disabled="this.money > this.bFitem.balance">{{$t('btn.continue.text')}}</button>
		</view>
		
	</view>
	
</template>

<script>
	import echarts from '@/components/echarts-uniapp/echarts-uniapp.vue'
	import {divide100} from '@/utils/util.js'
	export default {
		components:{
			echarts
		},
		data() {
			return {
				balance:{
					totalBalance:'0',
					list:[
						// {
						// balance: '100',
						// currency: {
						// 	id:'',
						// 	name: "USD",
						// 	imgUrl: "../../static/images/user/10024.png",
						// 	rate: '7.12'
						// }},
						// {
						// balance: '0',
						// currency: {
						// 	id:'',
						// 	name: "USDT",
						// 	imgUrl: "../../static/images/user/10025.png",
						// 	rate: '7.12'
						// }},
						// {
						// balance: '80',
						// currency: {
						// 	id:'',
						// 	name: "TFI",
						// 	imgUrl: "../../static/images/user/10026.png",
						// 	rate: '7.12'
						// }},
						
					]
				},
				isBfShow:false,
				isAfShow:false,
				bFitem:{
					currency:{}
				},//兑换之前
				aFitem:{
					currency:{}
				},//兑换之后
				money:'',
				exchangeMoney:'',
				option : {},
				divide:divide100
			}
		},
		onReady() {
			 
		},
		onLoad() {
			this.getCurrency()
		},
		watch:{
			money(val){
				this.exchangeMoney =  this.divide(val * this.bFitem.currency.rate * 100)
			}
		},
		methods: {
			submit(){
				if(this.money > this.bFitem.balance){
					uni.showToast({
						title:this.$t('exchange.monen.valid'),
						icon:'none'
					})
					return
				}
				let para = {
					money :this.money,
					fromId :this.bFitem.cid,
					toId :this.aFitem.cid
				}
				this.$http.post('/player/currency/exchange',para,res => {
					if(res.code == 200){
						this.money = ''
						this.getCurrency()
						uni.showToast({
							title:this.$t('oper.tip.success.text'),
							icon:'success',
							success() {
								
							}
						})
					}
				})
			},
			getCurrency(){
				this.$http.get('/player/currency/list',res=>{
					if(res.code == 200){
						this.balance = res.data
						this.balance.list.forEach(item => {
							if(item.currency.name=='USD'){
								this.bFitem = item
							}else if(item.currency.name=='USDT'){
								this.aFitem = item
							}
						})
						this.money = this.divide(this.bFitem.balance)
						// this.bFitem = this.balance.list[0] || {}
						// this.aFitem = this.balance.list[1] || {}
					}
				})
			},
			changeBfWay(item){
				this.bFitem = item
				this.money = this.divide(this.bFitem.balance)
				// this.exchangeMoney = this.divide(this.bFitem.balance * this.bFitem.currency.rate)
				this.isBfShow = !this.isBfShow
			},
			changeAfWay(item){
				this.aFitem = item
				this.isAfShow = !this.isAfShow
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.exchange{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.send-title{
		font-size: 32upx;
		color: #fff;
	}
	.enable-money{
		font-size: 26upx;
		margin-top: 20upx;
		color: #fff;
		text{
			color: $fontColor;
		}
	}
	.trans{
		width: 100%;
		height: 320upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.logo{
			width: 80upx;
			height: 80upx;
			background-color: rgba(0,212,212,0.5);
			border-radius: 50%;
			padding: 20upx;
			// border: 2upx solid $fontColor;
			img{
				width: 100%;
				height: auto;
			}
		}
		
	}
	.btn{
		background-color: $fontColor;
		color: #fff;
		margin-top: 40upx;
	}
	.payways{
		margin-top: 20upx;
		background-color: rgb(41,41,55);
		border-radius: 10upx;
		.show-box{
			position: relative;
		}
		.hide-box{
			position: absolute;
			width: 670upx;
			background-color: rgb(41,41,55);
			z-index: 99;
		}
		.way-item{
			height: 100upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			padding-left: 20upx;
			padding-right: 20upx;
			border-radius: 20upx;
			border-bottom: 1px solid rgb(23,24,29);
			img{
				width: 60upx;
				height: auto;
				border-radius: 50%;
			}
			.recive-money{
				 
			}
			::v-deep .uni-easyinput__content{
				background-color: rgb(41,41,55)!important;
				border-color: rgb(41,41,55)!important;
				color: rgb(255,255,255)!important;
			}
			.right{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				color: #fff;
				border-radius: 20upx;
				.recive-money{
					width: 350upx;
					margin-right: 150upx;
				}
				.way-name{
					width: 120upx;
					margin-left: 20upx;
				}
				img{
					width: 60upx;
					height: auto;
					border-radius: 50%;
				}
			}
		}
	}
	.container{
		width: 500upx;
		height: 500upx;
		margin: 0 auto;
		
	}
}
</style>
