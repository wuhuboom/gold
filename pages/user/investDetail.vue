<template>
	<view class="invest-detail">
		<uni-nav-bar left-icon="left"  :title="$t('invest.detail.page.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" right-icon="icon-record" @clickLeft="goBack" @clickRight="goRecord">
			<view slot="right">
				<uni-icons custom-prefix="iconfont" type="icon-record" size="22" color="#fff"></uni-icons>
			</view>
		</uni-nav-bar>
		<view class="top">
			 <img :src="detail.imgUrl"/>
		</view>
		<view class="content">
			 <view class="detail">
				 <view class="title">{{detail.currency.name}}</view>
				 <view class="sub-title">
					 <view class="left">{{$t('invest.detail.nian.text')}} <text>{{detail.currency.rate}}%</text> </view>
					<view class="right">{{$t('invest.detail.rate.text')}} <text>{{detail.currency.rate}}%</text> </view>
				 </view>
				 <view class="dtqx">
					 <view class="title">
						 <uni-icons custom-prefix="iconfont" type="icon-jiesuanfangshi" size="18" color="#fff"></uni-icons>
						 <view class="data">{{$t('invest.detail.qixian.text')}}</view>
					 </view>
					<view class="day-box">
						<view class="day" :class="index==dayIndex?'active':''" v-for="(item,index) in detail.rateConfig" :key="index" @click="chooseRate(item,index)">
							 {{item.days}}
						</view>
					</view>
				 </view>
				 <view class="form">
					 <uni-forms ref="form" :modelValue="formData" :rules="rules" label-position="top" :label-width="300">
					 	<uni-forms-item :label="$t('invest.detail.num.text')" name="money">
					 		<view class="form-item">
					 			<view class="left">
					 				<uni-easyinput type="text" v-model="formData.money " :placeholder="$t('invest.detail.enternum.text')" />
					 			</view>
					 			<view class="right">
					 				<view class="playername">{{detail.currency.name}}</view>
					 				<view class="max" @click="setAll">{{$t('invest.detail.enter.max.text')}}</view>
					 			</view>
					 		</view>
					 		<view class="form-tips">
					 			<view class="tips-left">{{$t('invest.detail.enable.text')}}:{{divide(this.balance.totalBalance)}}</view>
					 		</view>
							<view class="form-item-box ">
								<view class="form-item-box-item">
									<view class="num">{{dayItem.min}}</view>
									<view class="title">{{$t('invest.detail.dt.num.text')}}</view>
								</view>
								<view class="divider"></view>
								<view class="form-item-box-item">
									<view class="num">{{dayItem.max}}</view>
									<view class="title">{{$t('invest.detail.dt.edu.text')}}</view>
								</view>
							</view>
					 	</uni-forms-item>
					 	<uni-forms-item :label="$t('security.update.fundpwd.label')" name="payPwd">
					 		<view class="form-item">
								<uni-easyinput type="password" prefixIcon="locked" v-model="formData.payPwd" :placeholder="$t('ruls.xxx.please',{name:$t('security.update.fundpwd.label')})" />
							</view>
					 	</uni-forms-item>
					 </uni-forms>
					 <button class="btn" @click="submit">{{$t('btn.join.text')}}</button>
				 </view>
			 </view>
			 <!--定投详情-->
			 <view class="title">{{$t('invest.detail.page.text')}}</view>
			 <view class="detail-box">
				 <view class="detail-box-item">
					 <view class="up">{{detail.currency.name}}</view>
					 <view class="down">{{$t('invest.detail.dt.tonz.text')}}</view>
				 </view>
				 <view class="divider"></view>
				 <view class="detail-box-item">
						 <view class="up">{{detail.name}}</view>
						 <view class="down">{{$t('invest.detail.dt.tonz.text')}}</view>
				 </view>
				  <view class="divider"></view>
				 <view class="detail-box-item">
						 <view class="up">{{detail.currency.rate}}%</view>
						 <view class="down">{{$t('invest.detail.dt.flv.text')}}</view>
				 </view>
			 </view>
			 <!--规则-->
			  <view class="title">{{$t('invest.detail.dt.rule.text')}}</view>
			  <view class="rule-box">
				  <view class="rule-top">
						<view class="rule-top-title">
							<uni-icons custom-prefix="iconfont" type="icon-icon_dashboard_release" size="16" color="#fff"></uni-icons>
							<view class="rule-top-title-tip">{{$t('invest.detail.dt.rule1.text')}}</view>
						</view>
						<img src="../../static/images/user/down.png"/>
						<view class="rule-top-title">
							<uni-icons custom-prefix="iconfont" type="icon-kaishishijian" size="14" color="#fff"></uni-icons>
							<view class="rule-top-title-tip">{{$t('invest.detail.dt.rule2.text')}}</view>
						</view>
						<img src="../../static/images/user/down.png"/>
						<view class="rule-top-title">
							<uni-icons custom-prefix="iconfont" type="icon-jiesuo" size="16" color="#fff"></uni-icons>
							<view class="rule-top-title-tip">{{$t('invest.detail.dt.rule3.text')}}</view>
						</view>
					   
				  </view>
				  <view class="rule-content">
					  <view class="rule-item">
						  <view class="rule-item-title">{{$t('invest.detail.rule.titl1.text')}}</view>
						  <view class="tips">{{$t('invest.detail.rule.tip1.text')}}</view>
					  </view>
					  <view class="rule-item">
						  <view class="rule-item-title">{{$t('invest.detail.rule.titl2.text')}}</view>
						  <view class="tips">{{$t('invest.detail.rule.tip2.text')}}</view>
					  </view>
					  <view class="rule-item">
						  <view class="rule-item-title">{{$t('invest.detail.rule.titl3.text')}}</view>
						  <view class="tips">{{$t('invest.detail.rule.tip3.text')}}</view>
					  </view>
					  <view class="rule-item">
						  <view class="rule-item-title">{{$t('invest.detail.rule.titl4.text')}}</view>
						  <view class="tips">{{$t('invest.detail.rule.tip4.text')}}</view>
					  </view>
					  <view class="rule-item">
						  <view class="title">{{$t('invest.detail.rule.titl5.text')}}</view>
						  <view class="tips">{{$t('invest.detail.info.tip1.text')}}</view>
					  </view>
				  </view>
			  </view>
			  <!--介绍-->
			   <view class="title">{{$t('invest.detail.dt.info.text')}}</view>
			   <view class="info-box">
				   <view class="info-item">{{$t('invest.detail.info.tip2.text')}}</view>
				   <view class="info-item">{{$t('invest.detail.info.tip3.text')}}</view>
				   <view class="info-item">{{$t('invest.detail.info.tip4.text')}}</view>
				   <view class="info-item">{{$t('invest.detail.info.tip5.text')}}</view>
			   </view>
		</view>
	</view>
