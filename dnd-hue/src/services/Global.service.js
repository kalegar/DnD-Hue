import axios from 'axios';

const baseURL = '/api/global';

export const GlobalService = {

    getGlobalBrightness: function() {
        return new Promise((resolve, reject) => {
            const url = baseURL + '/brightness';
            axios.get(url)
            .then(res => {
                if (res.status != 200) {
                    reject(res.statusText);
                    return;
                }
                resolve(res.data.brightness);
            }).catch(err => {
               reject(err);
            })
        });
    },

    setGlobalBrightness: function(brightness) {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/brightness`;
            axios.post(url, { brightness })
            .then(res => {
                if (res.status != 201) {
                    reject(res.statusText);
                    return;
                }
                if (!res.data) {
                    reject('No data returned.');
                    return
                }
                resolve(res.data.brightness);
            }).catch(err => {
                reject(err);
            })
        });
    }

}