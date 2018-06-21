import HTTPClient from "../HTTPClient";
import {AsyncStorage} from 'react-native';

const AuthService = {
    async getAccessToken(){
        return await AsyncStorage.getItem("@user").then((response)=>{
            let resp = JSON.parse(response);
            if(resp !== null && resp.hasOwnProperty("auth_token")){
                return resp
            }else{
                let e = new Error(400);
                e.response = "!IsAuthenticated";
                throw e
            }

        })
    },
    login(data){
        return HTTPClient.post("auth/login_client/", data);
    },
    getMe(token){
        return HTTPClient.get("auth/get_me/", token);
    },
};

export default AuthService;