import axios from 'axios';

const baseURL = '/api/music';

export const MusicService = {

    getMusic: function() {
        return new Promise((resolve, reject) => {
            const url = baseURL;
            axios.get(url)
            .then(res => {
                if (res.status != 200) {
                    reject(res.statusText);
                    return;
                }
                resolve(res.data);
            }).catch(err => {
               reject(err);
            })
        });
    },

    uploadMusic: function(upload) {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/`;
            let formData = new FormData();
            formData.append("file",upload.file);
            formData.append("title", upload.title);
            axios.post(url, formData)
            .then(res => {
                if (res.status != 201) {
                    reject(res.statusText);
                    return;
                }
                if (!res.data) {
                    reject('No data returned.');
                    return
                }
                resolve(res.data);
            }).catch(err => {
                reject(err);
            })
        });
    },

    deleteMusic: function(id) {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/${id}`;
            axios.delete(url)
            .then(res => {
                if (res.status != 200) {
                    reject(res.statusText);
                    return;
                }
                resolve(res.statusText);
            }).catch(err => {
                reject(err);
            })
        })
    },

}