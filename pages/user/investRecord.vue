<template>
	<view class="invest-record">
		<uni-nav-bar left-icon="left"  :title="$t('invest.record.page.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<scroll-view scroll-y="true" @scrolltolower="scrolltolower" style="height: 100%;"
		        @refresherrefresh="getRefresherrefresh" :refresher-enabled="false" :refresher-triggered="refresherTriggered"
		        refresher-background="transparent">
			<view class="record-list">
				 <view class="record-item" v-for="(item,index) in records" :key="index">
					 <view class="record-item-head">
						 <view class="left">
							 <view class="top">{{$t('invest.record.table.col3.text')}}</view>
							 <view class="down">{{getType(item.planType)}}</view>
						 </view>
						 <view class="right" v-if="item.status==0">
							 <view class="cal-btn" @click="calInvest(item)">{{$t('btn.caancle.text')}}</view>
						 </view>
					 </view>
					 <view class="record-item-content">
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col5.text')}}</view>
							 <view class="right" :style="{'color':item.status ==0?'#05ff00':item.status=='1'?'#ff0000':'#8B8989'}">{{getType2(item.status)}}</view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col1.text')}}</view>
							 <view class="right">$&nbsp;{{divide(item.money)}}</view>
						 </view>
						<!-- <view class="row">
							 <view class="left">{{$t('invest.record.table.col4.text')}}</view>
							 <view class="right">$&nbsp;<text>{{count(item)}}</text></view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col6.text')}}</view>
							 <view class="right">{{item.rateConf}}%</view>
						 </view> -->
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col7.text')}}</view>
							 <view class="right">{{item.id}}</view>
						 </view>
						 <view class="row">
							 <view class="left">{{$t('invest.record.table.col2.text')}}</view>
							 <view class="right">{{formatDate(item.finishTime)}}</view>
						 </view>
					 </view>
				 </view>
			</view>
		</scroll-view>
		<uni-popup ref="popup" type="bottom" background-color="#181822" borderRadius="10px,10px,0px,0px">
			<view class="popup-form">
				<uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" :label-width="300">
					<uni-forms-item :label="$t('security.update.fundpwd.label')" name="payPwd">
						<uni-easyinput type="password" prefixIcon="locked" v-model="formData.payPwd " :placeholder="$t('ruls.xxx.please',{name:$t('security.update.fundpwd.label')})" />
					</uni-forms-item>
				</uni-forms>
				<view class="prop-btn">
					<button class="cancle-btn btn" @click="closeProp">{{$t('btn.caancle.text')}}</button>
					<button class="sub-btn btn" @click="submit">{{$t('btn.continue.text')}}</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {divide,formatDate} from '@/utils/util.js'
	export default {
		data() {
			return {
				item:{
					"totalMoneyIncome": 522,
					"totalMoney": 11000,
					"totalMoneyLock": 200
				},
				divide:divide,
				formatDate:formatDate,
				records:[],
				search:{
					status:'',// 0未结束 1已结束
					time:'1',
					type:'0',//0定投 1托管
					pageNo:1,
					pageSize:10
				},
				totalPage:1,
				refresherTriggered:false,
				typeOptions: [
				    {
				        label: this.$t("invest.menu4.text"),
				        value: 0
				    },
				    {
				        label: this.$t("invest.menu1.text"),
				        value: 1
				    }
				],
				typeOptions2: [
				    {
				        label: this.$t("invest.record.status0.text"),
				        value: 0
				    },
				    {
				        label: this.$t("invest.record.status1.text"),
				        value: 1
				    },
					{
					    label: this.$t("invest.record.status2.text"),
					    value: 2
					}
				],
				formData:{
					payPwd:'',
					id:''
				},
				rules: {
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.fundpwd.label')})}
						]
					}
				},
			}
		},
		onLoad() {
			this.loadRecord()
		},
		methods: {
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					this.$http.post('/player/invest/my/stop',para,(res=>{
						if(res.code ==200){
							this.search.pageNo = 1
							this.totalPage = 1
							this.records = []
							this.loadRecord()
							this.closeProp()
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
								icon:'success'
							})
						}
					}))
				}).catch(err =>{
					console.log( err);
				})
			},
			closeProp(){
				this.formData.id= ''
				this.formData.payPwd = ''
				this.$refs.popup.close()
			},
			calInvest(item){
				this.formData.id = item.id
				this.$refs.popup.open()
			},
			scrolltolower() {
				this.loadRecord()
			},
			//下拉刷新
			getRefresherrefresh(){
				this.refresherTriggered = true
				this.search.pageNo = 1
				this.totalPage = 1
				this.records = []
				this.loadRecord()
			},
			loadRecord(){
				this.$http.post("/player/invest/my",this.search,res => {
					res = res.data
					this.records = [...this.records,...res.results]
					this.totalPage = res.totalPage;
					if (this.search.pageNo >= res.totalPage) {
						this.search.pageNo = res.totalPage + 1;
					} else {
						this.search.pageNo = this.search.pageNo + 1
					}
						
					this.refresherTriggered = false
				})
			},
			count(item){
				let rate = item.rateConf || '0'
				if(rate.indexOf('-')>-1){
					rate = rate.split('-')[1]
				}
				return (item.money * item.days * rate / 10000).toFixed(2)
			},
			getType(value) {
			   let res = this.typeOptions.find(item => item.value === value)
			   return res.label;
			},
			getType2(value) {
				let res = this.typeOptions2.find(item => item.value == value)
				return res.label;
			},
			goBack(){
				uni.navigateTo({
					url:'./investDetail'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.invest-record{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.content{
		box-shadow: inset 0 0 16upx 0upx $fontColor;
		color: #fff;
		padding: 20upx;
		.row{
			line-height: 80upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 26upx;
			.head{
				font-size: 32upx;
			}
		}
	}
	.invest-record{
		font-size: 36upx;
		color: #fff;
		font-weight: 600;
		margin-top: 20upx;
	}
	.record-list{
		 .record-item{
			 margin-top: 20upx;
			 color: #fff;
			 padding: 40upx;
			 background-color: #181822;
			 .record-item-head{
				 display: flex;
				 justify-content: space-between;
				 align-items: center;
				 .left{
					 display: flex;
					 flex-direction: column;
					 align-items: center;
					 .top{
						 font-size: 32upx;
						 font-weight: 600;
					 }
					 .down{
						 color: $fontColor;
						 font-size: 28upx;
						 margin-top: 10upx;
					 }
				 }
				.right{
					width: 150upx;
					height: 60upx;
					line-height: 60upx;
					background-color: $fontColor;
					border-radius: 16upx;
					text-align: center;
				}
			 }
			 .record-item-content{
				 margin-top: 20upx;
				 .row{
					 display: flex;
					 justify-content: space-between;
					 align-items: center;
					 font-size: 28upx;
					 .right{
						 text{
							 color:#05ff00
						 }
					 }
				 }
			 }
		 }
	}
	.popup-form{
		width: 670upx;
		padding: 40upx;
		::v-deep .uni-forms-item__label{
			color: #fff;
		}
		::v-deep .uni-easyinput__content{
			background-color: rgb(40, 44, 52)!important;
			border-color: rgb(40, 44, 52)!important;
			color: rgb(255,255,255)!important;
		}
		::v-deep .uni-icons{
			color: $fontColor!important;
		}
		.prop-btn{
			display: flex;
			justify-content: space-around;
			align-items: center;
			.btn{
				width: 40%;
				height: 70upx;
				line-height: 70upx;
				text-align: center;
				font-size: 28upx;
			}
			.cancle-btn{
				border: 1px solid $fontColor;
				background-color: transparent;
				color: #fff;
			}
			.sub-btn{
				background-color: $fontColor;
				color: #fff;
			}
		}
		 
	}
	
}
</style>
