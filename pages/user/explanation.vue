<template>
	<view class="explanation">
		<view class="page-title">
			 <view class="back" @click="goBack">
				<uni-icons type="left" color="#b57d3c" size="22"></uni-icons>
			 </view>
			{{$t('wallet.menus4.text')}}
		</view>
		<view class="content">
			<view class="tips-item" v-for="(item,index) in tips" :key="index">
				<view class="tips-item-index">{{index + 1}}</view>
				<view class="tips-item-content">{{item}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components:{ 
		},
		data() {
			return {
				 tips:[
					 this.$t('backapi.self.safe.rule.content1.text'),
					 this.$t('backapi.self.safe.rule.content2.text'),
					 this.$t('backapi.self.safe.rule.content3.text'),
					 this.$t('backapi.self.safe.rule.content4.text')
				 ]
			}
		},
		onLoad() {
		},
		methods: {
			goBack(){
				uni.navigateTo({
					url:'/pages/user/wallet'
				})
			}
			 
		}
	}
</script>

<style lang="scss" scoped>
.explanation{
	width: 670upx;
	padding: 0upx 40upx;
	.content{
	  margin-top: 150upx;
	  width: 100%;
	  min-height: 600upx;
	  border-radius: 26px;
	  border: solid 1px #cfa05e;
	  .tips-item{
		  display: flex;
		  justify-content: flex-start;
		  padding: 60upx 20upx;
		  .tips-item-index{
			  width: 120upx;
			  text-align: center;
			  color: #93643a;
		  }
		  .tips-item-content{
			  width: 500upx;
			  font-size: 24upx;
			  font-weight: bold;
			  color: #c1a374;
		  }
	  }
	}
}
</style>
