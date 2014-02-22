---
title: Pacioli Specification
layout: default
---

Pacioli Specification
=====================


--------------------------------------------------------------------------------

Contents
--------
    
* [General](#general)
* [Matrix](#matrix)
* [List]("#list")
* [Statements](#statements)



General <a id="general"/></a>
------------------------

    identity :: for_type a: (a) -> a
    apply :: for_type a,b: (a -> b, a) -> b
    tuple :: for_type a: a -> a
    print :: for_type a: (a) -> a


Boolean <a id="matrix"/></a>
---------------------------------

    not :: (Boole()) -> Boole()
    equal :: for_type a: (a, a) -> Boole()

    index_less :: for_index P: (P, P) -> Boole()
    less :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()
    less_eq :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()


Matrix <a id="matrix"/></a>
---------------------------------

### Shape

#### 

Constructs a matrix and fills it with the values from the list of tiples.
A list of indices from the row domain of the matrix.


    matrix_from_tuples :: for_index P,Q: for_unit a: (List(Tuple(P, Q, a))) -> a*P! per Q!
    row_domain :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(P)
    column_domain :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(Q)
    get :: for_index P,Q: for_unit a: (a*P! per Q!, P, Q) -> a
    get_num :: for_index D,E: for_unit a,b,c: (a*D!b per E!c, D, E) -> 1
    row :: for_index P,Q: for_unit a,v: (a*P! per Q!v, P) -> a per Q!v
    column :: for_index P,Q: for_unit a,v: (a*P!v per Q!, Q) -> a*P!v
    rows :: for_index P,Q: for_unit a,v: (a*P! per Q!v) -> List(a per Q!v)
    columns :: for_index P,Q: for_unit a,u: (a*P!u per Q!) -> List(a*P!u)
    magnitude :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P! per Q!
    unit :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v
    unit_factor :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a
    row_units :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P!u
    column_units :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v
    map_matrix :: for_index P,Q: for_unit a,b: ((a) -> b, a*P! per Q!) -> b*P! per Q!
    diagonal :: for_index P: for_unit a,u: (a*P!u) -> a*P!u per P!u
    diagonal2 :: for_index P: for_unit a,u: (a*P!u) -> a*P!u per P!
    left_identity :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P!u per P!u
    right_identity :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per Q!v
    delta :: for_index P: (P) -> P!
    basis :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> List(D!)
    support :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    positive_support :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    negative_support :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    positives :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c
    negatives :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c

### Numerical
    
    negative :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v
    transpose :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a/Q!v per 1/P!u
    reciprocal :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> 1/P!u per a/Q!v
    scale :: for_index P,Q: for_unit a,b,u,v: (a, b*P!u per Q!v) -> a*b*P!u per Q!v
    sum :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    multiply :: for_index P,Q: for_unit a,b,u,w,v,z: (a*P!u per Q!v, b*P!w per Q!z) -> a*b*P!u*P!w per Q!v*Q!z
    div :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u/P!x per b/Q!v/Q!y
    join :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*Q!v per R!w) -> a*b*P!u per R!w
    power :: for_index P: for_unit u: (P!u per P!u, 1) -> P!u per P!u
    expt :: for_index P,Q: (P! per Q!, 1) -> P! per Q!
    exp :: for_index P,Q: (P! per Q!) -> P! per Q!
    inner :: for_index P: for_unit a,b,u: (a*P!u, b/P!u) -> a*b
    outer :: for_index P,Q: for_unit a,b,u,v: (a*P!u, b*Q!v) -> a*b*P!u per 1/Q!v
    dual :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    per_op :: for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f*H!g per E!c) -> a*D!b per f*H!g
    total :: for_index P,Q: for_unit a: (a*P! per Q!) -> a
    divide :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u/P!x per b*Q!v/Q!y
    left_divide :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> b*P!x/P!u per a*Q!y/Q!v
    scale_down :: for_index P,Q: for_unit a,b,u,v: (a*P!u per Q!v, b) -> a*P!u per b*Q!v
    minus :: for_index D,E: for_unit a,b,c: (a*D!b per E!c, a*D!b per E!c) -> a*D!b per E!c
    ln :: for_index P,Q: (P! per Q!) -> P! per Q!
    log :: for_index P,Q: (P! per Q!, 1) -> P! per Q!
    sqrt :: for_index P,Q: for_unit a,u,v: (a^2*P!u^2 per Q!v^2) -> a*P!u per Q!v
    abs :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v
    mod :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u per Q!v
    min :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    max :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    gcd :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> P! per Q!
    
### Inverses and Closures

    right_inverse :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    inverse :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    left_division :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*P!u per R!w) -> b*Q!v per a*R!w
    right_division :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*R!w per Q!v) -> a*P!u per b*R!w
    left_inverse :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    kleene :: for_index P: for_unit u: (P!u per P!u) -> P!u per P!u
    closure :: for_index P: for_unit u: (P!u per P!u) -> P!u per P!u

### Trigonometry

    sin :: for_index P,Q: (radian*P! per Q!) -> P! per Q!
    cos :: for_index P,Q: (radian*P! per Q!) -> P! per Q!
    tan :: for_index P,Q: (radian*P! per Q!) -> P! per Q!
    asin :: for_index P,Q: (P! per Q!) -> radian*P! per Q!
    acos :: for_index P,Q: (P! per Q!) -> radian*P! per Q!
    atan :: for_index P,Q: (P! per Q!) -> radian*P! per Q!
    atan2 :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> radian*P! per Q!


List <a id="list"/></a>
---------------------

    append :: for_type a: (List(a), List(a)) -> List(a)
    zip :: for_type a,b: (List(a), List(b)) -> List(Tuple(a, b))
    naturals :: (1) -> List(1)
    list_size :: for_type a: (List(a)) -> 1
    singleton_list :: for_type a: (a) -> List(a)
    add_mut :: for_type a: (List(a), a) -> List(a)
    empty_list :: for_type a: () -> List(a)
    tail :: for_type a: (List(a)) -> List(a)
    loop_list :: for_type a,b: (a, (a, b) -> a, List(b)) -> a
    nth :: for_type a: (1, List(a)) -> a
    head :: for_type a: (List(a)) -> a
    fold_list :: for_type a: ((a, a) -> a, List(a)) -> a
    cons :: for_type a: (a, List(a)) -> List(a)


    map_list :: for_type a,b: ((a) -> b, List(a)) -> List(b)
    reverse :: for_type a: (List(a)) -> List(a)
    combis :: for_type a: (List(a)) -> List(Tuple(a, a))

Misc <a id="list"/></a>
-----------------------
    
    error :: for_type a: (1) -> a
    new_ref :: for_type a: () -> Ref(a)
    ref_set :: for_type a: (Ref(a), a) -> Void()
    ref_get :: for_type a: (Ref(a)) -> a
    skip :: () -> Void()
    _ :: Index()
    solve :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*P!u per R!w) -> b*Q!v per a*R!w
    plu :: for_index P: for_unit a,u: (a*P!u per P!u) -> Tuple(P!u per P!u, P!u per P!u, a*P!u per P!u)
    svd :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Tuple(P!u per P!u, a*P!u per Q!v, 1/Q!v per 1/Q!v)
    not_equal :: for_type a: (a, a) -> Boole()
    log_not :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c
    make_matrix :: for_index A,B: for_unit c: (List(Tuple(A, B, c))) -> c*A! per B!

