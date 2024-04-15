<template>
	<view class="security">
		<uni-nav-bar left-icon="left"  :title="$t('user.menu.title1.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		
		<view class="menu">
			<view class="menu-item" v-for="(item,index) in menus" :key="index">
				<view class="left">
					<view class="title">{{item.title}}</view>
					<view class="info">{{item.info}}</view>
				</view>
				<view class="right">
					<view class="oper" v-if="item.type==1" @click="goPage(item)">{{email}}</view>
					<view class="oper" v-else-if="item.type==2">
						<button class="opet-btn" @click="goPage(item)">{{$t('btn.change.text')}}</button>
					</view>
					<view class="oper" v-else>
						<switch color="#04D3D5" style="transform:scale(0.8)" @change="switchChange(item)"/>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menus:[
					{title:this.$t('security.menu1.text'),info:this.$t('security.menu1.info'),type:1,path:'./updateEmail'},
					{title:this.$t('security.menu2.text'),info:this.$t('security.menu2.info'),type:2,path:'./updatePassword'},
					{title:this.$t('security.menu3.text'),info:this.$t('security.menu3.info'),type:2,path:'./updateFundPwd'},
					// {title:this.$t('security.menu4.text'),info:this.$t('security.menu4.info'),type:3,path:''},
					// {title:this.$t('security.menu5.text'),info:this.$t('security.menu5.info'),type:3,path:''}
				],
				email:''
			}
		},
		onReady() {
			const user = uni.getStorageSync('user')
			this.email = this.format(user.email )
		},
		methods: {
			goPage(item){
				uni.navigateTo({
					url:item.path
				})
			},
			switchChange(item){
				
			},
			format(email){
				let atIndex = email.indexOf('@');
				if(atIndex > 5){
					atIndex = 5
				}
				if (atIndex !== -1) {
					const beforeAt = email.substring(0, atIndex);
					if (beforeAt.length >= 3) {
						const secondLastPos = beforeAt.length - 2;
						const lastPos = beforeAt.length - 1;
						// const maskedEmail = beforeAt.slice(0, secondLastPos) + '**' + email.slice(atIndex);
						const maskedEmail = beforeAt.slice(0, secondLastPos) + '**@**';
						return maskedEmail;
					}
				}
			
				// 如果不符合条件，直接返回原邮箱地址（或者可以根据需求返回错误提示）
				return email;
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
.security{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.menu{
		.menu-item{
			border: 1px solid $fontColor;
			box-shadow: inset 0 0 16upx 0upx $fontColor;
			height: 150upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30upx;
			color: #fff;
			padding-left: 20upx;
			padding-right: 20upx;
			.left{
				.title{
					font-size:28upx;
				}
				.info{
					font-size: 24upx;
					color: rgb(185,185,185);
					margin-top: 10upx;
				}
			}
			.right{
				width: 150upx;
				text-align: center;
				.opet-btn{
					width: 120upx;
					height: 60upx;
					font-size: 28upx;
					background-color: $fontColor;
					color: #fff;
				}
			}
		}
	}
}
</style>
