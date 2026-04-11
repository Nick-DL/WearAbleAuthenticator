import router from '@system.router';
import file from '@system.file';
import device from '@system.device';

let daxie = [["Q","W","E","R","T","Y","U","I","O","P"],["A","S","D","F","G","H","J","K","L"],["Z","X","C","V","B","N","M"]];
let xiaoxie = [["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["z","x","c","v","b","n","m"]];

export default {
    data: {
        typeString: '',
        number_array: [1,2,3,4,5,6,7,8,9,0],
        letter_array: [],
        toast_if: false,
        error_text: '',
        case_checked: false,
        toast_width: 0,
        toast_left: 0,
        step: 0,
        stepString: "下一步",
        addString: "输入Secret Key",
        otp_data: {},
        isGt2: false
    },
    onInit() {
        this.letter_array = xiaoxie;
        device.getInfo({
            success: (data) => {
                this.isGt2 = data.windowWidth == 454;
            }
        })
    },
    search() {
        if (this.step == 0) {
            if (this.typeString.length == 0) {
                this.show_toast("Key 不能为空", 260, 2000);
                return;
            }
            this.otp_data.key = this.typeString;
            this.addString = "输入描述";
            this.stepString = "添加";
            this.typeString = "";
            this.step++;
        } else if (this.step == 1) {
            if (this.typeString.length == 0) {
                this.show_toast("描述不能为空", 250, 2000);
                return;
            }
            this.otp_data.desc = this.typeString;
            let otp_list = [];
            file.readText({
                uri: "internal://app/otp_list.json",
                length: 4096,
                success: (data) => {
                    otp_list = JSON.parse(data.text);
                    data.text = null;
                    otp_list.push(this.otp_data);
                    file.writeText({
                        uri: "internal://app/otp_list.json",
                        text: JSON.stringify(otp_list)
                    });
                    router.replace({
                        uri: 'pages/index/index'
                    });
                },
                fail: (data, code) => {
                    if (code == 301) {
                        otp_list.push(this.otp_data);
                        file.writeText({
                            uri: "internal://app/otp_list.json",
                            text: JSON.stringify(otp_list)
                        });
                        router.replace({
                            uri: 'pages/index/index'
                        });
                    }
                }
            })
        }
    },
    onclick(data) {
        this.typeString += data
    },
    caseclick() {
        this.case_checked = !this.case_checked
        if (this.case_checked == true) {
            this.letter_array = daxie
        } else if (this.case_checked == false) {
            this.letter_array = xiaoxie
        }
    },
    delete() {
        let length = this.typeString.length
        this.typeString = this.typeString.substr(0, length - 1)
    },
    deleteall() {
        this.typeString = ''
    },
    onswipe(e) {
        if (e.direction == "right") {
            router.replace({
                uri: "pages/index/index"
            });
        }
    },
    show_toast(text, width, time) {
        clearTimeout(this.unshow2)
        let that = this;
        this.error_text = text
        this.toast_width = width
        this.toast_left = (454 - this.toast_width) / 2
        //this.ani_name = 'appear'
        this.toast_if = true
        this.unshow2 = setTimeout(function () {
            that.ani_name = ''
            that.toast_if = false
        }, time)
    }
}
