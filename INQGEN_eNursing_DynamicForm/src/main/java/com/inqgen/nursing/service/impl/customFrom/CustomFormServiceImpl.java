package com.inqgen.nursing.service.impl.customFrom;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fto.m2.M2Servlet;
import com.fto.m2.service.config.ConfigService;
import com.fto.m2.service.config.Entry;
import com.inqgen.nursing.dynamic.form.bean.CustomFormUi;
import com.inqgen.nursing.service.customFrom.CustomFormService;

import java.io.*;
import java.lang.reflect.Method;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CustomFormServiceImpl implements CustomFormService {
    String s="{\"formType\":\"adminssion10_64Form\",\"printForm\":\"<BODY>123123</BODY>\"}";
    private static final String REGEX = "<body([^^]*)/body>";
    private static final String REGEX_JSP_INCLUDE = "<jsp:include page=\"printItem.jsp\\?tag=(\\w+)[^>]+>(</jsp:include>)*";
    private static final String REGEX_JSP_FOREACH = "<c:forEach\\s+var=\"(\\w+)\"\\s+items=\"([$]*\\s*[{]*\\w*\\s*[$]*\\s*[}]*)\"\\s*varStatus=\"(\\w*)\">";
    private static final String REGEX_JSP_FOREACH_End = "</(\\s+)?c:forEach(\\s+)?>";
    private static final String REGEX_JSP_FORMAT = "<fmt:formatDate\\s*value=\"(\\$\\{\\w*\\s*[.]?\\s*\\w*\\s*[}]*)\"\\s*pattern=\"(\\s*\\w*[/]*\\w*[/]*\\w*[/]*\\s*\\w*)\"\\s*/>";
    private static final String REGEX_JSP_FORMAT2 = "<fmt:formatDate\\s*pattern=\"(\\s*\\w*[/]*\\w*[/]*\\w*[/]*\\s*\\w*)\"\\s+value=\"(\\$\\{\\w*\\s*[.]?\\s*\\w*\\s*[}]*)\"(\\s+)?[/][>]";
    private static final String REGEX_JSP_VAR = "(?<!=)(?<!')(?<!\")\\$(\\{(\\s+)*\\w+[.]\\w+(\\s+)*\\})";
    private static final String REGEX_JSP_IF = "<c:if([^^]*)/c:if>";
    private static final String REGEX_JSP_COUT = "<c:out\\s*value=\"(\\$*\\{\\w*\\s*[.]?\\s*\\w*\\s*\\})\\s*\\\"*\\s*\\/*\\>";
    private static final String REGEX_JSP_COUT_END = "</c:out>";
    private static final String REGEX_JSP_ANNOTATION = "<!--([^^]*)//-->";
    private static final String REGEX_JSP_ANNOTATION2 = "<!--([^^]*)-->";


    public String getCustomFormJsp(String formType) throws Exception
    {
        java.util.Enumeration enumeration = ConfigService.getInstance(M2Servlet.getInstance()).listEntryKeys("m2_controller");
        while (enumeration.hasMoreElements()) {
            String key = (String) enumeration.nextElement();
            if (key.equalsIgnoreCase(formType)) {
                Entry entry = ConfigService.getInstance(M2Servlet.getInstance()).getEntry("m2_controller", key);
                if (entry.getValue()!=null) {
                    Method method= entry.getValue().getClass().getMethod("getPrintForm");
                    String printForm=(String)method.invoke(entry.getValue());
                    String path = M2Servlet.getInstance().getServletContext().getRealPath(printForm);
                    CustomFormUi bean=new CustomFormUi();
                    bean.setPrintForm(transJspToHtml(path,true));
                    return JSONObject.toJSON(bean).toString();
                }
            }
        }
        return null;
    }


    public void updateCustomFormJsp(String json) throws Exception{
        CustomFormUi bean= JSON.parseObject(json,CustomFormUi.class);
        String formType=bean.getFormType();
        String printJspBody=bean.getPrintForm();

        if(formType!=null && printJspBody!=null){
            java.util.Enumeration enumeration = ConfigService.getInstance(M2Servlet.getInstance()).listEntryKeys("m2_controller");
            while (enumeration.hasMoreElements()) {
                String key = (String) enumeration.nextElement();
                if (key.equalsIgnoreCase(formType)) {
                    Entry entry = ConfigService.getInstance(M2Servlet.getInstance()).getEntry("m2_controller", key);
                    if (entry.getValue()!=null) {
                        Method method= entry.getValue().getClass().getMethod("getPrintForm");
                        String printForm=(String)method.invoke(entry.getValue());
                        String path = M2Servlet.getInstance().getServletContext().getRealPath(printForm);
                        updateJspBody(path,printJspBody);
                    }
                }
            }
        }
    }

    public void updateJspBody(String path,String body)throws Exception {
        String jspHeadPath = M2Servlet.getInstance().getServletContext().getRealPath("/WEB-INF/dynamicFormPrintHead.txt");
        StringBuffer bf=new StringBuffer();
        BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(new File(jspHeadPath)), "UTF-8"));
        while(reader.ready()){
            String line = reader.readLine();
            bf.append(line);
        }
        reader.close();
        bf.append(body);
        BufferedWriter writer=new BufferedWriter(new  OutputStreamWriter(new FileOutputStream(new File(path)), "UTF-8"));
        writer.write(bf.toString());
        writer.close();

    }




    public String transJspToHtml(String path,boolean trans) throws Exception {
        StringBuffer bf=new StringBuffer();
        BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(new File(path)), "UTF-8"));
        String reds=null;
        while((reds=reader.readLine())!=null){
            bf.append(reds);
        }
        reader.close();
        String INPUT=bf.toString();
        if(!trans)
        {
            return INPUT;
        }

        Pattern bodyPattern = Pattern.compile(REGEX, Pattern.CASE_INSENSITIVE);
        Matcher bodyMatcher = bodyPattern.matcher(INPUT); // 获取 matcher 对象
        int count = 0;
        if (bodyMatcher.find()) {
            String group = bodyMatcher.group();
            Pattern jspPattern = Pattern.compile(REGEX_JSP_INCLUDE, Pattern.CASE_INSENSITIVE);
            Matcher jspMatcher = jspPattern.matcher(group);
            while (jspMatcher.find()) {
                String group1 = jspMatcher.group(1);
                group = jspMatcher.replaceFirst("<div class='pFormItem jsp-include' page='printItem.jsp?tag=" + group1 + "&formId=\\${form.formId}'></div>");
                jspMatcher = jspPattern.matcher(group);
            }

            Pattern forEachPattern = Pattern.compile(REGEX_JSP_FOREACH, Pattern.CASE_INSENSITIVE);
            Matcher forEachMatcher = forEachPattern.matcher(group);
            while (forEachMatcher.find()) {
                String var = forEachMatcher.group(1);
                String items = forEachMatcher.group(2);
                String varstatus = forEachMatcher.group(3);
                if (items != null) {
                    items = items.replace("$", "\\$");
                }
                group = forEachMatcher.replaceFirst("<div class='c-for-each' var='" + var + "' items='" + items + "' varStatus='" + varstatus + "'>");
                forEachMatcher = forEachPattern.matcher(group);

            }


            Pattern forEachEndPattern = Pattern.compile(REGEX_JSP_FOREACH_End, Pattern.CASE_INSENSITIVE);
            Matcher forEachEndMatcher = forEachEndPattern.matcher(group);
            while (forEachEndMatcher.find()) {
                group = forEachEndMatcher.replaceFirst("</div>");
                forEachEndMatcher = forEachEndPattern.matcher(group);
            }

            Pattern formmatPattern = Pattern.compile(REGEX_JSP_FORMAT, Pattern.CASE_INSENSITIVE);
            Matcher formmatMatcher = formmatPattern.matcher(group);
            while (formmatMatcher.find()) {
                String value = formmatMatcher.group(1);
                String pattern = formmatMatcher.group(2);
                if (value != null) {
                    value = value.replace("$", "\\$");
                }

                if (pattern != null) {
                    pattern = pattern.replace("$", "\\$");
                }
                group = formmatMatcher.replaceFirst("<div class='fmt-format-date' pattern='" + pattern + "' value='" + value + "'>" + pattern + "</div>");
                formmatMatcher = formmatPattern.matcher(group);
            }


            Pattern formmatPattern2 = Pattern.compile(REGEX_JSP_FORMAT2, Pattern.CASE_INSENSITIVE);
            Matcher formmatMatcher2 = formmatPattern2.matcher(group);
            while (formmatMatcher2.find()) {
                String pattern = formmatMatcher2.group(1);
                String value = formmatMatcher2.group(2);
                if (value != null) {
                    value = value.replace("$", "\\$");
                }

                if (pattern != null) {
                    pattern = pattern.replace("$", "\\$");
                }
                group = formmatMatcher2.replaceFirst("<div class='fmt-format-date' pattern='" + pattern + "' value='" + value + "'>" + pattern + "</div>");
                formmatMatcher2 = formmatPattern2.matcher(group);
            }


            Pattern coutPattern = Pattern.compile(REGEX_JSP_COUT, Pattern.CASE_INSENSITIVE);
            Matcher coutMatcher = coutPattern.matcher(group);
            while (coutMatcher.find()) {
                String pattern = coutMatcher.group(1);
                if (pattern != null) {
                    pattern = pattern.replace("$", "\\$");
                }
                group = coutMatcher.replaceFirst("<div class='c-out'  value='" + pattern + "'>" + pattern + "</div>");
                coutMatcher = coutPattern.matcher(group);
            }
            group = group.replace(REGEX_JSP_COUT_END, "");

            Pattern varPattern = Pattern.compile(REGEX_JSP_VAR, Pattern.CASE_INSENSITIVE);
            Matcher varMatcher = varPattern.matcher(group);
            while (varMatcher.find()) {
                String value = varMatcher.group(1);
                group = varMatcher.replaceFirst("<label class='" + value + "'>" + value + "</label>");
                varMatcher = varPattern.matcher(group);
            }

            String replaceEmpty[] = {REGEX_JSP_IF, REGEX_JSP_ANNOTATION, REGEX_JSP_ANNOTATION2};
            for (int i = 0; i < replaceEmpty.length; i++) {
                Pattern ifPattern = Pattern.compile(replaceEmpty[i], Pattern.CASE_INSENSITIVE);
                Matcher ifMatcher = ifPattern.matcher(group);
                while (ifMatcher.find()) {
                    String value = ifMatcher.group();
                    group = ifMatcher.replaceFirst("");
                    ifMatcher = ifPattern.matcher(group);
                }
            }
            return group;
        }
        return null;
    }
}
