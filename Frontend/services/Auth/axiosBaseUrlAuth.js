import axios from "axios";

const AuthBaseUrl=axios.create({
    baseURL:"http://localhost:2000"
})
export default AuthBaseUrl;