class BaseRepository {
    /**
     * @param {import('pg').Pool} pool
     */
    constructor(pool) {
        this.pool = pool;
    }
    /**
     * @param {string} text
     * @param {Array} params
     * @returns {Promise<Array>}
     */
    async query(text, params=[]) {
        return this.pool.query(text, params);
    }
    mapone(result,rowMapper){
        const row = result.rows[0];
        if(!row){
            return null;
        }   
        return rowMapper(row);
    }
    mapmany(result,rowMapper){
        const rows = result.rows;
        if(!rows){
            return [];
        }
        return rows.map(rowMapper);
    }
}
module.exports = BaseRepository;