package com.inqgen.nursing.poi;

/**
 * @author RainKing
 * @date 2019/11/6 16:17
 */
public class ValueComment<Value,Comment> {
    private Value value;
    private Comment comment;

    public ValueComment(Value value) {
        this.value = value;
    }

    public ValueComment(Value value, Comment comment) {
        this.value = value;
        this.comment = comment;
    }

    public Value getValue() {
        return value;
    }

    public void setValue(Value value) {
        this.value = value;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }
}
