<template>
	<view class="invitte">
		<view class="top">
			<uni-nav-bar left-icon="left"  :title="$t('user.invite.title.text')" background-color="transparent" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		</view>
		<view class="content">
			<view class="title">{{$t('invite.link.title.text')}}</view>
			<view class="invite-link">{{shareLink}}</view>
			<view class="qrCode">
				<uqrcode ref="uqrcode" canvas-id="qrcode" :value="shareLink" :options="{ margin: 10 }"></uqrcode>
			</view>
			
			<view class="sub-info">{{$t('invite.qrcode.info.text')}}</view>
			<view class="invite-code">{{$t('invite.code.text')}} {{inviteCode}}</view>
			<view class="btn">
				<view class="copyBtn" @click="copy(inviteCode)">{{$t('invite.code.copy.text')}}</view>
				<view class="copyBtn" @click="copy(shareLink)">{{$t('invite.link.copy.text')}}</view>
			</view>
			<view class="tips">{{$t('invite.tips.text')}}</view>
		</view>
		<view class="copySuccess" v-if="isShow">{{$t('invite.copy.success')}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shareLink:'',
				inviteCode:'',
				isShow:false
			}
		},
		onLoad() {
			const user = uni.getStorageSync('user')
			this.inviteCode = user.invitationCode
			this.getLink(user.invitationCode)
		},
		methods: {
			getLink(invitationCode){
				let url = window.location.href
				url = url.replace('/pages/user/invite','') + '/pages/login/register';
				this.shareLink = `${url}?code=${invitationCode}`
			},
			copy(val) {
			    if (val) {
			        uni.setClipboardData({
			            data: val.toString(),
			            showToast: true,
			            success: () => {
			                uni.showToast({
			                    icon: 'none',
			                    title: this.$t("invite.copy.success"),
			                    duration: 2000,
			                });
			            }
			        });
			    }
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
.invitte{
	width: 710upx;
	min-height: 100vh;
	padding: 0upx 20upx;
	.top{
		margin-top: 20upx;
		height: 200upx;
		background-color: $fontColor;
	}
	.content{
		width: 600upx;
		margin: 0 auto;
		background: rgba(16 ,15, 15, .7);;
		position: absolute;
		top: 100upx;
		left: 75upx;
		backdrop-filter: blur(6px);
		// filter: blur(6px);
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		.title{
			margin-top: 40upx;
			font-size: 40upx;
		}
		.invite-link{
			font-size: 24upx;
			margin-top: 20upx;
			text-align: center;
		}
		.qrCode{
			margin-top: 100upx;
		}
		
		.sub-info{
			font-size: 24upx;
			margin-top: 20upx;
			color: rgb(185,185,185);
		}
		.invite-code{
			margin-top: 40upx;
			font-size: 30upx;
		}
		.btn{
			width: 100%;
			display: flex;
			justify-content: space-around;
			margin-top: 40upx;
			.copyBtn{
				background-color: $fontColor;
				color: #fff;
				width: 200upx;
				height: 60upx;
				line-height: 60upx;
				text-align: center;
				border-radius: 10upx;
			}
		}
		.tips{
			font-size: 24upx;
			margin-top: 60upx;
			color: rgb(185,185,185);
			
		}
		
	}
}
</style>
