const readData=async (db,table,id)=>{
    try {
      const data=await db[table].get(id);
        return data;
    } catch (error) {
         console.error(`it is error while reading data ${db} and table ${table}`)
         throw error;
    }

}
export const readDatas=async (db,table) => {
    try {
        const data=await db[table].where('participents');
        console.log(data);
    } catch (e) {
         console.error(`it is error while reading data ${db} and table ${table}`);
         throw e;
    }
}

export default readData;