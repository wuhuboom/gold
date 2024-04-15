<template>
	<view class="set-lang">
		<uni-nav-bar left-icon="left"  :title="$t('setting.menu1.text')" background-color="rgb(1,2,3)" color="#fff" :border="false" @clickLeft="goBack"></uni-nav-bar>
		<view class="menu">
			<view class="menu-item" v-for="(item,index) in languages" :key="index" @click="langChange(item)">
				<view class="left">
					<img :src="item.icon">
					<view class="menu-text" :class="lang.value == item.value ? 'active' :''">{{item.name}}</view>
				</view>
				<view class="right" v-if="lang.value == item.value">
					<uni-icons type="checkmarkempty" color="#04D3D5" :size="24"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				languages:[
					{value:'en',text:'EN',name:'English',icon:'../../static/images/login/EN.webp'},
					{value:'zh',text:'ZH',name:'中文',icon:'../../static/images/login/ZH.webp'}
				],
				lang:{}
			}
		},
		onLoad() {
			this.loadLocal()
		},
		methods: {
			loadLocal(){
				const local = uni.getLocale()
				const temp = this.languages.filter(item => {
					return item.value == local
				})
				this.lang = temp[0]
			},
			langChange(item) {
				this.lang = item
				const value = item.value
			    console.log('语言改变', value);
			    this.$i18n.locale = value;
			    uni.setStorageSync('selectLang', value);
			    location.reload();
			}, 
			goBack(){
				uni.navigateTo({
					url:'./setting'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.set-lang{
	width: 670upx;
	min-height: 100vh;
	padding: 0upx 40upx;
	.menu{
		color: rgb(185,185,185);
		.menu-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 120upx;
			border-bottom: 1px solid #494747;
			.left{
				display: flex;
				align-items: center;
				img{
					width: 60upx;
					height: 40upx;
				}
				.menu-text{
					margin-left: 20upx;
				}
				.active{
					color: $fontColor;
				}
			}
			.right{
				
			}
		}
	}
}
</style>
