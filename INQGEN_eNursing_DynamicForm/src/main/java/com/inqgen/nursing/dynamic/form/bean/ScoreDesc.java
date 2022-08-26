package com.inqgen.nursing.dynamic.form.bean;

import com.thoughtworks.xstream.annotations.XStreamAlias;

/**
 * @author RainKing
 * @date 2019/5/21 17:02
 */
@XStreamAlias("ScoreDesc")
public class ScoreDesc {
    /**
     * 運算表達式
     * score 分數
     * age 病人年齡
     * eg:(score>=3&&age>1)||score>=5&&age>10
     */
    private String arithmetic;
    /**描述**/
    private String desc;
    /**是否是正常情況*/
    private Boolean normal;

    public String getArithmetic() {
        return arithmetic;
    }

    public void setArithmetic(String arithmetic) {
        this.arithmetic = arithmetic;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Boolean getNormal() {
        return normal;
    }

    public void setNormal(Boolean normal) {
        this.normal = normal;
    }
}
