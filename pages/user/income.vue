<template>
	<view class="income">
		<uni-nav-bar left-icon="left"  :title="$t('user.trade.title3.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="container">
			<view class="coin-box">
				<view class="coin-item" :class="cid==item.cid?'active':''" v-for="(item,index) in usdts" :key="index" @click="choose(item.cid)">{{item.currency.name}}</view>
			</view>
			<echarts ref="echarts" :option="option" canvasId="echarts" style="width: 100%;height: 100%;"></echarts>
		</view>
	</view>
</template>

<script>
	import echarts from '@/components/echarts-uniapp/echarts-uniapp.vue'
	import {formatDate} from '@/utils/util.js'
	export default {
		components:{
			echarts
		},
		data() {
			return {
				usdts:'',
				cid:'',
				formatDate:formatDate,
				option : {
						backgroundColor: "transparent",
						tooltip:{
							trigger:'axis',
							textStyle:{
								color:'#fff'
							},
							backgroundColor:'rgb(41,41,55)'
						},
						 xAxis: {
						    type: 'category',
						    boundaryGap: false,
						    data: []
						  },
						  yAxis: {
						    type: 'value'
						  },
						  series: [
						    {
						      data: [],
						      type: 'line',
							  itemStyle:{
								color:'#04D3D5'
							  },
							  lineStyle:{
								color:'#04D3D5'  
							  },
						      areaStyle: {
								  color:'#04D3D5'
							  }
						    }
						  ]	
				}
			}
		},
		onReady() {
			this.getCurrency()
		},
		 
		methods: {
			initChar(){
				this.$refs['echarts'].initChart(this.option)
			},
			choose(cid){
				this.cid = cid
				this.loadData()
			},
			getCurrency(){
				this.$http.get('/player/currency/list',res=>{
					if(res.code == 200){
						this.usdts = res.data.list || []
						this.cid = this.usdts[0].cid
						this.loadData()
					}
				})
			},
			loadData(){
				let para = {
					id:this.cid
				}
				this.$http.post('/player/invest/my/statis',para,res => {
					if(res.code ==200){
						let times = res.data.times || []
						times = times.map(item=>{
							return formatDate(item,2)
						})
						this.option.xAxis.data = times
						this.option.series[0].data = res.data.values || []
						this.initChar(this.option)
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
.income{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.container{
		width: 670upx;
		height: 500upx;
		margin: 0 auto;
		.coin-box{
			display: flex;
			align-items: center;
			height: 80upx;
			color: #fff;
			.coin-item{
				width: 150upx;
				text-align: center;
				border-bottom: 1px solid #717171;
				padding-bottom: 20upx;
			}
			.active{
				color: $fontColor;
				border-bottom: 2px solid $fontColor;
			}
		}
		
	}
}
</style>
