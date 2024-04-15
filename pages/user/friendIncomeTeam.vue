<template>
	<view class="income-invest">
		<uni-nav-bar left-icon="left"  :title="$t('myfriends.rank.team.title')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="content">
			<view class="row">
				<view class="row-item">
					<view class="title">
						{{$t('myfriends.team.title1.text')}}
					</view>
					<view class="num">
						{{divide(money)}} USDT
					</view>
				</view>
				<view class="row-item">
					<view class="title align-r">
						{{$t('myfriends.team.title2.text')}}
					</view>
					<view class="num align-r">
						0USDT
					</view>
				</view>
			</view>
			<!-- <view class="row">
				<view class="row-item">
					<view class="title">
						{{$t('myfriends.team.title3.text')}}
					</view>
					<view class="num">
						0USDT
					</view>
				</view>
				<view class="row-item">
					<view class="title align-r">
						{{$t('myfriends.team.title4.text')}}
					</view>
					<view class="num align-r">
						0USDT
					</view>
				</view>
			</view> -->
		</view>
		<scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 1400upx"
		        @refresherrefresh="getRefresherrefresh" :refresher-enabled="true" :refresher-triggered="refresherTriggered"
		        refresher-background="transparent">
			<view class="record-list">
				 <view class="record-item" v-for="(item,index) in records" :key="index">
					 <view class="record-item-head">
						 <view class="left">
							 <view class="top">{{$t('invest.record.table.col3.text')}}</view>
							 <view class="down">{{getType(item.planType)}}</view>
						 </view>
						 <view class="right" v-if="item.status==0">
							 <view class="cal-btn" @click="calInvest(item)">{{$t('btn.caancle.text')}}</view>
						 </view>
					 </view>
					 <view class="record-item-content">
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col5.text')}}</view>
							 <view class="right" :style="{'color':item.status ==0?'#05ff00':item.status=='1'?'#ff0000':'#8B8989'}">{{getType2(item.status)}}</view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col1.text')}}</view>
							 <view class="right">$&nbsp;{{divide(item.money)}}</view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('myfriends.rank.invest.title')}}</view>
							 <view class="right">$&nbsp;<text>{{divide(item.moneyIncome)}}</text></view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col6.text')}}</view>
							 <view class="right">{{item.rateConf}}%</view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col7.text')}}</view>
							 <view class="right">{{item.id}}</view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col2.text')}}</view>
							 <view class="right">{{formatDate(item.finishTime)}}</view>
						 </view>
					 </view>
				 </view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {divide100,formatDate} from '@/utils/util.js'
	export default {
		data() {
			return {
				data:[],
				money:0,
				divide:divide100,
				formatDate:formatDate,
				records:[],
				search:{
					cid:'',
					pageNo:1,
					pageSize:10
				},
				totalPage:1,
				refresherTriggered:false,
				typeOptions: [
				    {
				        label: this.$t("invest.menu4.text"),
				        value: 0
				    },
				    {
				        label: this.$t("invest.menu1.text"),
				        value: 1
				    }
				],
				typeOptions2: [
				    {
				        label: this.$t("invest.record.status0.text"),
				        value: 0
				    },
				    {
				        label: this.$t("invest.record.status1.text"),
				        value: 1
				    },
					{
					    label: this.$t("invest.record.status2.text"),
					    value: 2
					}
				]
			}
		},
		onLoad(option) {
			this.money = option.money
			this.search.cid = option.cid * 1
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
				this.$http.post("/player/invest/my/friends/group",this.search,res => {
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
			getType(value) {
			   let res = this.typeOptions.find(item => item.value === value)
			   return res.label;
			},
			getType2(value) {
				let res = this.typeOptions2.find(item => item.value == value)
				return res.label;
			},
			goBack(){
				uni.navigateTo({
					url:'./myfriend'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.income-invest{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.content{
		box-shadow: inset 0 0 16upx 0upx $fontColor;
		border-radius: 20upx;
		color: #fff;
		padding: 30upx;
		.border{
			border-bottom: 1px solid $fontColor;
		}
		.row{
			padding-top: 20upx;
			padding-bottom: 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.row-item{
				width: 45%;
				.title{
					margin-top: 10upx;
					margin-bottom: 10upx;
					font-size: 26upx;
				}
				.num{
					font-size: 32upx;
				}
				.align-r{
					text-align: right;
				}
			}
		}
	}
}
</style>
