<template>
	<view class="infomation">
		<view class="title">{{$t('info.header.title')}}</view>
		<view class="swiper">
			<uni-swiper-dot :info="swipers" :current="current" field="content" :mode="mode">
				<swiper class="swiper-box" @change="change" :autoplay="true" :circular="true">
					<swiper-item v-for="(item ,index) in swipers" :key="index">
						<view class="swiper-item">
							<image :src="item.imageUrl" model="scaleToFill"></image>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
		<view class="game-tab">
			<!-- <view class="tab-bar" :class="tabIndex==1?'tab-active':''" @click="changeTab(1)">{{$t('info.menu1.title')}}
			</view> -->
			<view class="tab-bar" :class="tabIndex==2?'tab-active':''" @click="changeTab(2)">{{$t('info.menu2.title')}}
			</view>
			<view class="tab-bar" :class="tabIndex==3?'tab-active':''" @click="changeTab(3)">{{$t('info.menu3.title')}}
			</view>
			<view class="tab-bar" :class="tabIndex==4?'tab-active':''" @click="changeTab(4)">{{$t('info.menu4.title')}}
			</view>
		</view>
		<view class="match-tab" v-if="tabIndex==2">
			<view class="tab-bar" :class="matchIndex==0?'tab-active':''" @click="changeMatchTab(0)">{{$t('info.match.menu1.title')}}
			</view>
			<view class="tab-bar" :class="matchIndex==1?'tab-active':''" @click="changeMatchTab(1)">{{$t('info.match.menu2.title')}}
			</view>
			<view class="tab-bar" :class="matchIndex==2?'tab-active':''" @click="changeMatchTab(2)">{{$t('info.match.menu3.title')}}
			</view>
		</view>
		<scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 50vh;" :showScrollbar="false"
		        @refresherrefresh="getRefresherrefresh" :refresher-enabled="true" :refresher-triggered="refresherTriggered"
		        refresher-background="transparent">
				<view class="decetion" v-if="tabIndex==1">
					<view class="decetion-item" v-for="(item,index) in decetionList" :key="index" @click="goPage(item)">
						<view class="left">
							<view class="decetion-title">
								{{item.title}}
							</view>
							<view class="bottom">
								<view class="">{{$t('info.author.title')}} {{item.author}}</view>
								<view class="">{{$t('info.time.title')}} {{item.createdAt}}</view>
							</view>
						</view>
						<view class="right">
							<img :src="item.imageUrl"></img>
						</view>
					</view>
				</view>
				<view class="match" v-else-if="tabIndex==2">
					<view class="match-item" v-for="(item,index) in matchList" :key="index">
						<view class="match-time" v-if="matchIndex==0">{{formatDate(item.startTime)}}</view>
						<view class="match-time" v-else>{{formatDate(item.startTime)}} - {{formatDate(item.endTime)}}</view>
						<view class="match-content">
							<view class="left">
								<view class="team-name">{{item.main}}</view>
								<img :src="item.mainImg"/>
							</view>
							<view class="middle">
								<view class="vs">VS</view>
								<view class="score">{{item.scorea}} : {{item.scoreb}}</view>
							</view>
							<view class="right">
								<img :src="item.guestImg"/>
								<view class="team-name">{{item.guest}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="video" v-else-if="tabIndex==3">
					<view class="video-item" v-for="(item,index) in videoList" :key="index" :style="{backgroundImage:'url('+item.imageUrl+')'}">
						<image src="../../static/images/info/play.png" mode="scaleToFill" @click="showVideo(item)"></image>
						<view class="content">
							<view class="video-title">{{item.title}}</view>
							<view class="video-time">{{item.times}}</view>
						</view>
					</view>
				</view>
				<view class="trade" v-else>
					<view class="row header">
						<view class="col col1">{{$t('info.trade.col1.text')}}</view>
						<view class="col col2">{{$t('info.trade.col2.text')}}</view>
						<view class="col col3">{{$t('info.trade.col3.text')}}</view>
						<view class="col col4">{{$t('info.trade.col4.text')}}</view>
						<view class="col col5">{{$t('info.trade.col5.text')}}</view>
					</view>
					<view class="row" v-for="(item,index) in tradeList" :key="index">
						<view class="col col1">{{formatDate(item.createTime * 1000,1)}}</view>
						<view class="col col2">
							<image :src="item.image" mode="scaleToFill"></image>
						</view>
						<view class="col col3">{{item.title}}</view>
						<view class="col col4_1">+${{item.money}}</view>
						<view class="col col6">
							<view class="address">{{item.from}}</view>
							<view>/</view>
							<view class="address">{{item.to}}</view>
						</view>
					</view>
				</view>
		</scroll-view>
	</view>
</template>

<script>
	import {formatDate} from '@/utils/util.js'
	export default {
		data() {
			return {
				formatDate:formatDate,
				swipers: [{
						id: '1',
						name: '',
						imageUrl: '../../static/images/info/10005.jpeg'
					},
					{
						id: '2',
						name: '',
						imageUrl: '../../static/images/info/10006.jpeg'
					},
					{
						id: '3',
						name: '',
						imageUrl: '../../static/images/info/10007.jpeg'
					}
				],
				current: 0,
				mode: 'round',
				tabIndex: 2,
				matchIndex:0,//状态,默认0, 0.即将开始 1.进行中 2.已结束
				decetionList: [], //发现
				matchList: [],
				videoList: [
					{  
						"createdAt": "2024035",
						"title": "",
						"imageUrl": "../../static/images/info/2001.png",
						"times": "39s",
						"videoUrl": "https://www.twitch.tv/videos/1871760314",
					},
					{
						"createdAt": "2024035",
						"title": "",
						"imageUrl": "../../static/images/info/2002.png",
						"times": "42s",
						"videoUrl": "https://www.twitch.tv/videos/1871760150",
					},
					{
						"createdAt": "2024035",
						"title": "",
						"imageUrl": "../../static/images/info/2003.png",
						"times": "26s",
						"videoUrl": "https://www.twitch.tv/videos/1871759888",
					}
				],
				tradeList: [
					// {
					// 	"createTime": 1710720346000,
					// 	"title": "商品名",
					// 	"image": "../../static/images/info/10007.jpeg",
					// 	"money": "153.2",
					// 	"from": "qwerqewr",
					// 	"to": "qwerwer"
					// },
					// {
					// 	"createTime": 1710720346000,
					// 	"title": "商品名",
					// 	"image": "../../static/images/info/10007.jpeg",
					// 	"money": "153.2",
					// 	"from": "qwerqewr",
					// 	"to": "qwerwer"
					// }
				],
				cursor:'',
				pageNo: 1,
				pageSize: 10,
				totalPage:1,
				refresherTriggered:false,
			}
		},
		onLoad() {
			this.loadData()
			// this.getSwitch()
		},
		methods: {
			getSwitch(){
				const lang = uni.getLocale();
				this.$http.get('/player/home/slider?lang=' + lang,res=>{
					if(res.code==200){
						this.swipers  = res.data
					}
				})
			},
			goPage(item){
				uni.navigateTo({
					url:'./decetion',
					query:{
						id:item.id
					}
				})
			},
			scrolltolower() {
				this.pageNo++
				this.loadData()
			},
			//下拉刷新
			async getRefresherrefresh(){
				this.refresherTriggered = true
				this.pageNo = 1
				this.totalPage = 1
				this.decetionList = []
				this.matchList = []
				// this.videoList = []
				this.tradeList = []
				await  this.loadData()
				this.refresherTriggered = false
			},
			loadData(){
				if(this.tabIndex == 1){
					this.getDecetion()
				}else if(this.tabIndex == 2){
					this.getMatch()
				}else if(this.tabIndex == 3){
					this.getVideo()
				}else {
					this.getTrade()
				}
			},
			// 查询发现列表
			getDecetion(){
				let para = {
					pageNo : this.pageNo,
					pageSize : this.pageSize
				}
				this.$http.post('/player/information/decetion',para,res => {
					if(res.code == 200){
						res = res.data
						this.decetionList = [...this.decetionList, ...res.results]
						this.totalPage = res.totalPage
						if (this.pageNo >= res.totalPage) {
						    this.pageNo = res.totalPage + 1;
						} else {
						    this.pageNo = this.pageNo + 1
						}
					}
				})
			},
			// 查询发现列表
			getMatch(){
				let para = {
					pageNo : this.pageNo,
					pageSize : this.pageSize,
					status: this.matchIndex
				}
				this.$http.post('/player/information/game',para,res => {
					if(res.code == 200 && res.data){
						res = res.data
						this.matchList = [...this.matchList, ...res.results]
						this.totalPage = res.totalPage
						if (this.pageNo >= res.totalPage) {
						    this.pageNo = res.totalPage + 1;
						} else {
						    this.pageNo = this.pageNo + 1
						}
					}
				})
			},
			// 查询发现列表
			getVideo(){
				let para = {
					pageNo : this.pageNo,
					pageSize : this.pageSize
				}
				this.$http.post('/player/information/video',para,res => {
					// if(res.code == 200){
					// 	res = res.data
					// 	this.videoList = [...this.videoList, ...res.results]
					// 	this.totalPage = res.totalPage
					// 	if (this.pageNo >= res.totalPage) {
					// 	    this.pageNo = res.totalPage + 1;
					// 	} else {
					// 	    this.pageNo = this.pageNo + 1
					// 	}
					// }
				})
			},
			// 查询发现列表
			getTrade(){
				let para = {
					pageNo : this.pageNo,
					pageSize : this.pageSize,
					// cursor : this.cursor
				}
				this.$http.post('/player/information/deal',para,res => {
					if(res.code == 200){
						res = res.data
						this.tradeList = [...this.tradeList, ...res.results]
						// this.cursor = res.cursor
						this.totalPage = res.totalPage
						if (this.pageNo >= res.totalPage) {
						    this.pageNo = res.totalPage + 1;
						} else {
						    this.pageNo = this.pageNo + 1
						}
					}
				})
			},
			change(e) {
				this.current = e.detail.current;
			},
			changeTab(index) {
				this.tabIndex = index
				this.matchIndex = 0
				this.getRefresherrefresh()
			},
			changeMatchTab(index){
				this.matchIndex = index
				this.matchList = []
				this.pageNo = 1
				this.getMatch()
			},
			showVideo(item){
				if(item.videoUrl){
					window.location.href = item.videoUrl
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.infomation {
		width: 670upx;
		padding: 40upx;
		min-height: 100vh;
		background-image: url('../../static/images/home/10046.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;

		.title {
			font-size: 36upx;
			font-weight: 600;
			color: #fff;
			padding: 40upx;
		}

		.swiper {
			height: 20vh;

			::v-deep .uni-swiper__warp,
			.swiper-box {
				height: 100%;
			}

			.swiper-item {
				width: 670upx;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.game-tab {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			color: rgb(183, 186, 188);

			.tab-bar {
				width: 170upx;
				height: 100upx;
				text-align: center;
				font-size: 32upx;
				margin-top: 40upx;

			}

			.tab-active {
				color: $fontColor;
				font-size: 36upx;
				font-weight: 500;
				background-image: url('../../static/images/home/10049.png');
				background-size: 100% 100%;
			}
		}
		.decetion {
			width: 100%;

			.decetion-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 120upx;
				padding-bottom: 20upx;
				border-bottom: 1px solid rgb(22, 26, 29);
				margin-bottom: 20upx;
				.left {
					width: 420upx;

					.decetion-title {
						color: #fff;
						font-size: 28upx;
						height: 60upx;
						padding-top: 20upx;
						padding-bottom: 20upx;
						 display: -webkit-box;
						-webkit-line-clamp: 2; /* 指定显示几行 */
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.decetion-title {
					  line-height: 1.4; /* 保持合适的行高 */
					  max-height: calc(3em + (1.4 * 1 * 1rem)); /* 计算最多显示3行的高度 */
					  overflow: hidden;
					  /* 使用伪元素模拟省略号，但位置不能保证完全准确 */
					  &::after {
					    content: '...';
					    display: block;
					    margin-top: 0.5em;
					    text-align: right;
					  }
					}
					.bottom{
						display: flex;
						justify-content: space-between;
						align-items: center;
						color: rgb(185,185,185);
						font-size: 24upx;
						height: 40upx;
						padding-right: 20upx;
					}
				}

				.right {
					width: 250upx;
					height: 100%;
					display: flex;
					align-items: center;

					img {
						width: 250upx;
						height: auto;
					}
				}
			}


		}
		.match-tab {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: rgb(183, 186, 188);
			margin-top: -40upx;
			.tab-bar {
				min-width: 170upx;
				height: 100upx;
				text-align: center;
				font-size: 32upx;
				margin-top: 40upx;
		
			}
		
			.tab-active {
				color: $fontColor;
				font-size: 36upx;
				font-weight: 500;
				background-image: url('../../static/images/home/10049.png');
				background-size: 100% 100%;
			}
		}
		.match{
			.match-item{
				box-shadow: inset 0 0 16upx 0upx $fontColor;
				color: #fff;
				width: 630upx;
				padding: 20upx;
				margin-bottom: 20upx;
				.match-time{
					font-size: 26upx;
					margin-bottom: 20upx;
				}
				.match-content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 100upx;
					.middle{
						display: flex;
						flex-direction: column;
						align-items: center;
						.vs{
							color: $fontColor;
						}
					}
					.left,.right{
						width: 40%;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.team-name{
							font-size: 24upx;
							width: 180upx;
						}
						img{
							width: 60upx;
							height: auto;
						}
					}
				}
			}
		}
		.video{
			.video-item{
				background-size: 100% 100%;
				height: 320upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 40upx;
				position: relative;
				image{
					width: 120upx;
					height: 60px;
					margin-top: 100upx;
				}
				.content{
					position: absolute;
					width: 620upx;
					bottom: 20upx;
					color: #fff;
					display: flex;
					justify-content: space-between;
					font-size: 24upx;
				}
			}
		}
		.trade{
			.header{
				border-bottom: 1px solid $fontColor!important;
			}
			.row{
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #fff;
				padding-top: 10upx;
				padding-bottom: 10upx;
				border-bottom: 1px solid rgb(23,26,29);
				.col{
					text-align: center;
					font-size: 26upx;
				}
				.col1{
					width: 120upx;
				}
				.col2{
					width: 100upx;
					image{
						width: 80upx;
						height: 50upx;
					}
				}
				.col3{
					width: 150upx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.col4{
					width: 130upx;
				}
				.col4_1{
					width: 130upx;
					color: green;
				}
				.col5{
					width: 150upx;
				}
				.col6{
					width: 150upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.address{
						width: 70upx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
</style>