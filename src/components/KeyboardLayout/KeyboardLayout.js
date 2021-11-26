
import React from "react";
// import './Key.css';
import { Container, Box } from '@mui/material';
import MultipleSymbolKey from "./MultipleSymbolKey";
import Backspace from "./Backspace";
import Tab from "./Tab";
import Key from "./Key";
import PipeKey from "./PipeKey";
import CapsLock from "./CapsLock";
import ReturnKey from "./ReturnKey";
import LShift from "./LShift";
import RShift from "./RShift";
import BottomFunctionKey from "./BottomFunctionKey";
import Spacebar from "./Spacebar";

const KeyboardLayout = ({user}) => {

    return (
        <React.Fragment>
            <Box>
            <Container className="keyboard">
                <Box display="flex" justifyContent="center" alignItems="center" sx={{height: 48, mt: .5}} >
                    <MultipleSymbolKey top={'~'} bottom={'`'} user={user} />
                    <MultipleSymbolKey top={'!'} bottom={'1'} user={user} />
                    <MultipleSymbolKey top={'@'} bottom={'2'} user={user} />
                    <MultipleSymbolKey top={'#'} bottom={'3'} user={user} />
                    <MultipleSymbolKey top={'$'} bottom={'4'} user={user} />
                    <MultipleSymbolKey top={'%'} bottom={'5'} user={user} />
                    <MultipleSymbolKey top={'^'} bottom={'6'} user={user} />
                    <MultipleSymbolKey top={'&'} bottom={'7'} user={user} />
                    <MultipleSymbolKey top={'*'} bottom={'8'} user={user} />
                    <MultipleSymbolKey top={'('} bottom={'9'} user={user} />
                    <MultipleSymbolKey top={')'} bottom={'0'} user={user} />
                    <MultipleSymbolKey top={'_'} bottom={'-'} user={user} />
                    <MultipleSymbolKey top={'+'} bottom={'='} user={user} />
                    <Backspace />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{height: 48, mt: .5}} >
                    <Tab />
                    <Key big='Q' small='q' user={user} />
                    <Key big='W' small='w' user={user} />
                    <Key big='E' small='e' user={user} />
                    <Key big='R' small='r' user={user} />
                    <Key big='T' small='t' user={user} />
                    <Key big='Y' small='y' user={user} />
                    <Key big='U' small='u' user={user} />
                    <Key big='I' small='i' user={user} />
                    <Key big='O' small='o' user={user} />
                    <Key big='P' small='p' user={user} />
                    <MultipleSymbolKey top={'{'} bottom={'['} user={user} />
                    <MultipleSymbolKey top={'}'} bottom={']'} user={user} />
                    <PipeKey top={'|'} bottom={'\\'} user={user} />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{height: 48, mt: .5}} >
                    <CapsLock />
                    <Key big='A' small='a' user={user} />
                    <Key big='S' small='s' user={user} />
                    <Key big='D' small='d' user={user} />
                    <Key big='F' small='f' user={user} />
                    <Key big='G' small='g' user={user} />
                    <Key big='H' small='h' user={user} />
                    <Key big='J' small='j' user={user} />
                    <Key big='K' small='k' user={user} />
                    <Key big='L' small='l' user={user} />
                    <MultipleSymbolKey top={':'} bottom={';'} user={user} />
                    <MultipleSymbolKey top={'"'} bottom={'\''} user={user} />
                    <ReturnKey />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{height: 48, mt: .5}} >
                    <LShift />
                    <Key big='Z' small='z' user={user} />
                    <Key big='X' small='x' user={user} />
                    <Key big='C' small='c' user={user} />
                    <Key big='V' small='v' user={user} />
                    <Key big='B' small='b' user={user} />
                    <Key big='N' small='n' user={user} />
                    <Key big='M' small='m' user={user} />
                    <MultipleSymbolKey top={'<'} bottom={','} user={user} />
                    <MultipleSymbolKey top={'>'} bottom={'.'} user={user} />
                    <MultipleSymbolKey top={'?'} bottom={'/'} user={user} />
                    <RShift />
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{height: 48, mt: .5}} >
                    <BottomFunctionKey keyType={"CTRL"} />
                    <BottomFunctionKey keyType={"WIN"} />
                    <BottomFunctionKey keyType={"ALT"} />
                    <Spacebar user={user} />
                    <BottomFunctionKey keyType={"ALT"} />
                    <BottomFunctionKey keyType={"WIN"} />
                    <BottomFunctionKey keyType={"RCLCK"} />
                    <BottomFunctionKey keyType={"CTRL"} />
                </Box>
            </Container>
            </Box>
        </React.Fragment>
    );
  };

  export default KeyboardLayout;