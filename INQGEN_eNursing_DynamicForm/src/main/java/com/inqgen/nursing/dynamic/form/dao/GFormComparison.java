package com.inqgen.nursing.dynamic.form.dao;

import com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparisonItem;
import com.inqgen.nursing.dynamic.form.bean.comparison.GFormComparisonValue;

import java.util.List;
import java.util.Map;

/**
 * @Author wang
 * @Date 2022/2/10 15:59
 */
public interface GFormComparison {

    public List<GFormComparisonItem> selectGFormComparisonItemList();

    public List<GFormComparisonValue> selectGFormComparisonValueList(Map<String, String> map);

}
