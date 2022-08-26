package com.inqgen.nursing.utils;

import java.util.Map;

public class MapUtils {
    private MapUtils() {
    }

    public static <K,V>  void putAllIgnoreExist(Map<K, V> original, Map<? extends K, ? extends V> target) {
        if (original != null&&target!=null) {
            for (Map.Entry<? extends K, ? extends V> entry : target.entrySet()) {
                if (!original.containsKey(entry.getKey())) {
                    original.put(entry.getKey(), entry.getValue());
                }
            }
        }
    }
}
