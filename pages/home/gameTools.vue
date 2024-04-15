<template>
	<view class="game-tools">
		<uni-nav-bar left-icon="left"  :title="$t('home.game.tool.title.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="game">
			<view class="swiper-item" v-for="(item ,index) in games" :key="index" @click="showDetail(item)">
				<view class="img-bg">
					<!-- <image :src="item.path" model="aspectFill"></image> -->
					<img :src="item.img"/>
				</view>
				<view class="game-tools-title">{{item.name}}</view>
				<view class="game-tools-money">{{item.price}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				games:[]
			}
		},
		onLoad() {
			this.games = require('@/static/data/props.json')
		},
		methods: {
			goBack(){
				uni.switchTab({
					url:'/pages/home/home'
				})
			},
			showDetail(item){
				uni.navigateTo({
					url:'/pages/home/gameToolsDetai?id=' + item.id,
					
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.game-tools{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.game{
		width: 670upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.swiper-item{
				width: 45%;
				color: #fff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top: 60upx;
				.img-bg{
					background-image: url('../../static/images/home/10048.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 320upx;
					height: 18vh;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: -100upx;
					img{
						max-width: 150upx;
						height: auto;
					}
				}
				.game-tools-title{
					text-align: center;
					font-size: 24upx;
					height: 50upx;
				}
				.game-tools-money{
					height: 4vh;
					background-color: rgb(23, 23, 23);
					color: rgb(250, 217, 167);
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 30upx;
					margin-top: 30upx;
					padding-left: 30upx;
					padding-right: 30upx;
					min-width: 100upx;
				}
			}
	} 
	
}
</style>
