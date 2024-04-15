<template>
	<view class="game-tools">
		<uni-nav-bar left-icon="left"  :title="$t('user.trade.title2.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		
		<view class="content">
			<view class="plan-item" v-for="(item,index) in plans" :key="index">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				plans:[
					{
					"id": 3,
					"cid": '关联货币ID',
					"name": '项目名称',
					"imgUrl": '图标',
					"incomeType": 0, //结算方式 0.每日结算 1.到期结算,
					"periodical": 1,//是否定期 0否 1是,
					"currency": {
						"id": 1,
						"name": "货币名称",
						"imgUrl": "货币图标",
						},
					"rateConfig": [{"days":'投资天数',"rate":'日利率',"min":'起投',"max":'止投'}],
					}
				]
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData(){
				this.$http.post('/player/invest/plans',{},res => {
					if(res.code == 200){
						this.plans = res.data
					}
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
.game-tools{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
}
</style>
