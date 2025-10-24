import axios from "axios";

const MainAppUrl=axios.create({baseURL:"http://localhost:2001"});

export default MainAppUrl;