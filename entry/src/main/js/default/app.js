import storage from '@system.storage';
import router from '@system.router';

export default {
    onCreate() {
        storage.get({
            key: "password",
            default: "",
            success: (data) => {
                if (data != "") {
                    router.replace({
                        uri: "pages/unlock/unlock",
                        params: {
                            password: data
                        }
                    });
                }
            }
        })
    }
}