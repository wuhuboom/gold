<template>
	<view class="contract">
		<uni-nav-bar left-icon="left"  :title="$t('user.menu.title3.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="content">
			<img src="../../static/images/user/contract.png" mode="scaleToFill"/>
			<view class="email">{{email}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				email:'123123@safa.com'
			}
		},
		methods: {
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.contract{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.content{
		position: absolute;
		bottom: 300upx;
		color: #fff;
		height: 400upx;
		width: 100%;
		margin: 0 auto;
		display: flex;
		align-items: center;
		flex-direction: column;
		image{
			width: 200upx;
			height: auto;
		}
	}
}
</style>
