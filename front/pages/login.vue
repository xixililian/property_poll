<template>
	<view class="content">
		<label for="" class="label">
			<text>账号</text>
			<input type="text"
				v-model="state.account"
				placeholder="请输入账号"
			/>
		</label>

		<label for="" class="label">
			<text>密码</text>
			<input type="password"
				v-model="state.pwd"
				placeholder="请输入密码"
			/>
		</label>

		<button @click="submitClick">登录</button>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	const GD = getApp().globalData;
	const {$message} = GD;

	const handeleSuccess = function () {
		const pageStack = getCurrentPages();
		if (pageStack.length > 1) uni.navigateBack();
		else uni.reLaunch({
			url: '/pages/tabbar/tabbar-1/tabbar-1'
		});
	}

	if (GD.isLogin) $message("已登录").then(handeleSuccess);

	const state = reactive({
		account: "",
		pwd: ""
	});

	const submitClick = async function () {
		try {
			const res = await GD.$request({
				method: "post",
				url: '/login',
				data: {
					...state
				}
			});

			switch (res.code) {
				case 2998:
				case 2999:
					$message(res.msg);
					break;

				default:
					console.log(res);
					GD.token = res.token;
					GD.userInfo = res.data;
					$message("登录成功").then(handeleSuccess)
					break;
			}
			
		} catch (error) {
			$message("登录失败，请稍后重试");
			console.warn("login error", error);
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin: 0 24upx;
	}
	label {
		display: block;
		margin: 1em 0;
		border-bottom: 1upx solid rgba($color: #000000, $alpha: 0.1);

		text {
			// color: darkgray;
			&::after {
				content: ":";
			}
		}

		input {
			height: 3em;
		}
	}
</style>