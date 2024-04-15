<template>
	<view class="user">
		<view class="top">
			<image :src="headerImg" mode="scaleToFill"></image>
			<view class="username">{{user.username}}</view>
			<view class="userid">ID:{{user.invitationCode}}</view>
		</view>
		<view class="title">{{$t('user.welcome.text')}}</view>
		<view class="wel-img" @click="goInvite">
			<img :src="welImg"/>
		</view>
		<view class="title">{{$t('user.teade.text')}}</view>
		<view class="trade">
			<view class="trade-item" v-for="(item,index) in trades" :key="index" @click="goSubPage(item)">
				<img :src="item.icon"/>
				<view class="trade-title">{{item.title}}</view>
			</view>
		</view>
		<view class="title">{{$t('user.service.text')}}</view>
		<view class="menu">
			<view class="menu-item" v-for="(item,index) in menus" :key="index" @click="goSubPage(item)">
				<view class="left">
					<uni-icons :type="item.icon" color="rgb(185,185,185)" :size="24"></uni-icons>
					<view class="menu-text">{{item.title}}</view>
				</view>
				<view class="right">
					<uni-icons type="right" color="rgb(185,185,185)"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headerImg:'../../static/images/user/10014.png',
				welImg:'../../static/images/user/10015.png',
				trades:[
					{title:this.$t('user.trade.title1.text'),icon:'../../static/images/user/10016.png',path:'./property'},
					{title:this.$t('user.trade.title2.text'),icon:'../../static/images/user/dingtou.png',path:'./investDetail'},
					{title:this.$t('user.trade.title3.text'),icon:'../../static/images/user/10017.png',path:'./income'}
				],
				menus:[
					{title:this.$t('user.menu.title1.text'),icon:'wallet',path:'./security'},
					{title:this.$t('user.menu.title2.text'),icon:'staff',path:'./myfriend'},
					{title:this.$t('user.menu.title3.text'),icon:'headphones',path:'./contract'},
					{title:this.$t('user.menu.title4.text'),icon:'gear',path:'./setting'}
				],
				user:{}
			}
		},
		onLoad() {
			this.getUserinfo()
		},
		methods: {
			getUserinfo(){
				this.$http.get('/player/player_info',res =>{
					if(res.code == 200){
						this.user = res.data
						uni.setStorageSync('user',res.data)
					}else{
						uni.showToast({
							type:'error',
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			// 邀请
			goInvite(){
				uni.navigateTo({
					url:'./invite'
				})
			},
			goSrv(){
				this.$http.get('/player/home/serv',res => {
					if(res.code == 200){
						window.location.href = res.data.serviceAddr
					}
				})
			},
			goSubPage(item){
				if(item.path=='./contract'){
					this.goSrv()
				}else{
					uni.navigateTo({
						url:item.path
					})
				}
				
			}
		}
	}
</script>

<style scoped lang="scss">
.user{
	width: 670upx;
	padding-left: 40upx;
	padding-right: 40upx;
	min-height: 100vh;
	background-image: url('../../static/images/home/10046.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	color: #fff;
	.top{
		width: 450upx;
		height: 350upx;
		margin: 0 auto;
		background-image: url('../../static/images/user/10018.png');
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
		image{
			width: 150upx;
			height: 150upx;
			margin-top: 80upx;
		}
		.username{
			font-size: 36upx;
			margin-top: 20upx;
		}
		.userid{
			font-size: 24upx;
			color: rgb(185,185,185);
		}
	}
	.title{
		font-size: 40upx;
		font-weight: 600;
		margin-top: 40upx;
	}
	.wel-img{
		width: 670upx;
		margin-top: 20upx;
		img{
			max-width: 100%;
			height: auto;
		}
	}
	.trade{
		width: 670upx;
		height: 200upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: inset 0 0 16upx 0upx $fontColor;
		margin-top: 40upx;
		.trade-item{
			width: 33%;
			display: flex;
			flex-direction: column;
			align-items: center;
			img{
				width: 80upx;
				height: 80upx;
			}
			.trade-title{
				font-size: 24upx;
				color: rgb(185,185,185);
				height: 60upx;
				display: flex;
				align-items: flex-start
			}
		}
	}
	.menu{
		color: rgb(185,185,185);
		.menu-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80upx;
			border-bottom: 1px solid #494747;
			.left{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.menu-text{
					margin-left: 20upx;
				}
			}
		}
	}
}
</style>
