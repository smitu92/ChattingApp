import readData from "./read";

const reload=async (db,table,id) => {
    const user= await readData(db,table,id);
    const chatList=await readData(db,table,id);
    return user;
}

export default reload;