package com.inqgen.nursing.dynamic.form.bean;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * @author RainKing
 * @date 2020/2/26 12:00
 */
@XStreamAlias("FormDittoTemplate")
public class FormDittoTemplate {
    /**要被ditto的元件*/
    private String beanName;
    /**result的key: gForm.gformItemMap.itemName.itemValue*/
    private String value;

    public String getBeanName() {
        return beanName;
    }

    public void setBeanName(String beanName) {
        this.beanName = beanName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
