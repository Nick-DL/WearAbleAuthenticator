import router from '@system.router';
import storage from '@system.storage';
import vibrator from '@system.vibrator';

export default {
    data: {
        showMain: true,
        showSettings: false,
        isLocked: false,
        isclick: true,
        letter_space: 0,
        lock_process: "input",
        lock_tips: '设置密码',
        password: '',
        confirm_password: '',
    },
    onInit() {
        this.getlockstate();
    },
    input(data) {
        if (this.isclick == true) {
            let that = this;
            if (this.lock_process == 'input') {
                if (this.password.length < 6) {
                    if (this.password.length == 0) {
                        this.lock_tips = "*"
                    } else {
                        this.lock_tips += '*'
                    }
                    this.password += data
                    this.letter_space = 6
                    if (this.password.length == 6) {
                        this.isclick = false
                        setTimeout(function () {
                            that.lock_process = 'confirm'
                            that.lock_tips = '确认密码'
                            that.letter_space = 0
                            that.isclick = true
                        }, 300)
                    }
                }
            } else if (this.lock_process == 'confirm') {
                if (this.confirm_password.length < 6) {
                    if (this.confirm_password.length == 0) {
                        this.lock_tips = "*"
                    } else {
                        this.lock_tips += '*'
                    }
                    this.confirm_password += data
                    this.letter_space = 6
                    if (this.confirm_password.length == 6) {
                        this.isclick = false
                        if (that.confirm_password != that.password) {
                            that.lock_tips = '密码不一致'
                            that.letter_space = 0
                            vibrator.vibrate({
                                mode: 'short'
                            });
                            setTimeout(function () {
                                that.lock_tips = '设置密码'
                                that.lock_process = 'input'
                                that.password = ''
                                that.confirm_password = ''
                                that.isclick = true
                            }, 1000)
                        } else if (that.confirm_password == that.password) {
                            that.lock_tips = '设置完成'
                            that.letter_space = 0
                            storage.set({
                                key: 'password',
                                value: that.password,
                                success: function () {
                                    setTimeout(function () {
                                        that.password = ''
                                        that.confirm_password = ''
                                        that.lock_process = 'input'
                                        that.isclick = true
                                        that.lockexit();
                                        that.getlockstate();
                                        that.lock_tips = '设置密码'
                                    }, 1000)
                                },
                            });
                        }
                    }
                }
            } else if (this.lock_process == 'modify') {
                if (this.password.length < 6) {
                    if (this.password.length == 0) {
                        this.lock_tips = "*"
                    } else {
                        this.lock_tips += '*'
                    }
                    this.password += data
                    this.letter_space = 6
                    if (this.password.length == 6) {
                        this.isclick = false
                        storage.get({
                            key: 'password',
                            success: function (data) {
                                if (data == that.password) {
                                    setTimeout(function () {
                                        that.lock_process = 'input'
                                        that.lock_tips = '设置密码'
                                        that.letter_space = 0
                                        that.password = ''
                                        that.isclick = true
                                    }, 300)
                                } else {
                                    that.lock_tips = '密码错误'
                                    that.letter_space = 0
                                    that.password = ''
                                    vibrator.vibrate({
                                        mode: 'short',
                                        success: function () {
                                            setTimeout(function () {
                                                that.isclick = true
                                                that.lock_tips = '输入原密码'
                                            }, 1000)
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            } else if (this.lock_process == 'delete') {
                if (this.password.length < 6) {
                    if (this.password.length == 0) {
                        this.lock_tips = "*"
                    } else {
                        this.lock_tips += '*'
                    }
                    this.password += data
                    this.letter_space = 6
                    if (this.password.length == 6) {
                        this.isclick = false
                        storage.get({
                            key: 'password',
                            success: function (data) {
                                if (data == that.password) {
                                    storage.delete({
                                        key: 'password'
                                    });
                                    that.lock_tips = '密码已删除'
                                    that.letter_space = 0
                                    setTimeout(function () {
                                        that.lock_process = 'input'
                                        that.lock_tips = '设置密码'
                                        that.password = ''
                                        that.isclick = true
                                        that.getlockstate();
                                        that.lockexit();
                                    }, 1000)
                                } else {
                                    that.lock_tips = '输入错误'
                                    that.letter_space = 0
                                    that.password = ''
                                    vibrator.vibrate({
                                        mode: 'short',
                                        success: function () {
                                            setTimeout(function () {
                                                that.isclick = true
                                                that.lock_tips = '输入原密码'
                                            }, 1000)
                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            }
        }
    },
    lockexit() {
        this.showSettings = false;
        this.showMain = true;
    },
    handleSettings(want) {
        this.lock_process = want;
        this.showMain = false;
        this.showSettings = true;
        this.letter_space = 0;
        if (want != "input") {
            this.lock_tips = "输入原密码";
        }
    },
    getlockstate() {
        let that = this;
        storage.get({
            key: 'password',
            default: '',
            success: function (data) {
                if (data == '') {
                    that.isLocked = false
                } else {
                    that.isLocked = true
                }
            }
        });
    },
    delete() {
        if (this.password.length != 0 && this.isclick == true) {
            this.password = this.password.substr(0, this.password.length - 1)
            this.lock_tips = this.lock_tips.substr(0, this.lock_tips.length - 1)
        }
    },
    handleMainSwipe(event) {
        if (event.direction == "right") {
            router.replace({
                uri: "pages/settings/settings"
            });
        }
    },
    handleSettingsSwipe(event) {
        if (event.direction == "right") {
            this.showSettings = false;
            this.showMain = true;
        }
    }
}
