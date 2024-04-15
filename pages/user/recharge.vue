<template>
	<view class="recharge">
		<uni-nav-bar left-icon="left"  :title="$t('property.subpage.title1')" background-color="rgb(1,2,3)" color="#fff" :border="false" right-icon="icon-record" @clickLeft="goBack" @clickRight="goRecord">
			<view slot="right">
				<uni-icons custom-prefix="iconfont" type="icon-record" size="22" color="#fff"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="title">{{$t('recharge.payway.title')}}</view>
		
		<view class="payways">
			 <view class="way-item" v-for="(item,index) in payways" :key="index" @click="chooseItem(item,index)">
			 	<image :src="item.img" mode="scaleToFill"></image>
			 	<view class="way-item-text">{{item.currencySymbol}}</view>
				<view class="active" v-if="selIndex == index"></view>
			 </view>
		</view>
		<view class="form">
			<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top">
				<uni-forms-item :label="$t('recharge.money.text')" name="money">
					<uni-easyinput type="text" v-model="formData.money" :placeholder="$t('ruls.xxx.please',{name:$t('recharge.money.text')})" />
				</uni-forms-item>
			</uni-forms>
			<button class="btn" @click="submit">{{$t('btn.continue.text')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				formData:{
					money:'',
					payId:''
				},
				rules: {
					money: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('recharge.money.text')})}
						]
					}
				},
				payways:[
					  // {
					  //   "img": "https://img.sgodown.cc/bankCharge.png",
					  //   "fast": "200",
					  //   "unholdMsg": "invalid",
					  //   "def": 0,
					  //   "rate": "1",
					  //   "name": "INPAY",
					  //   "minMax": "100-99999",
					  //   "currencySymbol": "USDT",
					  //   "id": 6,
					  //   "sort": 0,
					  //   "type": 64,
					  //   "unhold": 0
					  // }
				],
				sectItem:{},
				selIndex:0
			}
		},
		onLoad() {
			this.loadPayWays()
			this.sectItem = this.payways[0] || {}
		},
		methods: {
			chooseItem(item,index){
				this.selIndex = index
				this.sectItem = item
			},
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = {
						money : this.formData.money,
						payId : this.sectItem.id
					}
					this.$http.post('/player/recharge',para,(res=>{
						console.log(res,'---------')
						if(res.code ==200){
							res = res.data
							if (res.UrlAddress) {
								location.href = res?.UrlAddress
							}
						}
					}))
				}).catch(err =>{
					console.log(err);
				})
			},
			loadPayWays(){
				this.$http.get('/player/recharge_pre',res => {
					if(res.code==200){
						this.payways = res.data
					}
					this.sectItem = this.payways[0] || {}
				})
			},
			changeWay(item){
				this.sectItem = item
				this.isShow = ! this.isShow
			},
			goRecord(){
				uni.navigateTo({
					url:'./inrecord'
				})
			},
			goBack(){
				uni.navigateTo({
					url:'./property'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.recharge{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.title{
		color: #fff;
		font-size: 36upx;
		margin-top: 20upx;
	}
	.payways{
		margin-top: 20upx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.way-item{
			 display: flex;
			 flex-direction: column;
			 align-items: center;
			 justify-content: center;
			 height: 170upx;
			 width: 320upx;
			 border-radius: 30upx;
			 border: 1px solid $fontColor;
			 background-color: #002c2c;
			 margin-bottom: 20upx;
			 position: relative;
			 image{
				 width: 60upx;
				 height: 60upx;
			 }
			 .way-item-text{
				 font-size: 32upx;
				 color: #fff;
			 }
			 .active{
				 background-image: url('../../static/images/user/check.webp');
				 background-size: 100% 100%;
				 width: 50upx;
				 height: 40upx;
				 position: absolute;
				 top: 0upx;
				 right: 0upx;
			 }
		}
	}
	.form{
		width: 670upx;
		margin-top: 20upx;
		::v-deep .uni-forms-item__label{
			color: #fff;
		}
		::v-deep .uni-easyinput__content{
			background-color: rgb(41,41,55)!important;
			border-color: rgb(41,41,55)!important;
			color: rgb(255,255,255)!important;
		}
		::v-deep .uni-icons{
			color: $fontColor!important;
		}
		.btn{
			background-color: $fontColor;
			color: #fff;
		}
		.forget-box{
			display: flex;
			justify-content: end;
			color: #fff;
			margin-bottom: 40upx;
			.reset{
				color: $fontColor;
			}
		}
	}
	
}
</style>
