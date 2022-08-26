package com.inqgen.nursing.dynamic.form.dao.impl;

import com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparisonItem;
import com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparisonValue;
import com.inqgen.nursing.dynamic.form.dao.GFormComparison;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import java.util.List;
import java.util.Map;

/**
 * @Author wang
 * @Date 2022/2/10 15:59
 */
public class GFormComparisonImpl extends SqlMapClientDaoSupport implements GFormComparison {

    public List<GFormComparisonItem> selectGFormComparisonItemList(){
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormComparison.selectGFormComparisonItemList");
    }

    public List<GFormComparisonValue> selectGFormComparisonValueList(Map<String, String> map){
        return getSqlMapClientTemplate().queryForList("com.inqgen.nursing.dynamic.form.dao.GFormComparison.selectGFormComparisonValueList", map);
    }

}