const { MongoClient } = require('mongodb');
const url = 'mongodb://your_username:your_password@oci2.billclinternet.com:27017';
const mongoClient = new MongoClient(url);

const validatePath = (location) => {
    if (location.length < 3) {
        throw new Error("DB: Improper path (ex. operator/database/collection/id?)");
    }
    const [operator, database, collection, id] = location.map((item, index) => index === 0 ? item.toUpperCase() : item.toLowerCase());
    if (!operator) throw new Error("DB: Operator must be specified");
    if (!database) throw new Error("DB: Database must be specified");
    if (!collection) throw new Error("DB: Collection must be specified");
    return { operator, database, collection, id };
};

module.exports = async (path, options = {}) => {
    const location = path.split('/');
    const { operator, database, collection, id } = validatePath(location);

    // Check for ID
    if (['SET', 'GET', 'DEL'].includes(operator) && !id) {
        throw new Error("DB: ID must be specified");
    }

    await mongoClient.connect();
    const _db = mongoClient.db(database);
    const _collection = _db.collection(collection);

    try {
        switch (operator) {
            case 'SET':
                const existingDocument = await _collection.findOne({ id });
                const finalOptions = { ...existingDocument, ...options, id };
                if (existingDocument) {
                    await _collection.deleteOne({ id });
                }
                const insertResult = await _collection.insertOne(finalOptions);
                return insertResult.acknowledged ? finalOptions : null;

            case 'GET':
                return await _collection.findOne({ id }) || null;

            case 'DEL':
                const deleteResult = await _collection.deleteOne({ id });
                return deleteResult.deletedCount > 0;

            case 'FIND':
                return await _collection.findOne(options) || null;
            
            case 'GETALL':
                const documents = await _collection.find({}).toArray();
                return documents
            default:
                throw new Error("DB: Invalid operator supplied (ex. SET, GET, DEL)");
        }
    } catch (error) {
        console.error(error.message);
        return null;
    } finally {
        await mongoClient.close(); // Ensure the connection is closed after the operation
    }
};
