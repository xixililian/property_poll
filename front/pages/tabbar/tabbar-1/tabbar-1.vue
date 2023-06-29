<template>
	<view class="content">
		<view class="list">
			<view v-for="item in tableData"
				:key="item.id"
				class="list-item"
			>
				<view class="item-title">{{ item.title }}</view>
				<view class="item-description">{{ item.description }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { reactive, ref } from "vue";
	const GD = getApp().globalData;
	const {$message} = GD;

	const tableData = reactive([]);
	const queryState = reactive({
		pageNo: 1,
		pageSize: 5
	});
	const totalCount = ref(0)

	const fetchData = async function () {
		const res = await GD.$request({
			url: "/pollList",
			data: queryState
		});

		tableData.push(...res.data);
		totalCount.value = res.count;
	}

	fetchData();

</script>

<style lang="scss" scoped>
	page {
		background-color: whitesmoke;
	}

	.list-item {
		margin: 12upx 0;
		padding: 24upx;
		background-color: white;
	}

	.item-title {
		font-size: 32upx;
		font-weight: bold;
	}
	
	.item-description {
		margin-top: .5em;
		font-size: 28upx;
		color: dimgray;
	}
</style>
