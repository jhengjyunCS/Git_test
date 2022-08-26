package com.inqgen.nursing.utils;

import org.junit.Test;

import java.util.UUID;

import static org.junit.Assert.*;

public class StringUtilsTest {

    @Test
    public void generateId() {
        int hashCode = UUID.randomUUID().toString().replaceAll("-", "").hashCode();
        String lHalf = Long.toHexString(Math.abs(hashCode));
        System.out.println(lHalf);
        hashCode = String.valueOf(System.currentTimeMillis()).hashCode();
        String rHalf = Long.toHexString(Math.abs(hashCode));
        System.out.println(rHalf);
        String uid = UUID.randomUUID().toString().replaceAll("-", "");
        char pad = uid.charAt((int) (Math.random() * uid.length()));
        System.out.println(pad);
        String id = StringUtils.leftPad(lHalf + rHalf, 16, pad).toUpperCase();
        System.out.println(id);
    }
    @Test
    public void generateLabelId() {
        String label="abnc.ioasduf";
        String id=StringUtils.generateLabelId(label);
        System.out.println(id);
    }
}