<template>
	<view class="decetion">
		<uni-nav-bar left-icon="left"  :title="$t('home.notice.page.title')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				item:{},
				id:''
			}
		},
		onLoad(option) {
			this.id = option.id
			this.loadData()
		},
		methods: {
			loadData(){
				let url = '/player/information/decetion/' + this.id
				this.$http.get(url,res => {
					this.item = res.data
				})
			},
			goBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.decetion{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
}
</style>
