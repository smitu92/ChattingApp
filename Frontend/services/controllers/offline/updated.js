// services/offline/controllers/updated.js



import readData from "./read";

/**
 * Update data in Dexie database
 * @param {Object} db - Dexie database instance
 * @param {string} storeName - Name of the object store (table)
 * @param {Object} data - Data to update (must include primary key)
 * @returns {Promise<any>} - Updated record or error
 */
export default async function updateData(db, storeName, data,id) {
  try {
    // Validate inputs
    if (!db) {
      throw new Error("Database instance is required");
    }
    if (!storeName) {
      throw new Error("Store name is required");
    }
    if (!data) {
      throw new Error("Data is required");
    }

    // Get the primary key field (usually '_id' or 'id')
    const primaryKey = data._id || data.id;
    
    if (!primaryKey) {
      throw new Error("Data must include a primary key (_id or id)");
    }

    console.log(`📝 Updating ${storeName}:`, primaryKey);

    // Update the record in Dexie
    // put() will update if exists, insert if doesn't exist
    console.log("data from Dexie",data);
    await db[storeName].put(data);
    // // await db[storeName].update(id, data);
    // console.log(id);
    // const user=await readData(db,"user",id);
    // console.log(user);

    console.log(`✅ Successfully updated ${storeName}:`, primaryKey);
    
    return data;
  } catch (error) {
    console.error(`❌ Error updating ${storeName}:`, error);
    throw error;
  }
}

/**
 * Update specific fields of a record (partial update)
 * @param {Object} db - Dexie database instance
 * @param {string} storeName - Name of the object store
 * @param {string|number} key - Primary key of the record to update
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<any>} - Updated record or error
 */
export async function updateFields(db, storeName, key, updates) {
  try {
    if (!db || !storeName || !key || !updates) {
      throw new Error("Missing required parameters");
    }

    console.log(`📝 Updating fields in ${storeName}:`, key, updates);

    // Use Dexie's update method for partial updates
    const updatedCount = await db[storeName].update(key, updates);

    if (updatedCount === 0) {
      throw new Error(`No record found with key: ${key}`);
    }

    console.log(`✅ Successfully updated ${updatedCount} record(s)`);
    
    // Return the updated record
    const updatedRecord = await db[storeName].get(key);
    return updatedRecord;
  } catch (error) {
    console.error(`❌ Error updating fields in ${storeName}:`, error);
    throw error;
  }
}

/**
 * Bulk update multiple records
 * @param {Object} db - Dexie database instance
 * @param {string} storeName - Name of the object store
 * @param {Array<Object>} dataArray - Array of records to update
 * @returns {Promise<Array>} - Array of updated records
 */
export async function bulkUpdateData(db, storeName, dataArray) {
  try {
    if (!db || !storeName || !Array.isArray(dataArray)) {
      throw new Error("Invalid parameters for bulk update");
    }

    console.log(`📝 Bulk updating ${dataArray.length} records in ${storeName}`);

    await db[storeName].bulkPut(dataArray);

    console.log(`✅ Successfully bulk updated ${dataArray.length} records`);
    
    return dataArray;
  } catch (error) {
    console.error(`❌ Error in bulk update for ${storeName}:`, error);
    throw error;
  }
}