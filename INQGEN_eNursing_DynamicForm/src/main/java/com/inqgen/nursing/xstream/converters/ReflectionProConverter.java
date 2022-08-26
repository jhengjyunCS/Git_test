package com.inqgen.nursing.xstream.converters;

import com.inqgen.nursing.utils.PrintUtils;
import com.inqgen.nursing.xstream.annotations.XStreamAliasAlternate;
import com.inqgen.nursing.xstream.annotations.XStreamAsValue;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamConverter;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.converters.reflection.AbstractReflectionConverter;
import com.thoughtworks.xstream.converters.reflection.ReflectionProvider;
import com.thoughtworks.xstream.core.util.FastField;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.PrettyPrintWriter;
import com.thoughtworks.xstream.mapper.AbstractAttributeAliasingMapper;
import com.thoughtworks.xstream.mapper.AttributeAliasingMapper;
import com.thoughtworks.xstream.mapper.FieldAliasingMapper;
import com.thoughtworks.xstream.mapper.Mapper;
import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

/**
 * @author RainKing
 * @date 2019/10/15 18:17
 */
public class ReflectionProConverter extends AbstractReflectionConverter {
    private Class hasConvertClass;
    private Field valueField;
    private Map<String,Field> aliasAlternateFieldMap;

    public ReflectionProConverter(Mapper mapper, ReflectionProvider reflectionProvider) {
        super(mapper, reflectionProvider);
    }

    protected void doMarshal(final Object source, final HierarchicalStreamWriter writer, final MarshallingContext context) {
        if (valueField!=null) {
            FieldAliasingMapper fieldAliasingMapper= (FieldAliasingMapper) mapper.lookupMapperOfType(FieldAliasingMapper.class);
            if (fieldAliasingMapper != null) {
                fieldAliasingMapper.omitField(hasConvertClass,valueField.getName());
            }
        }
        super.doMarshal(source,writer,context);
        if (valueField!=null) {
            String innerValue = null;
            try {
                valueField.setAccessible(true);
                innerValue = (String) valueField.get(source);
            } catch (Exception e) {
                PrintUtils.printByDVm(e);
            }
            if (innerValue != null) {
                HierarchicalStreamWriter underlyingWriter = writer.underlyingWriter();
                if (underlyingWriter instanceof PrettyPrintWriter) {
                    try {
                        Class<? extends HierarchicalStreamWriter> underlyingWriterClass = underlyingWriter.getClass();
                        setFieldValue(underlyingWriter, "tagIsEmpty", false);
                        invokeMethod(underlyingWriterClass, underlyingWriter,"finishTag");
                        Field depth = underlyingWriterClass.getDeclaredField("depth");
                        depth.setAccessible(true);
                        int i = (Integer) depth.get(underlyingWriter)+1;
                        depth.set(underlyingWriter,i);
                        setFieldValue(underlyingWriter, "readyForNewLine", true);
                        setFieldValue(underlyingWriter, "tagIsEmpty", true);
                    } catch (Exception e) {
                        PrintUtils.printByDVm(e);
                    }
                }
                writer.setValue(innerValue);
                if (underlyingWriter instanceof PrettyPrintWriter) {
                    try {
                        Class<? extends HierarchicalStreamWriter> underlyingWriterClass = underlyingWriter.getClass();
                        Field depth = underlyingWriterClass.getDeclaredField("depth");
                        depth.setAccessible(true);
                        int i = (Integer) depth.get(underlyingWriter)-1;
                        depth.set(underlyingWriter,i);
                        setFieldValue(underlyingWriter, "readyForNewLine", false);
                        invokeMethod(underlyingWriterClass, underlyingWriter,"finishTag");
                        setFieldValue(underlyingWriter, "readyForNewLine", true);
                    } catch (Exception e) {
                        PrintUtils.printByDVm(e);
                    }
                }
            }
        }
    }

    private void invokeMethod(Class<?> aClass, Object object,String methodName,Object... args) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Method method = aClass.getDeclaredMethod(methodName);
        method.setAccessible(true);
        method.invoke(object,args);
    }

    private void setFieldValue(Object object, String fieldName, boolean b) throws IllegalAccessException, NoSuchFieldException {
        Field field = object.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(object, b);
    }

    public Object doUnmarshal(final Object result, final HierarchicalStreamReader reader, final UnmarshallingContext context) {
        if (aliasAlternateFieldMap != null) {
            try {
                Field aliasToName = AbstractAttributeAliasingMapper.class.getDeclaredField("aliasToName");
                AttributeAliasingMapper attributeAliasingMapper = (AttributeAliasingMapper) mapper.lookupMapperOfType(AttributeAliasingMapper.class);
                aliasToName.setAccessible(true);
                Map aliasToNameMap = (Map) aliasToName.get(attributeAliasingMapper);
                Field aliasToField = FieldAliasingMapper.class.getDeclaredField("aliasToFieldMap");
                FieldAliasingMapper fieldAliasingMapper = (FieldAliasingMapper) mapper.lookupMapperOfType(FieldAliasingMapper.class);
                aliasToField.setAccessible(true);
                Map aliasToFieldMap = (Map) aliasToField.get(fieldAliasingMapper);
                for (Map.Entry<String, Field> entry : aliasAlternateFieldMap.entrySet()) {
                    Field field = entry.getValue();
                    XStreamAsAttribute asAttribute = field.getAnnotation(XStreamAsAttribute.class);
                    if (asAttribute != null) {
                        aliasToNameMap.put(entry.getKey(), field.getName());
                    }else{
                        aliasToFieldMap.put(new FastField(hasConvertClass, entry.getKey()),field.getName());
                    }
                }
            } catch (Exception e) {
                PrintUtils.printByDVm(e);
            }
        }
        super.doUnmarshal(result, reader, context);
        String value = reader.getValue();
        if (StringUtils.isNotBlank(value)&&valueField!=null) {
            reflectionProvider.writeField(result,valueField.getName(),value.trim(),null);
        }
        return result;
    }

    private void autoProcessAnnotation() {
        aliasAlternateFieldMap = new HashMap<String, Field>();
        Field[] fields = hasConvertClass.getDeclaredFields();
        for (Field field : fields) {
            if (field.getAnnotation(XStreamAsValue.class) != null) {
                valueField = field;
            }
            XStreamAliasAlternate aliasAlternate=field.getAnnotation(XStreamAliasAlternate.class);
            if ( aliasAlternate!= null&&aliasAlternate.value().length>0) {
                for (String alias : aliasAlternate.value()) {
                    aliasAlternateFieldMap.put(alias, field);
                }
            }
        }
        if (aliasAlternateFieldMap.size() == 0) {
            aliasAlternateFieldMap = null;
        }
    }

    public boolean canConvert(Class type) {
        boolean canConvert;
        if (type!=null) {
            XStreamConverter xStreamConverter = (XStreamConverter) type.getAnnotation(XStreamConverter.class);
            canConvert = xStreamConverter != null && xStreamConverter.value().equals(this.getClass());
            if (!canConvert) {
                canConvert=canConvert(type.getSuperclass());
            }else{
                hasConvertClass = type;
                autoProcessAnnotation();
            }
        } else {
            canConvert = false;
        }
        return canConvert;
    }
}
