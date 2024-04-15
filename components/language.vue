<template>
	<view class="language">
		<uni-data-select
		  v-model="langVal"
		  :localdata="langOpt"
		  @change="langChange"
		  :clear="false"
		></uni-data-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				langVal: uni.getLocale(),
				langOpt:[
					{value:'en',text:'EN',name:'English'},
					{value:'zh',text:'ZH',name:'中文'}
				]
			}
		},
		computed: {
		    getLangName() {
		        return () => {
		            return this.langOpt.find(item => item.value == this.langVal).label
		        }
		    }
		},
		methods: {
			langChange(value) {
			    console.log('语言改变', value);
			    this.$i18n.locale = value;
			    uni.setStorageSync('selectLang', value);
			    location.reload();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.language{
		position: absolute;
		top: 60upx;
		right: 60upx;
		// width: 80upx;
		// height: 50upx;
		background-color: transparent;
		
		color: #fff;
		::v-deep .uni-select__input-text{
			color: #fff;
		}
		::v-deep .uni-select__input-box .uni-icons{
			color: #fff!important;
			// display: none;
		}
		::v-deep .uni-select__selector{
			background-color: $bgColor;
			border: 1px solid $fontColor;
			backdrop-filter: 6px;
		}
		::v-deep .uni-select{
			border: 1px solid $fontColor;
		}
	}
</style>
