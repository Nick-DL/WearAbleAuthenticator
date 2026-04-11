import vibrator from '@system.vibrator';
import router from '@system.router';
import app from '@system.app';

export default {
    data: {
        isClickable: true,
        letter_space: 0,
        lock_tips: '输入密码',
        password: "",
        user_password: "",
        input_password: ''
    },
    onInit() {
        this.user_password = this.password;
    },
    input(data) {
        if (this.isClickable == true) {
            let that = this;
            if (this.input_password.length < 6) {
                if (this.input_password.length == 0) {
                    this.lock_tips = "*"
                } else {
                    this.lock_tips += '*'
                }
                this.input_password += data
                this.letter_space = 6
                if (this.input_password.length == 6) {
                    this.isClickable = false
                    if (this.input_password == this.user_password) {
                        router.replace({
                            uri: "pages/index/index"
                        });
                    } else {
                        this.lock_tips = '密码错误'
                        this.letter_space = 0
                        vibrator.vibrate({
                            mode: 'short'
                        });
                        setTimeout(function () {
                            that.lock_tips = '输入密码'
                            that.input_password = ''
                            that.isClickable = true
                        }, 1000);
                    }
                }
            }
        }
    },
    delete() {
        if (this.input_password.length != 0 && this.isClickable == true) {
            this.input_password = this.input_password.substr(0, this.input_password.length - 1)
            this.lock_tips = this.lock_tips.substr(0, this.lock_tips.length - 1)
        }
    },
    onswipe(e) {
        if (e.direction == 'right' && e.distance >= 150) {
            app.terminate();
        }
    },
}
