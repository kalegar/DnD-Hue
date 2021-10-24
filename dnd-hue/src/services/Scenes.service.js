import axios from 'axios';

const baseURL = '/api/scenes';

export const ScenesService = {

    getScenes: function() {
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

    createScene: function(scene) {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/`;
            axios.post(url, scene)
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

    updateScene: function(scene) {
        return new Promise((resolve, reject) => {
            if (! ('id' in scene)) {
                reject('ID Missing from scene.');
                return;
            }
            const url = `${baseURL}/${scene.id}`;
            axios.post(url, scene)
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

    deleteScene: function(id) {
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

    activateScene: function(id) {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/${id}/activate`;
            axios.post(url)
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

    deactivateScene: function(id) {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/${id}/deactivate`;
            axios.post(url)
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

    getActiveScenes: function() {
        return new Promise((resolve, reject) => {
            const url = `${baseURL}/?active`;
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
    }

}