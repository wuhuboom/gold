<template>
	<view class="myfriends">
		<uni-nav-bar left-icon="left"  :title="$t('user.menu.title2.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="top">
			<view class="header">
				<view class="left">{{$t('myfriends.header.title')}}</view>
				<view class="right">{{ranking}}</view>
			</view>
			<view class="rank" v-for="(item,index) in ranks" :key="index">
				<view class="title">
					<view class="left">{{$t('myfriends.rank.title')}}</view>
					<view class="right">{{item.currency}}</view>
				</view>
				<view class="content">
					<view class="left">
						<view class="up">
							{{$t('myfriends.rank.invest.title')}}
						</view>
						<view class="bottom" @click="showInvest(item)">
							<view>{{divide(item.me)}}</view>
							<uni-icons type="right" color="fff"></uni-icons>
						</view>
					</view>
					<view class="right">
						<view class="up">
							{{$t('myfriends.rank.friend.title')}}
						</view>
						<view class="bottom" @click="showTeam(item)">
							<text>{{item.friends}}</text>
							<uni-icons type="right" color="fff"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="friends">
			<view class="header"  @click="showFriend">
				<view class="ttile">{{$t('myfriends.income.title')}}</view>
				<uni-icons type="right" color="#fff"></uni-icons>
			</view>
			<view class="row">
				<view class="row-item">
					<view class="title">
						{{$t('myfriends.income.total.text')}}
					</view>
					<view class="num">
						{{divide(income.me)}}
					</view>
				</view>
			</view>
			<view class="row">
				<view class="row-item">
					<view class="title">
						{{$t('myfriends.income.friend.total.text')}}
					</view>
					<view class="num">
						{{income.friends}}
					</view>
				</view>
				<view class="row-item">
					<view class="title align-r">
						{{$t('myfriends.income.friend.num.text')}}
					</view>
					<view class="num align-r">
						{{income.friendsCount}}
					</view>
				</view>
			</view>
			<view class="row">
				<view class="row-item">
					<view class="title">
						{{$t('myfriends.income.qmfriend.total.text')}}
					</view>
					<view class="num">
						{{income.friends}}
					</view>
				</view>
				<view class="row-item">
					<view class="title align-r">
						{{$t('myfriends.income.qmfriend.num.text')}}
					</view>
					<view class="num align-r">
						{{income.friendsCount}}
					</view>
				</view>
			</view>
			 
		</view>
	</view>
</template>

<script>
	import {divide100} from '@/utils/util.js'
	export default {
		data() {
			return {
				divide:divide100,
				ranking:'',//排名
				income:{
					"me": '我的总投资',
					"friendsCount": '总朋友数',
					"friends": '朋友总投资'
				},//总投资
				ranks:[
					{
					"me": '100',
					"currency": "USD",
					"friends": 200,
					"cid": 1
					},
					{
					"me": null,
					"currency": "USDT",
					"friends": null,
					"cid": 2
					}
				]
			}
		},
		onLoad() {
			this.loadRanks()
			this.loadIncome()
		},
		methods: {
			// 总投资
			loadIncome(){
				this.$http.get('/player/invest/my/friends/total',res=>{
					if(res.code == 200){
						this.income = res.data
					}
				})
			},
			//我的投资-我的朋友-收益
			loadRanks(){
				this.$http.get('/player/invest/my/friends',res=>{
					if(res.code == 200){
						this.ranks = res.data
					}
				})
			},
			showFriend(){
				uni.navigateTo({
					url:'./friendlist'
				})
			},
			showInvest(item){
				let money = item.me || 0
				uni.navigateTo({
					url:'./friendIncomInvest?money='+money+'&cid='+item.cid
				})
			},
			showTeam(item){
				let money = item.friends || 0
				uni.navigateTo({
					url:'./friendIncomeTeam?money='+money+'&cid='+item.cid
				})
			},
			goBack(){
				uni.switchTab({
					url:'/pages/user/user'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.myfriends{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.top{
		box-shadow: inset 0 0 16upx 0upx $fontColor;
		color: #fff;
		padding: 30upx;
		border-radius: 20upx;
		.header{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.right{
				color: $fontColor;
			}
		}
		.rank{
			margin-top: 20upx;
			.title{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.content{
				display: flex;
				justify-content: space-between;
				margin-top: 20upx;
				.left,.right{
					width: 40%;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					background-color: $fontColor;
					border-radius: 10upx;
					padding: 20upx;
					 .bottom{
						 width: 100%;
						 display: flex;
						 align-items: center;
						 justify-content: space-between;
					 }
				}
			}
		}
	}
	.friends{
		box-shadow: inset 0 0 16upx 0upx $fontColor;
		color: #fff;
		padding: 30upx;
		border-radius: 20upx;
		margin-top: 60upx;
		.header{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20upx;
			.title{
				font-size: 36upx;
				font-weight: 500;
			}
		}
		.row{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30upx;
			.row-item{
				width: 45%;
				display: flex;
				flex-direction: column;
				.title{
					color: rgb(185,185,185);
					font-size: 26upx;
					margin-bottom: 10upx;
				}
				.align-r{
					text-align: right;
				}
			}
		}
	}
}
</style>
