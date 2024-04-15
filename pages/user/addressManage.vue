<template>
	<view class="address">
		<uni-nav-bar left-icon="left"  :title="$t('withdraw.payway.address.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="address-content">
			<view class="title">{{$t('withdraw.record.title.text')}}</view>
			<view class="address-item" v-for="(item,index) in usdts" :key="index">
				<image src="../../static/images/user/icon2.webp" mode="scaleToFill"></image>
				<view class="content">
					<view class="up">{{item.addr}}</view>
					<view class="down">{{$t('withdraw.record.time.text')}} {{formatDate(item.createdAt,2)}}</view>
				</view>
				<view class="right">
					<view class="edit" @click="editAddr(item)">
						<image src="../../static/images/user/edit2.webp" mode="scaleToFill"></image>
					</view>
					<view class="delete" @click="delAddr(item)">{{$t('btn.del.text')}}</view>
				</view>
			</view>
		</view>
		<view class="add-box" @click="addAddr">
			{{$t('withdraw.noway.cidadd.text')}}
		</view>
	</view>
</template>

<script>
	import {formatDate} from '@/utils/util.js'
	export default {
		data() {
			return {
				usdts:[],
				formatDate:formatDate
			}
		},
		onLoad() {
			this.getUsdtList()
		},
		methods: {
			addAddr(){
				uni.navigateTo({
					url:'./addressAdd'
				})
			},
			editAddr(item){
				uni.navigateTo({
					url:'./addressEdit?id='+item.id+"&addr="+item.addr
				})
			},
			delAddr(item){
				let para = {
					id : item.id
				}
				this.$http.post('/player/virtual_currency_del',para,res=>{
					if(res.code == 200){
						this.getUsdtList()
						uni.showToast({
							title:this.$t('oper.tip.success.text'),
							icon:'success',
							duration:2000
						})
					}
				})
			},
			getUsdtList(){
				this.$http.post('/player/virtual_currency_list',{},res=>{
					this.usdts = res.data
				})
			},
			goBack(){
				uni.navigateTo({
					url:'./withdraw'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.address{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.address-content{
		color: #fff;
		.title{
		  font-size: 32upx;
		  font-weight: 500;
		  line-height: 60upx;
		}
		.address-item{
		  display: flex;
		  justify-content: space-between;
		  align-items: center;
		  background-color: #2a2937;
		  border-radius: 20upx;
		  padding: 20upx 20upx;
		  margin-top: 20upx;
		  image{
			  width: 120upx;
			  height: 120upx;
		  }
		  .content{
			 .down{
				 margin-top: 20upx;
			 }
		  }
		  .right{
			  display: flex;
			  flex-direction: column;
			  justify-content: space-between;
			  align-items: flex-end;
			  image{
				  width: 60upx;
				  height: 60upx;
			  }
			  .delete{
				  width: 120upx;
				  height: 50upx;
				  background-color: $fontColor;
				  color: #fff;
				  display: flex;
				  align-items: center;
				  justify-content: center;
				  border-radius: 20upx;
			  }
		  }
		}
	
	}
	.add-box{
		border: 1px solid #fff;
		color: #fff;
		text-align: center;
		height: 100upx;
		line-height: 100upx;
		border-radius: 20upx;
		position: absolute;
		bottom: 100upx;
		width: 670upx;
	}
}
</style>
