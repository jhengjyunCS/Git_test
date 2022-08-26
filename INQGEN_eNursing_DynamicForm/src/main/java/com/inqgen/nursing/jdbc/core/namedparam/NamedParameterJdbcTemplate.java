package com.inqgen.nursing.jdbc.core.namedparam;

import com.inqgen.nursing.jdbc.core.ColumnMapRowMapper;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import javax.sql.DataSource;
import java.util.List;
import java.util.Map;

/**
 * @author RainKing
 * @date 2019/9/27 14:42
 */
public class NamedParameterJdbcTemplate extends org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate {

    public NamedParameterJdbcTemplate(DataSource dataSource){
        super(dataSource);
    }

    public int[] batchUpdate(String sql, Map<String, ?>[] batchValues) {
        return batchUpdate(sql, SqlParameterSourceUtils.createBatch(batchValues));
    }

    public int[] batchUpdate(String sql, SqlParameterSource[] batchArgs) {
        return NamedParameterBatchUpdateUtils.executeBatchUpdateWithNamedParameters(
                getParsedSql(sql), batchArgs, getJdbcOperations());
    }

    public List<Map<String, Object>> queryForList(String sql, Map<String, ?> paramMap)
            throws DataAccessException {

        return query(sql, new MapSqlParameterSource(paramMap),new ColumnMapRowMapper());
    }
}
