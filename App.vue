<script>
	export default {
		onLaunch: function() {
			this.$i18n.locale = uni.getStorageSync('selectLang') || 'en';
			uni.setLocale(uni.getStorageSync('selectLang') || 'en')
			uni.setStorageSync('selectLang', this.$i18n.locale);
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	@import "@/static/font/iconfont.css";
	*{
		padding: 0upx;
		margin: 0upx;
	}
	page{
		background-color: #dde0e8;
	}
	.page-title{
		margin-top: 80upx;
		font-size: 32upx;
		font-weight: bold;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.23;
		letter-spacing: 2.6px;
		color: #b57d3c;
		position: relative;
		width: 100%;
		text-align: center;
	}
</style>
