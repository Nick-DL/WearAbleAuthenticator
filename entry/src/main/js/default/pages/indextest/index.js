import app from '@system.app';
import router from '@system.router';
import file from '@system.file';
import { decodeAsBytes } from '../../common/base32_decode.js';


function arrayToBinary(array) {
    return array.map(char => String.fromCharCode(char)).join('')
}

function binaryToArray(binaryStr) {
    return binaryStr.split('').map(char => char.charCodeAt())
}

/**
 * 数字转 Int64 字节流
 * @param {number} num
 * @returns
 */

let timeInterval;
let updateInterval;
let eachPageIndex = 3;
let deleteIndex = 0;
let exportIndex = 0;

export default {
    data: {
        otpList: [],
        index: 0,
        progressTopPercent: 0,
        progressBottomPercent: 0,
        updateTime: 0,
        renderList: [],
        showDelete: false,
        showExport: false,
        qrValue: "",
        font_family: "Harmony-Bold",
    },
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
        clearInterval(updateInterval);
        clearInterval(timeInterval);
    },
    calculateProgress() {
        let imageCount = this.otpList.length === 0 ? 1 : this.otpList.length;
        let pageCount = Math.ceil(imageCount / 3);
        let eachProgressPercent = parseInt(100 / pageCount);
        let page = Math.ceil((this.index + 3) / 3);
        this.progressTopPercent = eachProgressPercent * (page - 1);
        this.progressBottomPercent = eachProgressPercent * (pageCount - page);
    },
    handleExport(index) {
        this.qrValue = `otpauth://totp/cnoim?secret=${this.renderList[index].key}&issuer=${this.renderList[index].desc}`;
        console.log(this.qrValue)
        this.showExport = true;
    },
    handleQrSwipe(e) {
        if (e.direction == "right") {
            this.showExport = false;
        }
    },
    handleDeleteOtp(index) {
        this.showDelete = true;
        deleteIndex = index;
    },
    handleDeleteCancel() {
        this.showDelete = false;
    },
    handleDeleteConfirm() {
        this.otpList.splice(this.index + deleteIndex, 1);
        file.writeText({
            uri: "internal://app/otp_list.json",
            text: JSON.stringify(this.otpList),
            success: () => {
                router.replace({
                    uri: "pages/index/index"
                });
            }
        });
    },
    handleDeleteSwipe(e) {
        if (e.direction == 'right') this.handleDeleteCancel();
    },
    handleSettings() {
        router.replace({
            uri: "pages/settings/settings"
        });
    },
    handleAdd() {
        router.replace({
            uri: "pages/add/add"
        });
    },
    handleListUp() {
        if (this.index + 3 < this.otpList.length) {
            router.replace({
                uri: "pages/index/index",
                params: {
                    index: this.index + eachPageIndex
                }
            });
        }
    },
    handleListDown() {
        if (this.index + 3 > 3) {
            router.replace({
                uri: "pages/index/index",
                params: {
                    index: this.index - eachPageIndex
                }
            });
        }
    },
    handleSwipe(e) {
        if (e.direction == 'right') {
            app.terminate();
        } else if (e.direction == 'up') {
            this.handleListUp();
        } else if (e.direction == 'down') {
            this.handleListDown();
        }
    }
}
