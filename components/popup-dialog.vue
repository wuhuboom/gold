<template>
	<uni-popup ref="popup" type="center" :animation="false" background-color="transparent" border-radius="10px 10px 0 0" :is-mask-click="false">
		<view class="popup-dialog">
			<view class="popup-title" v-if="title">{{title}}</view>
			<view class="popup-content">{{content}}</view>
			<view class="popup-btns" v-if="showCancel">
				<view class="yes-btn" @click="confirm">{{$t('btn.yes.text')}}</view>
				<view class="no-btn" @click="cancel">{{$t('btn.no.text')}}</view>
			</view>
			<view class="popup-btn" @click="confirm" v-else>
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
			content:"",
			showCancel:{
				type:Boolean,
				default:false
			}
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
			cancel(){
				this.$refs.popup.close()
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
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width:600upx;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 100upx;
	padding-bottom: 70upx;
	.popup-title{
		font-size: 26upx;
		font-weight: bold;
		line-height: 1.15;
		letter-spacing: 1.95px;
		color: #93643a;
		margin-bottom: 40upx;
	}
	.popup-content{
	  font-size: 24upx;
	  font-weight: bold;
	  line-height: 2;
	  letter-spacing: 1px;
	  text-align: center;
	  color: #c1a374;
	  padding: 0upx 40upx;
	  max-height: 300upx;
	  overflow: auto;
	}
	.popup-btn{
		background-image: url('../static/images/index/okbtn.webp');
		background-size: 100% 100%;
		background-color: transparent;
		width: 268upx;
		height: 72upx;
		margin-top: 40upx;
		line-height: 72upx;
		text-align: center;
		font-size: 26upx;
	    font-weight: bold;
	    letter-spacing: 1.95px;
	    color: #93643a;
		
	}
	.popup-btns{
		background-image: url('../static/images/index/okbtn.webp');
		background-size: 100% 100%;
		background-color: transparent;
		margin-top: 40upx;
		width: 368upx;
		height: 72upx;
		font-size: 26upx;
	    font-weight: bold;
	    letter-spacing: 1.95px;
	    color: #93643a;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.yes-btn{
			margin-left: 80upx;
		}
		.no-btn{
			margin-right: 60upx;
		}
	}
}
</style>