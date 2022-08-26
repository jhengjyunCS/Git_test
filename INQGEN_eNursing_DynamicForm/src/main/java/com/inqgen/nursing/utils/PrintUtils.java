package com.inqgen.nursing.utils;

/**
 * @author RainKing
 * @date 2020/2/27 14:12
 */
public class PrintUtils {
    public static final boolean S_OUT_ALL ="all".equals(System.getProperty("SOut"));
    public static void printByDVm(Exception e) {
        if(S_OUT_ALL)e.printStackTrace();
    }
    public static void printByDVm(String msg) {
    }
}
