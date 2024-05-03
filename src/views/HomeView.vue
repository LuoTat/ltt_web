<template>
    <div>当前登录用户：{{ username }}</div>
</template>

<script>
export default {
    data() {
        return {
            username: sessionStorage.getItem("username"),
        };
    },
};
</script>

<style></style>