</template>

<script>
	import {divide, divide100} from '@/utils/util.js'
	export default {
		data() {
			return {
				divide:divide100,
				balance:{},
				detail:{
					id: 3,
					cid: 'USDT',
					name: '项目名称',
					imgUrl: '../../static/images/user/10019.png',
					incomeType: 0, //结算方式 0.每日结算 1.到期结算,
					periodical: 1,//是否定期 0否 1是,
					currency: {
						id: 1,
						name: "货币名称",
						imgUrl: "货币图标",
					},
					rateConfig: [
						{days:'14',rate:'10',min:'70.45212',max:'705.35212'},
						{days:'28',rate:'10',min:'70.45212',max:'720.6325'},
						{days:'56',rate:'10',min:'70.5262',max:'730.252122'},
						{days:'168',rate:'10',min:'100',max:'200'}
					]
				},
				dayIndex:0,
				dayItem:{},
				formData:{
					planId:'',
					money :'',
					payPwd :''
				},
				rules: {
					 money: {
					 	rules: [
					 		{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('invest.money.text')})}
					 	]
					 },
					payPwd: {
						rules: [
							{required: true,errorMessage: this.$t('ruls.xxx.empty',{name:this.$t('security.update.fundpwd.label')})}
						]
					}
				},
			}
		},
		onLoad() {
			this.loadData()
			this.getCurrency()
		},
		methods: {
			submit(){
				this.$refs.form.validate().then(res=>{
					const para = Object.assign({},this.formData)
					para.planId = this.detail.id
					para.days = this.dayItem.days
					this.$http.post('/player/invest',para,(res=>{
						if(res.code ==200){
							this.formData.planId = ''
							this.formData.money = ''
							this.formData.payPwd = ''
							uni.showToast({
								title:this.$t('oper.tip.success.text'),
								icon:'success',
							})
						}
					}))
				}).catch(err =>{
					console.log( err);
				})
			},
			setAll(){
				let money = divide100(this.balance.totalBalance)
				if(money > this.dayItem.max){
					money = this.dayItem.max
				}
				this.formData.money = money
			},
			getCurrency(){
				this.$http.get('/player/currency/list',res=>{
					if(res.code == 200){
						this.balance = res.data
					}
				})
			},
			chooseRate(item,index){
				this.dayIndex = index
				this.dayItem = this.detail.rateConfig[this.dayIndex]
			},
			loadData(){
				this.$http.post('/player/invest/plan',{},res => {
					if(res.code == 200){
						this.detail = res.data
						const config = JSON.parse(res.data.rateConfig || '')
						this.detail.rateConfig = config
						let imgUrl ='../../static/images/user/10019.png'
						if(!this.detail.imgUrl){
							this.detail.imgUrl = imgUrl
						}
						 this.dayItem = this.detail.rateConfig[this.dayIndex]
					}
				})
			},
			goRecord(){
				uni.navigateTo({
					url:'./investRecord'
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
.invest-detail{
	width: 710upx;
	min-height: 100vh;
	padding: 0upx 20upx;
	.top{
		width: 400upx;
		height: 400upx;
		margin: 0 auto;
		background-image: url('../../static/images/user/10021.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
		img{
			width: 60%;
			height: auto;
			margin-top: 10upx;
		}
	}
	.content{
		background-image: url('../../static/images/user/10022.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 670upx;
		color: #fff;
		padding: 40upx 20upx;
		margin-top: 40upx;
		.detail{
			.tilte{
				font-size: 30upx;
			}
			.sub-title{
				margin-top: 20upx;
				padding-bottom: 20upx;
				border-bottom: 1px solid rgb(51,51,51);
				width: 100%;
				font-size: 26upx;
				display: flex;
				.left{
					margin-right: 30upx;
				}
			}
			.dtqx{
				margin-top: 20upx;
				.title{
					font-size: 28upx;
					display: flex;
					align-items: center;
					.data{
						margin-left: 10upx;
					}
				}
				.day-box{
					display: flex;
					width: 500upx;
					justify-content: space-around;
					align-items: center;
					padding-top: 20upx;
					.day{
						width: 70upx;
						height: 70upx;
						line-height: 70upx;
						text-align: center;
						border: 1px solid rgb(51,51,51);
					}
					.active{
						color: $fontColor;
						border: 1px solid $fontColor;
					}
				}
			}
		}
		.form{
			margin-top: 30upx;
			width: 670upx;
			::v-deep .uni-forms-item__label{
				color: #fff;
			}
			::v-deep .uni-easyinput__content{
				background-color: rgb(1, 19, 18)!important;
				border-color: rgb(1, 19, 18)!important;
				color: rgb(255,255,255)!important;
			}
			::v-deep .uni-icons{
				color: $fontColor!important;
			}
			.form-item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				background-color: rgb(1, 19, 18)!important;
				box-shadow: inset 0 0 16upx 0upx $fontColor;
				border-radius: 10upx;
				padding: 10upx;
				.left{
					width: 550upx;
				}
				.right{
					display: flex;
					width: 150upx;
					justify-content: space-between;
					align-items: center;
					color: #fff;
					padding-right: 20upx;
					.max{
						color: $fontColor;
					}
				}
				
			}
			.form-tips{
				margin-top: 10upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 24upx;
				 
			}
			.form-item-box{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				background-color: rgb(1, 19, 18);
				padding-top: 40upx;
				padding-bottom: 40upx;
				margin-top: 20upx;
				.form-item-box-item{
					width: 33%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					height: 120upx;
				}
				.divider{
					width: 2upx;
					height: 50upx;
					border-left: 1px solid rgb(51,51,51);
				}
			}
			.btn{
				background-color: $fontColor;
				color: #fff;
			}
		}
		.title{
			font-size: 32upx;
			margin-top: 20upx;
		}
		.detail-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			background-color: rgb(1, 19, 18);
			padding-top: 40upx;
			padding-bottom: 40upx;
			margin-top: 20upx;
			.detail-box-item{
				width: 33%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;
				height: 120upx;
			}
			.divider{
				width: 2upx;
				height: 50upx;
				border-left: 1px solid rgb(51,51,51);
			}
		}
		.rule-box{
			margin-top: 20upx;
			border-bottom: 1px solid rgb(51,51,51);
			.rule-top{
				display: flex;
				flex-direction: column;
				align-items: center;
				.rule-top-title{
					display: flex;
					align-items: center;
					margin-bottom: 10upx;
					.rule-top-title-tip{
						font-size: 24upx;
						margin-left: 20upx;
					}
				}
			}
			.rule-content{
				background-color: rgb(1, 19, 18);
				margin-top: 20upx;
				padding-top: 10upx;
				padding-bottom: 20upx;
				.rule-item{
					margin-top: 20upx;
					.rule-item-title{
						font-size: 28upx;
					}
					.tips{
						margin-top: 10upx;
						font-size: 24upx;
					}
				}
			}
			
		}
		.info-box{
			margin-top: 20upx;
			.info-item{
				margin-top: 50upx;
				line-height: 38upx;
				font-size: 24upx;
			}
		}
	}
	
}
</style>
