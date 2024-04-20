<template>
	<view class="user">
		 <view class="page-title">
		 	{{$t('page.me.title')}}
		 </view>
		 <view class="content">
			 <img class="bg-img" src="../../static/images/user/Union 5.webp"/>
			 <view class="main-content">
				 <view class="left">
					 <image src="../../static/images/home/profile.webp" mode="aspectFit"></image>
				 </view>
				 <view class="right">
					 <view class="block-title">{{user.username}}</view>
					 <view class="user-balance">{{$t('home.balance.text')}}:{{getAmount(user.balance || 0)}}</view>
					 <view class="menu">
						 <view class="menu-item" v-for="(item,index) in menus" :key="index" @click="goPage(item.path)">
							 <img class="menu-icon" :src="item.icon"/>
							 <view class="menu-name">{{item.name}}</view>
						 </view>
					 </view>
				 </view>
			 </view>
			 <img class="bg-img" src="../../static/images/user/Union 6.webp"/>
		 </view>
		 <view class="content">
			 <img class="bg-img" src="../../static/images/user/Union 5.webp"/>
			 <view class="main-content">
				 <view class="left">
					 <uqrcode ref="uqrcode" canvas-id="qrcode" :value="shareLink" :size="120" :options="{ margin: 10 }"></uqrcode>
				 </view>
				 <view class="right">
					 <view class="block-title">{{$t('home.qrcode.text')}}</view>
					 <view class="sharlink">{{shareLink}}</view>
					 <view class="menu">
						 <view class="menu-item" @click="copy(shareLink)">
							 <img class="menu-icon" src="../../static/images/user/Group 33.webp"/>
							 <view class="menu-name">{{$t('home.copylink.text')}}</view>
						 </view>
					 </view>
				 </view>
			 </view>
			 <img class="bg-img" src="../../static/images/user/Union 8.webp"/>
		 </view>
		 
		 <view class="content last">
			 <view class="main-content">
				 <view class="left">
					 <view class="invitecode">
						 {{invitationCode}}
					 </view>
				 </view>
				 <view class="right">
					 <view class="block-title">{{$t('home.invitecode.text')}}</view>
					 <view class="invitecode-tips">{{$t('home.invitecode.tip.text')}}</view>
					 <view class="menu">
						 <view class="menu-item" @click="copy(invitationCode)">
							 <img class="menu-icon" src="../../static/images/user/Group 33.webp"/>
							 <view class="menu-name">{{$t('home.copycode.text')}}</view>
						 </view>
					 </view>
				 </view>
			 </view>
			 <img class="bg-img-2" src="../../static/images/user/Group 52.webp"/>
		 </view>
	</view>
</template>

<script>
	import {getAmount} from '@/utils/util.js'
	export default {
		data() {
			return {
				getAmount:getAmount,
				user:{},
				menus:[
					{name:this.$t('home.withdraw.text'),icon:'../../static/images/home/Group23.webp',path:'./withdraw?type=user'},
					{name:this.$t('home.recharge.text'),icon:'../../static/images/home/Group20.webp',path:'./recharge'},
					{name:this.$t('home.signout.text'),icon:'../../static/images/user/Group 31.webp',path:'./signout'}
				],
				shareLink:'',
				invitationCode:''
			}
		},
		onShow() {
			this.$store.dispatch('getUserInfo')
			this.user = uni.getStorageSync('accountInfo')
			this.invitationCode = this.user.invitationCode || '111111'
			this.getLink()
		},
		methods: {
			goPage(path){
				if(path=='./signout'){
					this.$http.get('/player/auth/logout',res=>{
						if(res.code==200){
							uni.removeStorageSync("token")
							uni.removeStorageSync("user")
							uni.removeStorageSync("accountInfo")
							uni.navigateTo({
								url:'/pages/index/index'
							})
						}
					})
				}else{
					uni.navigateTo({
						url:path
					})
				}
			},
			getLink(){
				let url = window.location.href
				url = url.replace('/pages/user/user','') + '/pages/login/register';
				this.shareLink = `${url}?code=${this.invitationCode}`
			},
			  copy(val) {
			      if (val) {
			          uni.setClipboardData({
			              data: val.toString(),
			              showToast: true,
			              success: () => {
			                  uni.showToast({
			                      icon: 'none',
			                      title: this.$t("home.invite.copy.success"),
			                      duration: 2000,
			                  });
			              }
			          });
			      }
			  },
		}
	}
</script>

<style scoped lang="scss">
.user{
	width: 670upx;
	padding-left: 40upx;
	padding-right: 40upx;
	height: 100vh;
	.content{
		.bg-img{
			width: 670upx;
			height: auto;
			margin-top: 20upx;
		}
		.bg-img-2{
			width: 670upx;
			height: 80upx;
		}
		.main-content{
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			.left{
				width: 40%;
				image{
					width: 200upx;
					height: 200upx;
					background-color: transparent;
				}
				.invitecode{
				  width: 200upx;
				  height: 70upx;
				  line-height: 70upx;
				  background-color: #c9ac7f;
				  text-align: center;
				  font-size: 28upx;
				  font-weight: bold;
				  color: #fff;
				}
			}
			.right{
				width: 400upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: flex-start;
				.block-title{
					font-size: 30upx;
					font-weight: bold;
					line-height: 1.23;
					letter-spacing: 2.6px;
					color: #484a53;
					margin-bottom: 10upx;
				}
				.user-balance,.sharlink{
				  font-size: 24upx;
				  font-weight: bold;
				  line-height: 2;
				  letter-spacing: 1px;
				  color: #c1a374;
				  width: 380upx;
				  word-wrap: break-word;
				}
				.invitecode-tips{
					font-size: 24upx;
					font-weight: bold;
					line-height: 2;
					letter-spacing: 1px;
					color: #c1a374;
				}
				.menu{
					.menu-item{
						display: flex;
						align-items: center;
						margin-top: 20upx;
						.menu-icon{
							width: 60upx;
							height: auto;
						}
						.menu-name{
							font-size: 24upx;
							font-weight: bold;
							line-height: 2;
							letter-spacing: 1px;
							color: #c1a374;
							margin-left: 20upx;
						}
					}
				}
			}
		}
	}
	.last{
		margin-top: 30upx;
	}
}
</style>
