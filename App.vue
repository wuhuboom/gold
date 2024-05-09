<script>
	export default {
		onLaunch: function() {
			this.$i18n.locale = uni.getStorageSync('selectLang') || 'en';
			uni.setLocale(uni.getStorageSync('selectLang') || 'en')
			uni.setStorageSync('selectLang', this.$i18n.locale);
			
			const script = document.createElement('script');
			script.src = 'https://hkwebcdn.yuncloudauth.com/cdn/jsvm_all.js';
			script.onload = () => {
			  console.log('jsvm_all.js loaded successfully');
			  // 在这里可以调用jsvm_all.js中的函数或执行相关代码
			  console.log(window.getMetaInfo(),'---------')
			};
			script.onerror = () => {
			  console.error('Failed to load jsvm_all.js');
			};
			document.head.appendChild(script);
			
			
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
		max-width: 750px;
		width: 750upx;
		height: 100vh;
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
		.back{
			position: absolute;
			top:-8upx
		}
	}
</style>
