export function showMessage(response, vueInstance, callback) {
    if (response.data.code == 1) {
        vueInstance.$message({
            message: response.data.msg,
            type: "success",
        });
        callback && callback();
    } else {
        vueInstance.$message({
            message: response.data.msg,
            type: "error",
        });
    }
}
