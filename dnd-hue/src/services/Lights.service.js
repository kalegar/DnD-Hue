import axios from 'axios';

const baseURL = process.env.VUE_APP_HUE_BRIDGE_ADDRESS + 'api/' + process.env.VUE_APP_HUE_USER;

export const LightsService = {

    getLights: function() {
        return new Promise((resolve, reject) => {
            const url = baseURL + '/lights';
            axios.get(url)
            .then(res => {
                if (res.status != 200) {
                    reject(res.statusText);
                    return;
                }
                let result = [];
                for (const light in res.data) {
                    let obj = res.data[light];
                    obj.index = light;
                    result.push(obj);
                }
                resolve(result);
            }).catch(err => {
               reject(err);
            })
        });
        
    }

}