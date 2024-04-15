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
		background-color: rgb(1,2,3);
	}
</style>
