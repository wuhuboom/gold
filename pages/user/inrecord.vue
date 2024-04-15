<template>
	<view class="recharge">
		<uni-nav-bar left-icon="left"  :title="$t('recharge.record.page.title')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="choose-box">
			<view class="choose-search">
				<view class="choose-time">
					<view class="choose-time-item" :class="search.time==1?'active':''" @click="chooseTime(1)">{{$t('property.record.search.time1.text')}}</view>
					<view class="choose-time-item" :class="search.time==2?'active':''" @click="chooseTime(2)">{{$t('property.record.search.time2.text')}}</view>
					<view class="choose-time-item" :class="search.time==3?'active':''" @click="chooseTime(3)">{{$t('property.record.search.time3.text')}}</view>
				</view>
			</view>
			
			<scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 1400upx"
			        @refresherrefresh="getRefresherrefresh" :refresher-enabled="false" :refresher-triggered="refresherTriggered"
			        refresher-background="transparent">
				<view class="record-item" v-for="(item,index) in records" :key="index">
					<view class="row1">
						<view class="left">
							{{ { 1: 'online', 2: 'offline' }[item.type] }}
						</view>
						<view class="right">
							<view >{{divide(item.money)}}</view>
						</view>
					</view>
					<view class="row2">
						<view class="left">
							{{formatDate(item.createdAt)}}
						</view>
						<view class="right">
							{{$t('fundsRecords.discount.text')}}: {{divide(item.moneyDiscount)}}
						</view>
					</view>
					<view class="row2">
						<view class="left">
							 {{ $t('fundsRecords.orderNo.text')}}:{{ item.orderNo }}
						</view>
						<view class="right" :style="{ color: statusList[item.status-1].color }">
							{{ getStatus(item.status)}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import {divide100,formatDate} from '@/utils/util.js'
	export default {
		data() {
			return {
				divide:divide100,
				formatDate:formatDate,
				records:[],
				search:{
					time:'1',//1.今日,2.昨日,3.近7日
					status:'',
					pageNo:1,
					pageSize:10
				},
				status:'',
				totalPage:1,
				refresherTriggered:false,
				typeOptions:[
					{
						label: this.$t('withdraw.record.center.show.detail.type.bank.text'),
						value: 1
					}, {
						label: this.$t('withdraw.record.center.show.detail.usdt.bank.text'),
						value: 2
					}, {
						label: this.$t('backapi.self.whitdraw.type.ewallet.form.wallet.addr.text'),
						value: 4
					}	
				],
				statusList: [{
                    label: this.$t("order.search.all.text"),
                    color: '#9F9F9F'
                },
                {
                    label: this.$t("recharge.record.status.pendding.text"),
                    color: '#B5DB1C'
                },
                {
                    label: this.$t("recharge.record.status.paid.text"),
                    color: '#B5DB1C'
                },
                {
                    label: this.$t("recharge.record.status.scored.text"),
                    color: '#FF0000'
                },
                {
                    label: this.$t("recharge.record.status.pay.timeout.text"),
                    color: '#fff'
                }]
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			chooseTime(time){
				this.search.time = time
				this.search.pageNo = 1
				this.totalPage = 1
				this.records = []
				this.loadData()
			},
			getType(value) {
			   let res = this.typeOptions.find(item => item.value === value)
			   return res.label;
			},
			getStatus(index) {
			   let res = this.statusList[index - 1].label || ''	
			   return res;
			},
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
			 	this.$http.post("/player/recharge_log",this.search,res => {
			 		if(res.code == 200){
			 			this.records = [...this.records,...res.data.results]
			 			this.totalPage = res.data.totalPage;
			 			if (this.search.pageNo >= res.data.totalPage) {
			 			    this.search.pageNo = res.data.totalPage + 1;
			 			} else {
			 			    this.search.pageNo = this.search.pageNo + 1
			 			}
			 		}
			 		this.refresherTriggered = false
			 	})
			 },
			goBack(){
				uni.navigateTo({
					url:'./withdraw'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.recharge{
	min-height: 100vh;
	.choose-box{
		width: 670upx;
		padding: 0 40upx;
		background-color: #030408;
		
		.choose-search{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 20upx;
			margin-bottom: 40upx;
			.choose-time{
				display: flex;
				align-items: center;
				color: #9da4b4;
				font-size: 28upx;
				.choose-time-item{
					min-width: 100upx;
					text-align: center;
					height: 50upx;
					line-height: 50upx;
				}
				.active{
					background-color: #01cecf;
					color: #fff;
					border-radius: 20upx;
				}
			}
		}
		.record-item{
				color: #fff;
				margin-bottom: 20upx;
				border-radius: 5px;
				background-color: #2a2937;
				height: 180upx;
				display: flex;
				flex-direction: column;
				.row1,.row2{
					display: flex;
					justify-content: space-between;
					padding: 15upx 20upx;
					.right{
						display: flex;
					}
				}
				.row1{
					font-size: 28upx;
					.money{
						color: $fontColor;
					}
				}
				.row2{
					font-size: 24upx;
					color:#acaebe;
				}
			}
		
	}
}
</style>