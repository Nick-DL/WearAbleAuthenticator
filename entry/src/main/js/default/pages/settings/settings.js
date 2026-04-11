import router from '@system.router';

let timeInterval

export default {
    onInit() {
        this.getTime();
    },
    getTime() {
        var getTime = () => {
            var date = new Date();
            var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
            var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
            let timeString = hh + ':' + mm;
            if (this.timeString != timeString) this.timeString = timeString;
        }
        timeInterval = setInterval(getTime, 1000);
        getTime();
    },
    onDestroy() {
        clearInterval(timeInterval);
    },
    handleSwipe(e) {
        if (e.direction == 'right') router.replace({
            uri: "pages/index/index"
        });
    },
    handleEditLockSettings() {
        router.replace({
            uri: "pages/lock/lock"
        });
    },
    handleAbout() {
        router.replace({
            uri: "pages/about/about"
        });
    }
}
