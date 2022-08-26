package com.inqgen.nursing.xstream.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.FIELD})
public @interface XStreamAliasAlternate {
    /**
     * @return the alternative names of the field when it is deserialized
     */
    public String[] value() default {};
}
