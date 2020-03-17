package mvm.parser;

import java_cup.runtime.Symbol;
import java_cup.runtime.ComplexSymbolFactory;
import java_cup.runtime.ComplexSymbolFactory.Location;
import java.io.File;
import java.io.IOException;
import pacioli.PacioliException;

%%
%public
%class Lexer
%cup
%implements sym
%char
%line
%column

%{
    StringBuffer string = new StringBuffer();
    public Lexer(java.io.Reader in, ComplexSymbolFactory sf, File file, String source){
	this(in);
	symbolFactory = sf;
        this.file = file;
        this.source = source;
    }
    File file;
    String source;
    ComplexSymbolFactory symbolFactory;

  private Symbol symbol(String name, int sym) {
      return symbolFactory.newSymbol(name, sym, new Location(yyline, yycolumn, yychar), new Location(yyline, yycolumn+yylength(), yychar+yylength()));
  }

  private Symbol symbol(String name, int sym, Object val) {
      Location left = new Location(yyline,yycolumn,yychar);
      Location right= new Location(yyline,yycolumn+yylength(), yychar+yylength());
      return symbolFactory.newSymbol(name, sym, left, right,val);
  }
  private Symbol symbol(String name, int sym, Object val,int buflength) {
      Location left = new Location(yyline, yycolumn+yylength()-buflength, yychar+yylength()-buflength);
      Location right= new Location(yyline, yycolumn+yylength(), yychar+yylength());
      return symbolFactory.newSymbol(name, sym, left, right,val);
  }
  private void error(String message) throws IOException {
    pacioli.Location from = new pacioli.Location(file, yyline, yycolumn, yychar);
    pacioli.Location to = new pacioli.Location(file, yyline, yycolumn+yylength(), yychar+yylength());
    throw new IOException(new PacioliException(from.join(to), message));
  }
%}

%eofval{
     return symbolFactory.newSymbol("EOF", EOF, new Location(yyline,yycolumn,yychar), new Location(yyline,yycolumn,yychar));
%eofval}

Ident = [a-zA-Z$_] [a-zA-Z0-9$_]*
Natural = [0-9]+
Decimal = [0-9]+\.[0-9]+
//Boolean = true | false
Newline = \r|\n|\r\n;
Whitespace = {Newline} | [ \t\f]
LineTerminator = \r|\n|\r\n
InputCharacter = [^\r\n]

/* comments */
Comment = {TraditionalComment} | {EndOfLineComment}

TraditionalComment   = "/*" [^*] ~"*/" | "/*" "*"+ "/"
// Comment can be the last line of the file, without line terminator.
EndOfLineComment     = "#" {InputCharacter}* {LineTerminator}?


%state STRINGSEQ

%%

<YYINITIAL>{

  /* keywords */
  "require"               { return symbol("require", REQUIRE); } 
  "baseunit"              { return symbol("baseunit", BASEUNIT); } 
  "unit"                  { return symbol("unit", UNIT); }
  "indexset"              { return symbol("indexset", INDEXSET); }
  "unitvector"            { return symbol("unitvector", UNITVECTOR); }
  "load"                  { return symbol("load", LOAD); }
  "store"                 { return symbol("store", STORE); }
  "print"                 { return symbol("print", PRINT); }
  "application"           { return symbol("application", APPLICATION); }
  "lambda"                { return symbol("lambda", LAMBDA); }
  "var"                   { return symbol("var", VAR); }
  "const"                 { return symbol("const", CONST); }
  "string"                { return symbol("string", STRING); }
  "if"                    { return symbol("if", IF); }
  "bang"                  { return symbol("bang", BANG); }
  "key"                   { return symbol("key", KEY); }
  "application_debug"     { return symbol("application_debug", APPLICATION_DEBUG); }
  "path"                  { return symbol("path", PATH); }
  "list"                  { return symbol("list", LIST); }
  "matrix"                { return symbol("matrix", MATRIX); }
  "index"                 { return symbol("index", INDEX); }
  "scaled_unit"           { return symbol("scaled_unit", SCALED_UNIT); }
  "bang_shape"            { return symbol("bang_shape", BANG_SHAPE); }
  "unit_expt"             { return symbol("unit_expt", UNIT_EXPT); }
  "unit_mult"             { return symbol("unit_mult", UNIT_MULT); }
  "unit_div"              { return symbol("unit_div", UNIT_DIV); }
  "scalar_shape"          { return symbol("scalar_shape", SCALAR_SHAPE); }
  "shape_unop"            { return symbol("shape_unop", SHAPE_UNOP); }
  "shape_binop"           { return symbol("shape_binop", SHAPE_BINOP); }
  "shape_expt"            { return symbol("shape_expt", SHAPE_EXPT); }
  "matrix_constructor"    { return symbol("matrix_constructor", MATRIX_CONSTRUCTOR); }
  "literal_matrix"        { return symbol("literal_matrix", LITERAL_MATRIX); }

  /* literals */
  {Natural}         { return symbol("Natural", NATURAL, yytext()); }
  {Decimal}         { return symbol("Decimal", DECIMAL, yytext()); }
//  {Boolean}         { return symbol("Boolean", BOOLEAN, yytext()); }

  /* symbols */
  \"              { string.setLength(0); yybegin(STRINGSEQ); }

  ";"               { return symbol("semicolon", SEMICOLON); }
  ":"               { return symbol("colon", COLON); }
  ","               { return symbol("comma", COMMA); }
  "("               { return symbol("(", LPAR); }
  ")"               { return symbol(")", RPAR); }
  "^"               { return symbol("hat", HAT); }
  "-"               { return symbol("neg", NEG); }
  "*"               { return symbol("mult", MULT); }
  "/"               { return symbol("div", DIV); }


  /* names */
  {Ident}      { return symbol("Ident",IDENT, yytext()); }

  {Comment}         { /* ignore */ }

  {Whitespace}      { /* ignore */ }

}

<STRINGSEQ> {
  \"              { yybegin(YYINITIAL); 
                    return symbol("String", STR, string.toString(), string.length()); }
  [^\n\r\"\\]+    { string.append(yytext()); }
  \\t             { string.append('\t'); }
  \\n             { string.append('\n'); }
  \\r             { string.append('\r'); }
  \\\"            { string.append('\"'); }
  \\              { string.append('\\'); }
}


/* error fallback */
[^]               { /* throw new Error("Illegal character <"+ yytext()+">");*/
		    error("Illegal character <"+ yytext()+">");
                  }
