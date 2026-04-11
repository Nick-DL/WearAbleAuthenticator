import app from '@system.app';
import router from '@system.router';

let timeInterval

export default {
    data: {
        showMain: true,
        showQrCode: false,
        qrValue: " ",
/*
        otherList: [{name:"腕上词典 GT2",icon:"/common/weardict_icon.png",description:"手表也能查单词",qrcode:"https://docs.qq.com/doc/p/2cb30b8eb07df73818836a1066d8f7dee6bb5ccf"},{name:"腕上日历 GT2",icon:"/common/calendar_icon.png",description:"时间管理一网打尽",qrcode:"https://docs.qq.com/form/page/DY0FUSU52ZUFxSWN3"},{name:"腕上便条 GT2",icon:"/common/wearnote_icon.png",description:"繁琐小事随手记录",qrcode:"https://docs.qq.com/form/page/DY0FUSU52ZUFxSWN3"}],
*/
        versionName: "1.0.0",
        versionCode: 0
    },
    replaceQrCode(index) {
        if (this.otherList[index].qrcode) {
            this.qrValue = this.otherList[index].qrcode;
            this.showMain = false;
            this.showQrCode = true;
        }
    },
    onInit() {
        this.getTime();
        const appVersionInfo = app.getInfo();
        this.versionName = appVersionInfo.versionName;
        this.versionCode = appVersionInfo.versionCode;
    },
    handleSwipe(event) {
        if (event.direction == "right") {
            router.replace({
                uri: "pages/settings/settings"
            });
        }
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
    handleQrCodeSwipe(event) {
        if (event.direction == "right") {
            this.showQrCode = false
            this.showMain = true;
        }
    }
}
