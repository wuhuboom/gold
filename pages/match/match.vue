<template>
	<view class="match">
		<view class="page-title">
			{{$t('page.match.title')}}
		</view>
		 <uni-search-bar v-model="search.teamName" @blur="searchData" :placeholder="$t('match.search.text')" :radius="10" bgColor="#dde0e8" textColor="#c1a374" cancelButton="none"></uni-search-bar>
		 <view class="tab-bar">
			 <view class="tab-item" v-for="(item,index) in tabs" :key="index"  @click="selectData(item.id)">{{item.name}}</view>
		 </view>
		 <scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 90vh"
		         @refresherrefresh="getRefresherrefresh" :refresher-enabled="false" :refresher-triggered="refresherTriggered"
		         refresher-background="transparent">
		 	 <view class="records">
				 <view class="record-item" v-for="(item,index) in records" :key="index">
						 <view class="match-item-title">
							 {{item.allianceName}}
						 </view>
						 <view class="match-item-content">
							 <view class="team-info">
								 <img :src="item.mainLogo"/>
								 <view class="team-name">{{item.mainName}}</view>
							 </view>
							 <view class="match-symbol">VS</view>
							 <view class="team-info">
								 <img :src="item.guestLogo"/>
								 <view class="team-name">{{item.guestName}}</view>
							 </view>
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
					startTime:1,// 1今天(用bets/today)，2昨天，3近7日，4近10日，5近30日
					status: 0,
					teamName: '',
					pageNo:1,
					pageSize:10
				},
				totalPage:1,
				refresherTriggered:false,
				tabs:[
					{id:0,name:this.$t('match.all.text')},
					{id:1,name:this.$t('match.today.text')},
					{id:2,name:this.$t('match.tomorrow.text')}
				]
			}
		},
		onShow() {
			this.records = []
			this.$store.dispatch('getUserInfo')
			this.selectData(0)
		},
		methods: {
			searchData(){
				// if(!this.search.teamName) return
				this.search.pageNo = 1
				this.totalPage = 1
				this.records = []
				this.loadData()
			},
			selectData(id){
				this.search.startTime = id
				this.search.pageNo = 1
				this.totalPage = 1
				this.records = []
				this.loadData()
			},
			scrolltolower() {
				if(this.search.pageNo > this.totalPage){
					return
				}
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
				let url = '/player/game'
				this.$http.post(url,this.search,res=>{
					if(res.code==200){
						let datas = res.data.results || []
						this.records = [...this.records,...datas]
						this.totalPage = res.data.totalPage;
						if (this.search.pageNo >= res.data.totalPage) {
						    this.search.pageNo = res.data.totalPage + 1;
						} else {
						    this.search.pageNo = this.search.pageNo + 1
						}
						this.refresherTriggered = false
					}
				})
			}
		}
			 
	}
</script>

<style scoped lang="scss">
.match{
	 width: 670upx;
	 height: 100vh;
	 padding-left: 40upx;
	 padding-right: 40upx;
	 ::v-deep .uni-searchbar__box{
		 border: 1px solid #a5a5a5;
	 }
	 ::v-deep .uniui-search{
		 color: #82502b!important;
	 }
	 ::v-deep .uni-input-placeholder{
		  color: #82502b!important;
	 }
	 .tab-bar{
		 display: flex;
		 justify-content: space-between;
		 align-items: center;
		 margin-bottom: 40upx;
		 .tab-item{
			 width: 33%;
			 font-size: 24upx;
			font-weight: bold;
			   line-height: 2;
			   letter-spacing: 1px;
			   color: #c1a374;
			   text-align: center;
		 }
	 }
	 .records{
		 .record-item{
			 display: flex;
			 flex-direction: column;
			 align-items: center;
			 margin-bottom: 60upx;
			.match-item-title{
				font-size: 28upx;
				font-weight: bold;
				line-height: 1.31;
				letter-spacing: 1.56px;
				color: #93643a;
			} 
			.match-item-content{
				display: flex;
				justify-content: space-around;
				align-items: center;
				border-radius: 26px;
				border: solid 1px #cfa05e;
				padding: 20upx;
				width: 600upx;
				margin-top: 10upx;
				.team-info{
					width: 40%;
					display: flex;
					flex-direction: column;
					align-items: center;
					img{
						width: 60upx;
						height: auto;
					}
					.team-name{
					  font-size: 24upx;
					  font-weight: bold;
					  line-height: 2;
					  letter-spacing: 1px;
					   color: #c1a374;
					   white-space: nowrap;
					   overflow: hidden;
					   text-overflow:ellipsis;
					}
				}
				.match-symbol{
					font-size: 28upx;
					font-weight: bold;
					letter-spacing: 1.56px;
					color: #93643a;
				}
			}
		 }
	 }
}
</style>
