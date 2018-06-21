import {AsyncStorage} from 'react-native';


export default class HTTPClient{
    static METHODS = {
        GET: "GET",
        POST: "POST",
        PATCH: "PATCH",
        DELETE: "DELETE"
    };
    static URL = "http://icaretest.northeurope.cloudapp.azure.com/api/";
    static MEDIA_URL = "http://icaretest.northeurope.cloudapp.azure.com/";
    // static URL = "http://icareserver.me/api/";
    // static MEDIA_URL = "http://icareserver.me/";

    static async fetch(url=null, method=null,headers={}, body={}){
        let user = await AsyncStorage.getItem("@user");
        if( user !== null){
            let token = JSON.parse(user).auth_token;
            headers = {
                Authorization: "Token " + token
            }
        }
        if(!url.includes('image')){
            headers['Content-Type'] = "application/json";
        }
        headers['Accept'] = "application/json";
        let data = {
            method: method,
            headers: headers,
        };

        if(method !== "GET" && method !== "HEAD"){
            data['body'] = JSON.stringify(body)
        }

        let response = await fetch(this.URL + url, data);
        let response_body = await this.checkStatus(response);
        return response_body;
    };

    static get(path, headers={}){
        return this.fetch(path, this.METHODS.GET, headers);
    };
    static post(path, body, headers={}){
        return this.fetch(path, this.METHODS.POST, headers,body)
    };
    static patch(path,body,headers) {
        return this.fetch(path,this.METHODS.PATCH,headers,body)
    };
    static delete(path, headers={}){
        return this.fetch(path, this.METHODS.DELETE, headers);
    };


    static checkStatus(response){
        if (response.status >= 200 && response.status < 300 ) {
            if(response.status === 204){
                return [];
            }
            return response.json().then((item)=>item);
        } else {
            return response.json().then((item)=>{
                let error = new Error(item.status);
                error.response = item;
                throw error;
            });

        }
    }
};