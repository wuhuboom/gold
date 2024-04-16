<template>
	<view class="language">
		<view class="lang-target" @click="showSelect=!showSelect">
			<img :src="langItem.icon"/>
			<view class="lang-name">{{langItem.name}}</view>
		</view>
		<view class="lang-select" v-if="showSelect">
			<view class="lang-item" v-for="(item,index) in langOpt" :key="index" @click="langChange(item)">
				<img :src="item.icon"/>
				<view class="lang-name">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				langOpt:[
					{name:'en',icon:'../static/images/lang/EN.webp'},
					{name:'zh',icon:'../static/images/lang/ZH.webp'},
					{name:'vn',icon:'../static/images/lang/VN.webp'},
					{name:'de',icon:'../static/images/lang/DE.webp'},
					{name:'es',icon:'../static/images/lang/ES.webp'},
					{name:'fr',icon:'../static/images/lang/FR.webp'},
					{name:'ins',icon:'../static/images/lang/INS.webp'}
				],
				langItem:{},
				showSelect:false
			}
		},
		mounted() {
			const langVal = uni.getLocale() || 'en'
			this.langItem = this.langOpt.find(item=>item.name==langVal)
		},
		methods: {
			langChange(item) {
				const value = item.name
			    console.log('语言改变', value);
			    this.$i18n.locale = value;
			    uni.setStorageSync('selectLang', value);
			    location.reload();
				this.langItem = item 
				this.showSelect=false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.language{
		position: absolute;
		bottom: 40upx;
		right: 60upx;
		background-color: transparent;
		.lang-target{
			display: flex;
			align-items: center;
			height: 30upx;
			img{
				width: 50upx;
				height: 26upx;
			}
			.lang-name{
				text-transform: uppercase;
				font-size: 24upx;
				line-height: 1.4;
				letter-spacing: 3upx;
				color: #93643a;
				margin-left: 10upx;
			}
		}
		.lang-select{
			position: absolute;
			bottom: 60upx;
			.lang-item{
				display: flex;
				align-items: center;
				height: 30upx;
				margin-top: 20upx;
				img{
					width: 50upx;
					height: 26upx;
				}
				.lang-name{
					text-transform: uppercase;
					font-size: 24upx;
					line-height: 1.4;
					letter-spacing: 3upx;
					color: #93643a;
					margin-left: 10upx;
				}
			}
		}
		 
	}
</style>
