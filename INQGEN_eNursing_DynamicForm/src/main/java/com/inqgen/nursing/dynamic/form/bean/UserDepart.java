package com.inqgen.nursing.dynamic.form.bean;

import java.util.Set;

/**
 * @author RainKing
 * @date 2019/11/20 18:27
 */
public class UserDepart {
    private String userId;
    private Set<String> departIds;
    private Set<String> groupIds;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Set<String> getDepartIds() {
        return departIds;
    }

    public void setDepartIds(Set<String> departIds) {
        this.departIds = departIds;
    }

    public Set<String> getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(Set<String> groupIds) {
        this.groupIds = groupIds;
    }
}
