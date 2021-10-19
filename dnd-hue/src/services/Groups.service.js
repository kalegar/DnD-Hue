import axios from 'axios';

const baseURL = process.env.VUE_APP_HUE_BRIDGE_ADDRESS + 'api/' + process.env.VUE_APP_HUE_USER;

export const GroupsService = {

    getGroups: function() {
        return new Promise((resolve, reject) => {
            const url = baseURL + '/groups';
            axios.get(url)
            .then(res => {
                if (res.status != 200) {
                    reject(res.statusText);
                    return;
                }
                let result = [];
                for (const group in res.data) {
                    let obj = res.data[group];
                    obj.index = group;
                    result.push(obj);
                }
                resolve(result);
            }).catch(err => {
               reject(err);
            })
        });
        
    }

}