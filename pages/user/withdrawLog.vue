<template>
	<view class="withdraw-log">
		 <view class="page-title">
			 <view class="back" @click="goBack">
			 	<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
		 	{{$t('page.withdrawlog.title')}}
		 </view>
		 <view class="search-tabs">
			 <image src="../../static/images/wallet/Group 114.webp" mode="aspectFill" @click="subCurrent"></image>
			 <view class="search-swiper">
				 <swiper class="swiper-box" :autoplay="false" :circular="false" :display-multiple-items="2" :touchable="false" @change="changeTime" :current="current">
				 	<swiper-item v-for="(item ,index) in swipers" :key="index" :item-id="item.time">
				 		<view class="swiper-item" :class="current==index?'active':''">
				 			 {{item.text}}
				 		</view>
				 	</swiper-item>
				 </swiper>
			 </view>
			 <image src="../../static/images/wallet/Group 113.webp" mode="aspectFill" @click="addCurrent"></image>
		 </view>
		  <scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 1400upx"
		          @refresherrefresh="getRefresherrefresh" :refresher-enabled="true" :refresher-triggered="refresherTriggered"
		          refresher-background="transparent">
		  	<view class="record-item" v-for="(item,index) in records" :key="index">
		  		 
		  	</view>
		  </scroll-view>
	</view>
</template>

<script>
	import {getAmount} from '@/utils/util.js'
	export default {
		data() {
			return {
				getAmount:getAmount,
				records:[],
				search:{
					time:'1',//1.今日,2.昨日,3.近7日
					status:'',
					pageNo:1,
					pageSize:10
				},
				totalPage:1,
				refresherTriggered:false,
				swipers:[
					{time:'1',text:this.$t('match.records.today.text')},
					{time:'2',text:this.$t('match.records.yes.text')},
					{time:'3',text:this.$t('match.records.nearly7.text')},
					{time:'4',text:this.$t('match.records.nearly10.text')},
					{time:'5',text:this.$t('match.records.nearly30.text')}
				],
				current:0
				 
			}
		},
		onLoad(option) {
			 this.loadData()
		}, 
		methods: {
			subCurrent(){
				if(this.current > 0){
					this.current--
				}else{
					this.current = 0
				}
			},
			addCurrent(){
				if(this.current >= this.swipers.length -1){
					this.current = this.swipers.length - 1
				}else{
					this.current++
				}
			},
			changeTime(event){
				console.log(event)
			},
			scrolltolower() {
				 if(this.search.pageNo >= this.totalPage) return
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
				this.$http.post("/player/withdrawal_log",this.search,res => {
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
				uni.reLaunch({
					url: './withdraw'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.withdraw-log{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.search-tabs{
		display: flex;
		justify-content: space-between;
		align-items: center;
		image{
			width: 42upx;
			height: 21upx;
		}
		.search-swiper{
			width: 540upx;
			height: 70upx;
			line-height: 70upx;
			border: solid 1px #a5a5a5;
			margin: 40upx 20upx;
			font-size: 26upx;
			color: #c1a374;
			font-weight: bold;
			.swiper-item{
				text-align: center;
			}
			.active{
				color: #93643a;
			}
		}
	}
	 
}
</style>
