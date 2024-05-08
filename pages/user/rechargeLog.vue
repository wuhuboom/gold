<template>
	<view class="withdraw-log">
		 <view class="page-title">
			 <view class="back" @click="goBack">
			 	<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
		 	{{$t('page.rechargelog.title')}}
		 </view>
		 <view class="search-tabs">
			 <image src="../../static/images/wallet/Group 114.webp" mode="aspectFill" @click="subCurrent"></image>
			 <view class="search-swiper">
				 <swiper class="swiper-box" :autoplay="false" :circular="false" :display-multiple-items="2" :touchable="true" @change="changeTime" :current="current">
				 	<swiper-item v-for="(item ,index) in swipers" :key="index" :item-id="item.time">
				 		<view class="swiper-item" :class="current==index?'active':''">
				 			 {{item.text}}
				 		</view>
				 	</swiper-item>
				 </swiper>
			 </view>
			 <image src="../../static/images/wallet/Group 113.webp" mode="aspectFill" @click="addCurrent"></image>
		 </view>
		 <uni-row class="rocord-row record-header" :gutter="2">
			 <uni-col class="col" :span="5">{{$t('backapi.self.safe.bill.data.date.text')}}</uni-col>
			 <uni-col class="col" :span="6">{{$t('backapi.self.safe.bill.data.type.text')}}</uni-col>
			 <uni-col class="col" :span="5">{{$t('backapi.self.safe.bill.data.money.text')}}</uni-col>
			 <uni-col class="col" :span="8">{{$t('backapi.self.safe.bill.data.status.text')}}</uni-col>
		 </uni-row>
		  <scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 90vh;width: 750upx;"
		          @refresherrefresh="getRefresherrefresh" :refresher-enabled="true" :refresher-triggered="refresherTriggered"
		          refresher-background="transparent">
		  	<uni-row class="rocord-row" v-for="(item,index) in records" :key="index" :gutter="2">
				 <uni-col class="col col1" :span="5">{{formatDate(item.createdAt,2)}}</uni-col>
				 <uni-col class="col col2" :span="6">{{getType(item.type)}}</uni-col>
				 <uni-col class="col col3" :span="5">{{divide(item.money)}}</uni-col>
				 <uni-col class="col col4" :span="8">
					<view class="content_item" :style="item.status === 2
					    || item.status === 3 ? 'color:#00ff65' : item.status === 4 ?
					    'color:red' : 'color:#fff'">
					     {{ getStatusList(item.status) }}
					 </view>
				 </uni-col>
		  	</uni-row>
		  </scroll-view>
	</view>
</template>

<script>
	import {getAmount,formatDate,divide100} from '@/utils/util.js'
	export default {
		data() {
			return {
				getAmount:getAmount,
				formatDate:formatDate,
				divide:divide100,
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
				current:0,
				typeList: [{
				    nameStr: this.$t("dropdown.billing.all.title.text"),
				    valueNum: 0
				}, {
				    nameStr: this.$t('dropdown.billing.income.online.recharge.text1'),
				    valueNum: 1
				}, {
				    nameStr: this.$t('dropdown.billing.income.offline.recharge.text1'),
				    valueNum: 2
				}],
				statusList: [{
				    nameStr: this.$t('dropdown.billing.all.title.text'),
				    valueNum: 0
				}, {
				    nameStr: this.$t('recharge.record.status.pendding.text'),
				    valueNum: 1
				}, {
				    nameStr: this.$t('recharge.record.status.paid.text'),
				    valueNum: 2
				}, {
				    nameStr: this.$t('recharge.record.status.scored.text'),
				    valueNum: 3
				}, {
				    nameStr: this.$t('recharge.record.status.pay.timeout.text'),
				    valueNum: 4
				}]
				 
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
				let detail = event.detail
				this.search.time = this.swipers[detail.current].time
				this.search.pageNo = 1
				this.records = []
				// this.loadData()
				setTimeout(this.loadData,300)
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
			getType(value) {
			    if (value) {
			        let res = this.typeList.find(item => item.valueNum === value)
			        return res.nameStr;
			    }
			},
			getStatusList(value) {
			    if (value) {
			        let res = this.statusList.find(item => item.valueNum === value)
			        return res.nameStr;
			    }
			},
			goBack(){
				let pages = getCurrentPages()
				if(pages && pages.length > 1){
					let path = pages[pages.length-2].route
					uni.reLaunch({
						url:path
					})
				}else{
					history.go(-1)
				}
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
	 .record-header{
		 border-top: 1px solid #cfa05e;
		 border-bottom: 1px solid #cfa05e;
	 }
	 .rocord-row{
		 width: 750upx;
		 display: flex;
		 justify-content: space-between;
		 padding: 20upx;
		 text-transform: uppercase;
		 .col{
			 
			 font-size: 20upx;
			 font-weight: bold;
			 letter-spacing: 1px;
			 color: #93643a;
			 text-align: center;
			 word-break: break-all;
			 white-space: normal;
		 }
		 .col1{
			 color: #c1a374;
		 }
		 .col2{
			color: #7f7f7f;
		 }
		 .col3{
		 	color: #c1a374;	 
			text-align: right;
		 }
		 .col4{
		 	text-align: right;	 
		 }
	 }
	 
}
</style>
