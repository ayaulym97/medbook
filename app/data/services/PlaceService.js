import HTTPClient from "../HTTPClient";

const PlaceService = {
    getCities(){
        return HTTPClient.get("cities/");
    }
};

export default PlaceService;