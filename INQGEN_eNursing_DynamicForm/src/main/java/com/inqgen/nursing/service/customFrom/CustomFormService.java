package com.inqgen.nursing.service.customFrom;

public interface CustomFormService {

    public String getCustomFormJsp(String formType)throws Exception;
    public void updateCustomFormJsp(String json) throws Exception;
}
