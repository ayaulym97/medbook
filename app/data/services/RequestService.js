import HTTPClient from "../HTTPClient";

export const RequestService ={
    getDoctorsBySpec(data){
        return HTTPClient.post("request/doctors_by_spec/", data);
    },
    getListSpec(){
        return HTTPClient.get("list_speciality/?all=0");
    },
    searchDoc(data){
        return HTTPClient.post("request/doctor_search/", data)
    },
    requestService(data){
        return HTTPClient.post("request/service_search/", data);
    },
    requestSpeciality(data){
        return HTTPClient.post("request/spec_search/", data);
    }
};