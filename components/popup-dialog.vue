<template>
	<uni-popup ref="popup" type="center" :animation="false" background-color="transparent" border-radius="10px 10px 0 0" :is-mask-click="false">
		<view class="popup-dialog">
			<view class="popup-title">{{title}}</view>
			<view class="popup-content">{{content}}</view>
			<view class="popup-btn" @click="confirm">
				{{$t('btn.ok.text')}}
			</view>
		</view>
	</uni-popup>
</template>

<script>
	export default {
		name:"poupe-dialog",
		props:{
			title:'',
			content:""
		},
		data() {
			return {
				
			};
		},
		methods:{
			confirm(){
				this.$refs.popup.close()
				this.$emit('confirm')
			},
			open(){
				this.$refs.popup.open()
			}
		}
		
	}
</script>

<style scoped lang="scss">
.popup-dialog{
	background-image: url('../static/images/index/poup-bg.webp');
	background-size: 100%;
	width:600upx;
	height: 460upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	.popup-title{
		font-size: 26upx;
		font-weight: bold;
		line-height: 1.15;
		letter-spacing: 1.95px;
		color: #93643a;
		margin-top: 100upx;
	}
	.popup-content{
	  font-size: 20upx;
	  font-weight: bold;
	  line-height: 2;
	  letter-spacing: 1px;
	  text-align: center;
	  color: #c1a374;
	  margin-top: 40upx;
	  padding: 20upx;
	}
	.popup-btn{
		background-image: url('../static/images/index/okbtn.webp');
		background-size: 100%;
		width: 268upx;
		height: 72upx;
		line-height: 72upx;
		text-align: center;
		position: absolute;
		bottom: 60upx;
		font-size: 26upx;
	    font-weight: bold;
	    letter-spacing: 1.95px;
	    color: #93643a;
		
	}
}
</style>