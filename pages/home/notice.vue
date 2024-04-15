<template>
	<view class="notice">
		<uni-nav-bar left-icon="left"  :title="$t('home.notice.page.title')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="content">
			<uni-collapse>
				<uni-collapse-item titleBorder="auto" :show-animation="true" v-for="(item,index) in noticeList" :key="index" :open="index==0">
					<template v-slot:title>
						<view class="title">{{item.title}}</view>
						<view class="sub-title">{{$t('home.notice.time.title')}} {{item.time}}</view>
					</template>
					<view class="text">
						<text>{{item.content}}</text>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList:[
					{title:'Announcement for Tech-Finger 2.0 upgradedelay',time:' 2023 07-11 13.50:00',content:'Dear TechFinger users, in view of the huge amount of userdata, Up to now, all the statisticshave not been completedresulting in the delavedechFinger2.0 upgrade, which was originally scheduled to be updated on July 10,2023. Please wait patiently and always pay attention to the APP announcement infommation. The TechFinger team apologizes for the inconvenience caused'},
					{title:'Announcement',time:' 2023 07-11 13.50:00',content:'Dear TechFinger users, in view of the huge amount of userdata, Up to now, all the statisticshave not been completedresulting in the delavedechFinger2.0 upgrade, which was originally scheduled to be updated on July 10,2023. Please wait patiently and always pay attention to the APP announcement infommation. The TechFinger team apologizes for the inconvenience caused'},
					{title:'Technology Finger System Announcement',time:' 2023 07-11 13.50:00',content:'Dear TechFinger users, in view of the huge amount of userdata, Up to now, all the statisticshave not been completedresulting in the delavedechFinger2.0 upgrade, which was originally scheduled to be updated on July 10,2023. Please wait patiently and always pay attention to the APP announcement infommation. The TechFinger team apologizes for the inconvenience caused'},
					{title:'Tech Finger System Upgrade Announcement',time:' 2023 07-11 13.50:00',content:'Dear TechFinger users, in view of the huge amount of userdata, Up to now, all the statisticshave not been completedresulting in the delavedechFinger2.0 upgrade, which was originally scheduled to be updated on July 10,2023. Please wait patiently and always pay attention to the APP announcement infommation. The TechFinger team apologizes for the inconvenience caused'},
					{title:'Announcement on the upgrade andadiustment of Tech Finger to improve theAPp operation experience',time:' 2023 07-11 13.50:00',content:'Dear TechFinger users, in view of the huge amount of userdata, Up to now, all the statisticshave not been completedresulting in the delavedechFinger2.0 upgrade, which was originally scheduled to be updated on July 10,2023. Please wait patiently and always pay attention to the APP announcement infommation. The TechFinger team apologizes for the inconvenience caused'}
				]
			}
		},
		onLoad() {
			this.laodNotice()
		},
		methods: {
			laodNotice(){
				this.$http.get("/player/home/notice",(res)=>{
					if(res.code == 200){
						// this.noticeList = res.data
					}
				})
			},
			goBack(){
				uni.switchTab({
					url:'/pages/home/home'
				})
			}
			
		}
	}
</script>

<style scoped lang="scss">
.notice{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	::v-deep .uni-collapse{
		background-color: $bgColor;
		color: #fff;
	}
	::v-deep .uni-collapse-item--border,.uni-collapse-item__title{
		border-bottom: 1px solid #999!important;
	}
	.content{
		.title{
			font-size: 28upx;
			padding-top: 10upx;
			padding-bottom: 10upx;
		}
		.sub-title{
			font-size: 24upx;
			color: rgb(185,185,185);
			padding-bottom: 20upx;
		}
		.text{
			background-color: $bgColor;
			color: #fff;
		}
	}
}
</style>
