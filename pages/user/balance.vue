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
		 <view class="search-tabs">
			 <image src="../../static/images/wallet/Group 114.webp" mode="aspectFill" @click="subTabCurrent"></image>
			 <view class="search-swiper">
				 <swiper class="swiper-box" :autoplay="false" :circular="false" :display-multiple-items="2" :touchable="true" @change="changeType" :current="tabCurrent">
					<swiper-item v-for="(item ,index) in tabsList" :key="index">
						<view class="swiper-item" :class="tabCurrent==index?'active':''">
							 {{item.text}}
						</view>
					</swiper-item>
				 </swiper>
			 </view>
			 <image src="../../static/images/wallet/Group 113.webp" mode="aspectFill" @click="addTabCurrent"></image>
		 </view>
		  <scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 75vh;width: 750upx;"
		          @refresherrefresh="getRefresherrefresh" :refresher-enabled="true" :refresher-triggered="refresherTriggered"
		          refresher-background="transparent">
		  	 <view class="rocord-row" v-for="(item,index) in records" :key="index">
				 <view class="row row1">
					 <view class="left">{{getType(item.balanceChangeType)}}</view>
					 <view class="right" :style="{color:item.changeMoney>=0?'#279a2b':'#fc5050'}">{{divide(item.changeMoney)}}</view>
				 </view>
				 <view class="row row2">
					 <view class="left">{{formatDate(item.createdAt)}}</view>
					 <view class="right">{{$t('wallet.menus6.text')}}:{{divide(item.dnedMoney)}}</view>
				 </view>
			 </view>
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
					typeb:'',//1 收入 2 支出
					type:'',
					pageNo:1,
					pageSize:10
				},
				totalPage:1,
				refresherTriggered:false,
				swipers:[
					{time:'1',text:this.$t('match.records.today.text')},
					{time:'2',text:this.$t('match.records.yes.text')},
					{time:'3',text:this.$t('match.records.nearly7.text')}
				],
				current:0,
				tabsList: [
				    {type:0,text:this.$t("dropdown.billing.all.title.text")},
				    {type:1,text:this.$t("dropdown.billing.income.online.recharge.text")},
				    {type:2,text:this.$t("dropdown.billing.income.withdraw.text")},
				    {type:3,text:this.$t("dropdown.billing.expenditure.bet.text")},
				    {type:4,text: this.$t("dropdown.billing.income.bet.rebate.text")},
				    {type:5,text:this.$t("dropdown.billing.income.lower.level.rebate.text")},
				    {type:6,text:this.$t("dropdown.billing.income.manually.add.money.text")},
				    {type:7,text:this.$t("dropdown.billing.income.bet.cancel.text")},
				    {type:8,text:this.$t("dropdown.billing.expenditure.manual.reduction.text")},
				    {type:9,text:this.$t("dropdown.billing.expenditure.rebate.deduction.text")},
				    {type:10,text:this.$t("dropdown.billing.expenditure.online.cancel.text")},
				    {type:11,text:this.$t("dropdown.billing.income.offline.recharge.text")},
				    {type:12,text:this.$t("dropdown.billing.income.withdraw.return.text")},
				    {type:13,text:this.$t("dropdown.billing.income.bets.return.text")},
				    {type:14,text:this.$t("dropdown.billing.income.bet.back.text")},
				    {type:15,text:this.$t("dropdown.billing.income.register.gift.text")},
				    {type:16,text:this.$t("dropdown.billing.bonus.text")},
				    {type:17,text:this.$t("dropdown.billing.income.vip.cash.text")},
				    {type:18,text:this.$t("dropdown.billing.income.activity.cash.text")},
				    {type:19,text:this.$t("dropdown.billing.income.recharge.gift.text")},
				   {type:20,text: this.$t("dropdown.billing.transaction.fee.text")},
				    {type:21,text:this.$t("dropdown.billing.income.lower.level.recharge.rebate.text")},
				    {type:22,text:this.$t("dropdown.billing.income.lower.level.bet.rebate.text")},
				    {type:23,text:this.$t("dropdown.billing.income.invite.rewards.text")},
				    {type:24,text:this.$t("dropdown.billing.income.first.charge.text")},
				    {type:25,text:this.$t("dropdown.billing.income.active.profit.text")},
				    {type:26,text:this.$t("dropdown.billing.income.sufficient.reward.text")},
				    {type:27,text:this.$t("dropdown.billing.income.fixed.day.text")},
				    {type:28,text:this.$t("dropdown.billing.invite.first.charge.text")},
				    {type:29,text:this.$t("backapi.report.account.change.query.type.turntable.lottery.text")},
				    {type:30,text:this.$t("backapi.report.account.change.query.type.turntable.jackpot.text")},
				    {type:31,text:this.$t("dropdown.billing.offline.activity.text")},
				    {type:32,text:this.$t("dropdown.billing.report.score.text")},
				    {type:33,text:this.$t("dropdown.billing.redo.text")},
				    {type:34,text:this.$t("backapi.self.safe.huaz.transfer.text")},
				    {type:35,text:this.$t("backapi.report.account.change.query.type.team.motivation.text")},
				    {type:36,text:this.$t("dropdown.billing.recharge.compensation.text")}
				],
				tabCurrent: 0
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
				this.current = detail.current
				this.search.time = this.swipers[detail.current].time
				this.search.pageNo = 1
				this.records = []
				// this.loadData()
				setTimeout(this.loadData,300)
			},
			subTabCurrent(){
				setTimeout(()=>{
					if(this.tabCurrent > 0){
						this.tabCurrent
					}else{
						this.tabCurrent = 0
					}
				},600)
			},
			addTabCurrent(){
				setTimeout(()=>{
					if(this.tabCurrent >= this.tabsList.length -1){
						this.tabCurrent = this.tabsList.length - 1
					}else{
						this.tabCurrent++
					}
				},600)
			},
			changeType(event){
				let detail = event.detail
				this.tabCurrent = detail.current
				if(this.tabCurrent != 0){
					this.search.type = this.tabCurrent
					this.search.typeb = [10, 8, 2, 3, 9].includes(this.tabCurrent) ? 2 : 1;
				}else{
					this.search.type = ''
					this.search.typeb = ''
				}
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
				this.$http.post("/player/balance_change",this.search,res => {
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
			        let res = this.tabsList.find(item => item.type === value)
			        return res.text;
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
				white-space: nowrap; /* 防止文本换行 */
				overflow: hidden; /* 隐藏超出容器的内容 */
				text-overflow: ellipsis; /* 用省略号显示被修剪的文本 */
			}
			.active{
				color: #93643a;
			}
		}
	} 
	 .rocord-row{
		 width: 670upx;
		 padding: 30upx 20upx;
		 text-transform: uppercase;
		 margin:0 auto;
		 border: 1px solid #cfa05e;
		 border-radius: 40upx;
		 margin-bottom: 20upx;
		 .row{
			 display: flex;
			 justify-content: space-between;
			 align-items: center;
			 padding: 10upx 20upx;
		 }
		 .row1{
			 font-size: 32upx;
			 font-weight: bold;
			 letter-spacing: 1px;
			 word-break: break-all;
			 white-space: normal;
			 .left{
				 color: #93643a;
			 }
		 }
		 .row2{
			 font-size: 24upx;
			 letter-spacing: 1px;
			 color: #cfa05e;
		 }
		  
	 }
	 
}
</style>
