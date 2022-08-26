import com.inqgen.nursing.dynamic.form.bean.DynamicFormItem;
import com.inqgen.nursing.dynamic.form.bean.DynamicFormTemplate;
import com.inqgen.nursing.dynamic.form.bean.GForm;
import com.inqgen.nursing.dynamic.form.bean.GFormItem;
import com.inqgen.nursing.dynamic.webservice.DynamicFormServiceImpl;
import org.junit.Test;

import java.util.Arrays;

/**
 * @author RainKing
 * @date 2020/2/27 21:15
 */

public class ApiTest {
    @Test
    public void convertObj() {
        DynamicFormTemplate formTemplate = new DynamicFormTemplate();
        DynamicFormItem[] itemTemplates = {new DynamicFormItem(), new DynamicFormItem(), new DynamicFormItem()};
        String[] objAttrs = {"user[0].id[0].id","user[0].name","user[0].sex"};
        for (int i = 0; i < itemTemplates.length; i++) {
            itemTemplates[i].setName("name" + i);
            itemTemplates[i].setObjAttr(objAttrs[i]);
        }
        formTemplate.setItems(itemTemplates);
        GForm gForm = new GForm();
        GFormItem[] gFormItems = {new GFormItem(), new GFormItem(), new GFormItem()};
        for (int i = 0; i < gFormItems.length; i++) {
            gFormItems[i].setItemKey("name"+i);
            gFormItems[i].setItemValue("value"+i);
        }
        gForm.setGformItems(Arrays.asList(gFormItems));
        DynamicFormServiceImpl.convertToObj(formTemplate, gForm,"");
    }
    @Test
    public void testRegexp() {
        //['12341324']
    }

}
