<template>
	<view class="trades">
		<view class="page-title">
			{{$t('page.trades.title')}}
		</view>
		 <view class="order-title">
			 <view class="order-title-info">{{$t('trades.today')}}</view>
			 <view class="order-title-num">{{records.length}}</view>
		 </view>
		 <scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 90vh"
		         @refresherrefresh="getRefresherrefresh" :refresher-enabled="false" :refresher-triggered="refresherTriggered"
		         refresher-background="transparent">
		 	 <view class="records">
				 <view class="record-item" v-for="(item,index) in records" :key="index">
					 <view class="item-header">{{$t('trade.item.header')}}</view>
					 <view class="item-info">
						 <view class="main-info">
							 <view class="main-row">
								 <view class="content">
									 <image src="../../static/images/tabbar/order.webp" mode="aspectFit"></image>
								 </view>
								 <view class="mid">VS</view>
								 <view class="content">
									 <image src="../../static/images/home/Group20.webp" mode="aspectFit"></image>
								 </view>
							 </view>
							 <view class="main-row">
								 <view class="content">{{item.gameInfo1}}</view>
								 <view class="content">{{item.gameInfo2}}</view>
							 </view>
						 </view>
						 <view class="detail-info">
							<view class="detail-row">{{$t('trade.item.score')}}:{{item.betScore}} @ {{item.betOdds}}%</view>
							<view class="detail-row">{{$t('trade.item.orderNo')}}:{{item.orderNo}}</view>
							<view class="detail-row">{{$t('trade.item.ordetDate')}}:{{formatDate(item.createdAt)}}</view>
							<view class="detail-row">{{$t('trade.item.stake')}}:{{getAmount(item.betMoney)}}</view>
							<view class="detail-row">{{$t('trade.item.profit')}}:{{getAmount(item.winningAmount)}}</view>
						 </view>
						 <view class="cancel-btn">{{$t('trade.item.cancelBtn')}}</view>
					 </view>
					 
				 </view>
			 </view>
		 </scroll-view>
	</view>
</template>

<script>
	import {getAmount,formatDate} from '@/utils/util.js'
	export default {
		data() {
			return {
				getAmount:getAmount,
				formatDate:formatDate,
				records:[],
				search:{
					time:1,// 1今天(用bets/today)，2昨天，3近7日，4近10日，5近30日
					pageNo:1,
					pageSize:10
				},
				totalPage:1,
				refresherTriggered:false,
			}
		},
		onShow() {
			this.records = []
			this.loadData()
		},
		methods: {
			scrolltolower() {
				this.loadData()
			},
			//下拉刷新
			getRefresherrefresh(){
				this.refresherTriggered = true
				this.search.pageNo = 1
				this.totalPage = 1
				this.records = []
				this.loadData()
			},
			loadData(){
				// let url = '/player/bets/today'
				let url = '/player/bets'
				this.search.time = 5
				this.$http.post(url,this.search,res=>{
					if(res.code==200){
						let datas = res.data.results || []
						if(datas.length > 0){
							datas.forEach(item => {
								if(item.gameInfo){
									var names = item.gameInfo.split("VS")
									item.gameInfo1 = names[0]
									item.gameInfo2 = names[1]
								}
							})
							this.records = [...this.records,...datas]
							this.totalPage = res.data.totalPage;
							if (this.search.pageNo >= res.data.totalPage) {
							    this.search.pageNo = res.data.totalPage + 1;
							} else {
							    this.search.pageNo = this.search.pageNo + 1
							}
							this.refresherTriggered = false
						}
					}
				})
			}
		}
			 
	}
</script>

<style scoped lang="scss">
.trades{
	 width: 670upx;
	 height: 100vh;
	 padding-left: 40upx;
	 padding-right: 40upx;
	 .order-title{
		 display: flex;
		 flex-direction: column;
		 align-items: center;
		 margin-top: 20upx;
		 .order-title-info{
		   font-size: 24upx;
		   font-weight: bold;
		   line-height: 2;
		   letter-spacing: 1px;
		   color: #c1a374;
		 }
		 .order-title-num{
			font-size: 50upx;
		   font-weight: bold;
		   line-height: 1.16;
		   color: #c1a374;
		 }
	 }
	 .records{
		 .record-item{
			 display: flex;
			 flex-direction: column;
			 align-items: center;
			 margin-top: 20upx;
			 .item-header{
			   font-size: 28upx;
			   font-weight: bold;
			   letter-spacing: 1.56px;
			   color: #93643a;
			 }
			 .item-info{
				border-radius: 52upx;
				border: solid 1px #cfa05e;
				padding: 20upx;
				width: 620upx;
				.main-info{
					border-bottom: 6upx solid #cfa05e;
					padding-bottom: 10upx;
					.main-row{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.content{
							width: 40%;
							text-align: center;
							white-space: nowrap;
							overflow: hidden;
							text-overflow:ellipsis;
							color: #c1a374;
							font-size: 20upx;
							image{
								width: 57upx;
								height: 70upx;
							}
						}
						.mid{
						  font-size: 28upx;
						  font-weight: bold;
						  color: #93643a;
						}
					}
				}
				.detail-info{
				  margin-top: 10upx;
				  font-size: 24upx;
				  font-weight: bold;
				  line-height: 1.2;
				  letter-spacing: 0.6px;
				  text-align: left;
				  color: #c1a374;
				}
				.cancel-btn{
				  width: 222upx;
				  height: 32upx;
				  border-radius: 6upx;
				  border: solid 1.5upx #a5a5a5;
				  margin: 0 auto;
				  color: #c1a374;
				  font-size: 24upx;
				  text-align: center;
				  margin-top: 20upx;
				}
			 }
		 }
	 }
}
</style>
