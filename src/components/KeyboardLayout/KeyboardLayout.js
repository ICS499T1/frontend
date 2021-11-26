
import React from "react";
import './Key.css';
import { Container } from '@mui/material';

const KeyboardLayout = () => {

    return (
        <React.Fragment>
            <Container className="keyboard">
                <div className="row">
                <div className="key key__symbols">
                    ~ <span/> `
                </div>
                <div className="key key__symbols">
                    ! <span/> 1
                </div>
                <div className="key key__symbols">
                    @ <span/> 2
                </div>
                <div className="key key__symbols">
                    # <span/> 3
                </div>
                <div className="key key__symbols">
                    $ <span/> 4
                </div>
                <div className="key key__symbols">
                    % <span/> 5
                </div>
                <div className="key key__symbols">
                    ^ <span/> 6
                </div>
                <div className="key key__symbols">
                    {'&'} <span/> 7
                </div>
                <div className="key key__symbols">
                    * <span/> 8
                </div>
                <div className="key key__symbols">
                    ( <span/> 9
                </div>
                <div className="key key__symbols">
                    ) <span/> 0
                </div>
                <div className="key key__symbols">
                    _ <span/> -
                </div>
                <div className="key key__symbols">
                    + <span/> =
                </div>
                <div className="key key__delete key__icon">
                    Backspace
                </div>
                </div>
                    
                <div className="row">
                <div className="key key__oneandhalf">
                    Tab
                </div>
                <div className="key">
                    Q
                </div>
                <div className="key">
                    W
                </div>
                <div className="key">
                    E
                </div>
                <div className="key">
                    R
                </div>
                <div className="key">
                    T
                </div>
                <div className="key">
                    Y
                </div>
                <div className="key">
                    U
                </div>
                <div className="key">
                    I
                </div>
                <div className="key">
                    O
                </div>
                <div className="key">
                    P
                </div>
                <div className="key key__symbols">
                    {'{'} <span/> [
                </div>
                <div className="key key__symbols">
                    {'}'} <span/> ]
                </div>
                <div className="key key__symbols key__oneandhalf">
                    | <span/> \
                </div>
                </div>
                    
                <div className="row">
                <div className="key key__caps">
                    Caps Lock
                </div>
                <div className="key">
                    A
                </div>
                <div className="key">
                    S
                </div>
                <div className="key">
                    D
                </div>
                <div className="key">
                    F
                </div>
                <div className="key">
                    G
                </div>
                <div className="key">
                    H
                </div>
                <div className="key">
                    J
                </div>
                <div className="key">
                    K
                </div>
                <div className="key">
                    L
                </div>
                <div className="key key__symbols">
                    : <span/> ;
                </div>
                <div className="key key__symbols">
                    " <span/> '
                </div>
                <div className="key key__enter">
                    Enter
                </div>
                </div>
                
                <div className="row">
                <div className="key key__shift-left">
                    LShift
                </div>
                <div className="key">
                    Z
                </div>
                <div className="key">
                    X
                </div>
                <div className="key">
                    C
                </div>
                <div className="key">
                    V
                </div>
                <div className="key">
                    B
                </div>
                <div className="key">
                    N
                </div>
                <div className="key">
                    M
                </div>
                <div className="key key__symbols">
                    {'>'} <span/> .
                </div>
                <div className="key key__symbols">
                    {'<'} <span/> .
                </div>
                <div className="key key__symbols">
                    ? <span/> /
                </div>
                <div className="key">
                    RS
                </div>
                <div className="key key__arrow">
                    Up
                </div>
                <div className="key">
                    CF
                </div>
                </div>
                    
                <div className="row">
                <div className="key key__bottom-funct">
                    Ctrl
                </div>
                <div className="key key__bottom-funct">
                    WIN
                </div>
                <div className="key key__bottom-funct">
                    Alt
                </div>
                <div className="key key__spacebar">
                </div>
                <div className="key">
                    Alt
                </div>
                <div className="key">
                    WIN
                </div>
                <div className="key key__arrow">
                    lef
                </div>
                <div className="key key__arrow">
                    dow
                </div>
                <div className="key key__arrow">
                    rig
                </div>
                </div>
            </Container>
        </React.Fragment>
    );
  };

  export default KeyboardLayout;