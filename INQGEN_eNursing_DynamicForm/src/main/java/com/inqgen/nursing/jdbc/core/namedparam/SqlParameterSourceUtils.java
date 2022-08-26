/*
 * Copyright 2002-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.inqgen.nursing.jdbc.core.namedparam;

import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;

import java.util.Map;

/**
 * Class that provides helper methods for the use of {@link SqlParameterSource},
 * in particular with {@link NamedParameterJdbcTemplate}.
 *
 * @author Thomas Risberg
 * @since 2.5
 */
public class SqlParameterSourceUtils {

	/**
	 * Create an array of {@link MapSqlParameterSource} objects populated with data from
	 * the values passed in. This will define what is included in a batch operation.
	 * @param valueMaps array of {@link Map} instances containing the values to be used
	 * @return an array of {@link SqlParameterSource}
	 * @see MapSqlParameterSource
	 * @see NamedParameterJdbcTemplate#batchUpdate(String, Map[])
	 */
	public static SqlParameterSource[] createBatch(Map<String, ?>[] valueMaps) {
		MapSqlParameterSource[] batch = new MapSqlParameterSource[valueMaps.length];
		for (int i = 0; i < valueMaps.length; i++) {
			batch[i] = new MapSqlParameterSource(valueMaps[i]);
		}
		return batch;
	}

	/**
	 * Create an array of {@link BeanPropertySqlParameterSource} objects populated with data
	 * from the values passed in. This will define what is included in a batch operation.
	 * @param beans object array of beans containing the values to be used
	 * @return an array of {@link SqlParameterSource}
	 * @see BeanPropertySqlParameterSource
	 * @see NamedParameterJdbcTemplate#batchUpdate(String, SqlParameterSource[])
	 */
	public static SqlParameterSource[] createBatch(Object[] beans) {
		BeanPropertySqlParameterSource[] batch = new BeanPropertySqlParameterSource[beans.length];
		for (int i = 0; i < beans.length; i++) {
			batch[i] = new BeanPropertySqlParameterSource(beans[i]);
		}
		return batch;
	}

}
