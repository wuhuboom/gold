<template>
	<view class="friendlist">
		<uni-nav-bar left-icon="left"  :title="$t('user.menu.title2.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="content">
			<view class="row header">
				<view class="col col1">{{$t('myfriends.list.col1.text')}}</view>
				<view class="col col2">{{$t('myfriends.list.col2.text')}}</view>
				<view class="col col3">{{$t('myfriends.list.col3.text')}}</view>
				<view class="col col4">{{$t('myfriends.list.col4.text')}}</view>
				<view class="col col5">{{$t('myfriends.list.col5.text')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			}
		},
		methods: {
			goBack(){
				uni.navigateTo({
					url:'./myfriend'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.friendlist{
	width: 710upx;
	min-height: 100vh;
	padding: 20upx;
	.content{
		.header{
			border-bottom: 1px solid $fontColor;
		}
		.row{
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #fff;
			padding-top: 10upx;
			padding-bottom: 10upx;
			.col{
				text-align: center;
				font-size: 26upx;
			}
			.col1{
				width: 200upx;
			}
			.col2{
				width: 150upx;
			}
			.col3{
				width: 120upx;
			}
			.col4{
				width: 120upx;
			}
			.col5{
				width: 120upx;
			}
		}
	}
}
</style>
