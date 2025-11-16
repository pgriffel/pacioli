---
title: Imperative Blocks
---

# Imperative Blocks

The `begin` and `end` keywords introduce an imperative code block. The code block consists of
a sequence of statements.

    begin
        statement
        statement
        ...
    end

The statements are evaluated sequentially until a return statement (see below) is encountered, or the
end of the sequence is reached.

A statement may return a value, or it may be void. When a statement returns a value, then
all return statements in the code block must agree on the type of the returned value. It is a runtime
error if the statement ends without a return. In a void statement all returns must be empty.
The code block is evaluted purely for its side-effect and the return statement is optional.

## Assignment

An assignment is of the form

    var := expression;

or

    (var,...,var) := expression;

For all assigned variables in a code block a mutable place is allocated. When an assignment
is evaluated the place for that variable is changed to the value of the expression.

The second form is for destructuring tuples. The expression must evaluate to a tuple and all
variables in the assignment get assigned to the corresponding tuple value.

## Return

A return statement is of the form

    return expression;

or

    return;

Evaluation of the surrounding `begin` `end` block is halted. For a non-void
statement the returned value becomes the value of the block.

## While

A while statement is of the form

    while expression do
        statements
    end

The body is a sequence of statements. It is executed as long the expression is true.

## If

An if statement is of the form

    if expression then
        statements
    else if expression then
        statements
    ...
    else
        statements
    end

The `else` and `elseif` are optional.

The statements in the first branch with a positive test are evaluated.

## Procedures

A statement can be a function application. For example

    begin
        foo()
        bar()
    end

    define foo() =
        begin
            ...
        end;

    define bar() =
        begin
            ...
        end;

The functions must have type Void. They are evaluated for the side-effect only.
