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
* [List](#list)


General <a id="general"/></a>
------------------------

    apply :: for_type a,b: (a -> b, a) -> b
    equal :: for_type a: (a, a) -> Boole()
    identity :: for_type a: (a) -> a
    not :: (Boole()) -> Boole()
    not_equal :: for_type a: (a, a) -> Boole()
    printed :: for_type a: (a) -> a
    print :: for_type a: (a) -> Void()
    tuple :: for_type a: a -> a


Matrix <a id="matrix"/></a>
---------------------------------

    _ :: Index()
    abs :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v
    acos :: for_index P,Q: (P! per Q!) -> radian*P! per Q!
    asin :: for_index P,Q: (P! per Q!) -> radian*P! per Q!
    atan2 :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> radian*P! per Q!
    atan :: for_index P,Q: (P! per Q!) -> radian*P! per Q!
    azimuth :: for_unit a: (a*Space!) -> radian
    basis :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> List(D!)
    bottom :: for_index P,Q: for_unit a,u,v: (1, a*P!u per Q!v) -> a*P!u per Q!v
    closure :: for_index P: for_unit u: (P!u per P!u) -> P!u per P!u
    column_domain :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(Q)
    column :: for_index P,Q: for_unit a,v: (a*P!v per Q!, Q) -> a*P!v
    columns :: for_index P,Q: for_unit a,u: (a*P!u per Q!) -> List(a*P!u)
    column_units :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v
    combis :: for_type a: (List(a)) -> List(Tuple(a, a))
    cos :: for_index P,Q: (radian*P! per Q!) -> P! per Q!
    cross :: for_unit a: (a*Space!, a*Space!) -> a^2*Space!
    cross_sqrt :: for_unit a: (a*Space!, a*Space!) -> a*Space!
    cube :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a^3*D!b^3 per E!c^3
    delta :: for_index P: (P) -> P!
    diagonal2 :: for_index P: for_unit a,u: (a*P!u) -> a*P!u per P!
    diagonal :: for_index P: for_unit a,u: (a*P!u) -> a*P!u per P!u
    dim_div :: for_index D,E,H: for_unit a,b,c,f,g: (a*D!b per E!c, f*H!g per E!c) -> a*D!b per f*H!g
    dim_inv :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    div :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u/P!x per b/Q!v/Q!y
    divide :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u/P!x per b*Q!v/Q!y
    dot :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*Q!v per R!w) -> a*b*P!u per R!w
    d_x :: Space!
    d_y :: Space!
    d_z :: Space!
    exp :: for_index P,Q: (P! per Q!) -> P! per Q!
    expt :: for_index P,Q: (P! per Q!, 1) -> P! per Q!
    fraction :: for_index D,E: for_unit a,b,c: (a*D!b per E!c, a*D!b per E!c) -> percent*D! per E!
    from_percentage :: for_index D,E: (percent*D! per E!) -> D! per E!
    gcd :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> P! per Q!
    get :: for_index P,Q: for_unit a: (a*P! per Q!, P, Q) -> a
    get_num :: for_index D,E: for_unit a,b,c: (a*D!b per E!c, D, E) -> 1
    greater_eq :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()
    greater :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()
    inclination :: for_unit a: (a*Space!) -> radian
    index_less :: for_index P: (P, P) -> Boole()
    inner :: for_index P: for_unit a,b,u: (a*P!u, b/P!u) -> a*b
    inverse :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    is_zero_column :: for_index D,E: for_unit a,b,c: (a*D!b per E!c, E) -> Boole()
    is_zero :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> Boole()
    is_zero_row :: for_index D,E: for_unit a,b,c: (a*D!b per E!c, D) -> Boole()
    kleene :: for_index P: for_unit u: (P!u per P!u) -> P!u per P!u
    left_divide :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!x/P!u per b*Q!y/Q!v
    left_division :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*P!u per R!w) -> b*Q!v per a*R!w
    left_identity :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P!u per P!u
    left_inverse :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    less_eq :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()
    less :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> Boole()
    list_all :: (List(Boole())) -> Boole()
    list_gcd :: for_index A,B: (List(A! per B!)) -> A! per B!
    list_max :: for_index D,E: for_unit a,b,c: (List(a*D!b per E!c)) -> a*D!b per E!c
    list_min :: for_index D,E: for_unit a,b,c: (List(a*D!b per E!c)) -> a*D!b per E!c
    list_sum :: for_index D,E: for_unit a,b,c: (List(a*D!b per E!c)) -> a*D!b per E!c
    ln :: for_index P,Q: (P! per Q!) -> P! per Q!
    log :: for_index P,Q: (P! per Q!, 1) -> P! per Q!
    log_not :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c
    lscale_down :: for_index P,Q: for_unit a,b,u,v: (a, b*P!u per Q!v) -> a*P!u per b*Q!v
    magnitude :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P! per Q!
    make_matrix :: for_index P,Q: for_unit a: (List(Tuple(P, Q, a))) -> a*P! per Q!
    map_matrix :: for_index P,Q: for_unit a,b: ((a) -> b, a*P! per Q!) -> b*P! per Q!
    mapnz :: for_index P,Q: for_unit a,b: ((a) -> b, a*P! per Q!) -> b*P! per Q!
    max :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    min :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    minus :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    mod :: for_index P,Q: for_unit a,b,u,v,x,y: (a*P!u per Q!v, b*P!x per Q!y) -> a*P!u per Q!v
    multiply :: for_index P,Q: for_unit a,b,u,w,v,z: (a*P!u per Q!v, b*P!w per Q!z) -> a*b*P!u*P!w per Q!v*Q!z
    negative :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v
    negatives :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c
    negative_support :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    normalized :: for_index P: for_unit a: (a*P!) -> a*P!
    norm :: for_index P: for_unit a: (a*P!) -> a
    outer :: for_index P,Q: for_unit a,b,u,v: (a*P!u, b*Q!v) -> a*b*P!u per 1/Q!v
    percent_conv :: percent
    pi :: 1
    plu :: for_index P: for_unit a,u: (a*P!u per P!u) -> Tuple(P!u per P!u, P!u per P!u, a*P!u per P!u)
    polar2cartesian :: for_unit a: (a, radian, radian) -> a*Space!
    positives :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a*D!b per E!c
    positive_support :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    power :: for_index P: for_unit u: (P!u per P!u, 1) -> P!u per P!u
    qr :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Tuple(P!u per P!u, a*P!u per Q!v)
    random :: () -> 1
    ranking :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P! per Q!
    reciprocal :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> 1/P!u per a/Q!v
    right_division :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*R!w per Q!v) -> a*P!u per b*R!w
    right_identity :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per Q!v
    right_inverse :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> Q!v per a*P!u
    rotation :: (radian, radian, radian) -> Space! per Space!
    row_domain :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(P)
    row :: for_index P,Q: for_unit a,v: (a*P! per Q!v, P) -> a per Q!v
    rows :: for_index P,Q: for_unit a,v: (a*P! per Q!v) -> List(a per Q!v)
    row_units :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> P!u
    rscale :: for_index P,Q: for_unit a,b,u,v: (a*P!u per Q!v, b) -> a*b*P!u per Q!v
    scale_down :: for_index P,Q: for_unit a,b,u,v: (a*P!u per Q!v, b) -> a*P!u per b*Q!v
    scale :: for_index P,Q: for_unit a,b,u,v: (a, b*P!u per Q!v) -> a*b*P!u per Q!v
    signed_volume :: for_unit a: (a*Space!, a*Space!, a*Space!) -> a^3
    signum :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    sin :: for_index P,Q: (radian*P! per Q!) -> P! per Q!
    solve :: for_index P,Q,R: for_unit a,b,u,v,w: (a*P!u per Q!v, b*P!u per R!w) -> b*Q!v per a*R!w
    space_vec :: for_unit a: (a, a, a) -> a*Space!
    sqr :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> a^2*D!b^2 per E!c^2
    sqrt :: for_index P,Q: for_unit a,u,v: (a^2*P!u^2 per Q!v^2) -> a*P!u per Q!v
    sum :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v, a*P!u per Q!v) -> a*P!u per Q!v
    support :: for_index D,E: for_unit a,b,c: (a*D!b per E!c) -> D! per E!
    surface_area :: for_unit a: (List(Tuple(a*Space!, a*Space!, a*Space!))) -> a^2
    surface_volume :: for_unit a: (List(Tuple(a*Space!, a*Space!, a*Space!))) -> a^3
    svd :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> List(Tuple(a, P!u, 1/Q!v))
    tan :: for_index P,Q: (radian*P! per Q!) -> P! per Q!
    to_percentage :: for_index D,E: (D! per E!) -> percent*D! per E!
    top :: for_index P,Q: for_unit a,u,v: (1, a*P!u per Q!v) -> a*P!u per Q!v
    total :: for_index P,Q: for_unit a: (a*P! per Q!) -> a
    transpose :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a/Q!v per 1/P!u
    triangle_area :: for_unit a: (a*Space!, a*Space!, a*Space!) -> a^2
    unit_factor :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a
    unit :: for_index P,Q: for_unit a,u,v: (a*P!u per Q!v) -> a*P!u per Q!v
    x_rotation :: (radian) -> Space! per Space!
    y_rotation :: (radian) -> Space! per Space!
    z_rotation :: (radian) -> Space! per Space!




List <a id="list"/></a>
---------------------

    append :: for_type a: (List(a), List(a)) -> List(a)
    cons :: for_type a: (a, List(a)) -> List(a)
    contains :: for_type a: (List(a), a) -> Boole()
    empty_list :: for_type a: () -> List(a)
    fold_list :: for_type a: ((a, a) -> a, List(a)) -> a
    head :: for_type a: (List(a)) -> a
    list_size :: for_type a: (List(a)) -> 1
    loop_list :: for_type a,b: (a, (a, b) -> a, List(b)) -> a
    map_list :: for_type a,b: ((a) -> b, List(a)) -> List(b)
    naturals :: (1) -> List(1)
    nth :: for_type a: (1, List(a)) -> a
    reverse :: for_type a: (List(a)) -> List(a)
    singleton_list :: for_type a: (a) -> List(a)
    sort_list :: for_type a: (List(a), (a, a) -> Boole()) -> List(a)
    tail :: for_type a: (List(a)) -> List(a)
    zip :: for_type a,b: (List(a), List(b)) -> List(Tuple(a, b))


