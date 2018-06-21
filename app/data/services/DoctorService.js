import HTTPClient from "../HTTPClient";


const DoctorService = {
    getSpecialities(){
        return HTTPClient.get("list_speciality/");
    },
    postDoctorWorkTime(data){
        return HTTPClient.post("request/client_confirm/",data);
    },
    doctorRequest(data) {
        return HTTPClient.post("request/create_doctor_request/",data);
    },
    getDoctorProfile(doctorId){
        return HTTPClient.get("doctor/"+ doctorId);
    },
    createRequest(data){
        return HTTPClient.post("request/", data);
    },
    getResults(id){
        return HTTPClient.get("request/get_requests/?request="+id);
    },
    getProcedures() {
        return HTTPClient.get("list_service/?type=0&all=0");
    },
    getSurveys(){
        return HTTPClient.get("list_service/?type=1&all=0");
    }
};

export default DoctorService;