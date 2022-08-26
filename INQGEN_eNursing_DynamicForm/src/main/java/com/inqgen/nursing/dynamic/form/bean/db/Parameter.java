package com.inqgen.nursing.dynamic.form.bean.db;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * @author RainKing
 * @date 2019/9/26 9:02
 */
@XStreamAlias("parameter")
public class Parameter {
    private String property;
    private String itemName;

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
}
