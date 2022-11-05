package pacioli.parser;

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
      //return symbolFactory.newSymbol(name, sym, new Location(yyline+1,yycolumn+1,yychar), new Location(yyline+1,yycolumn+yylength(),yychar+yylength()));
      return symbolFactory.newSymbol(name, sym, new Location(yyline, yycolumn, yychar), new Location(yyline, yycolumn+yylength(), yychar+yylength()));
  }

  private Symbol symbol(String name, int sym, Object val) {
      Location left = new Location(yyline, yycolumn, yychar);
      Location right= new Location(yyline, yycolumn+yylength(), yychar+yylength());
      return symbolFactory.newSymbol(name, sym, left, right,val);
  }
  
  // Seems wrong. The right line can be on a lower line in a string!
  private Symbol symbol(String name, int sym, Object val,int buflength) {
      Location left = new Location(yyline, yycolumn+yylength()-buflength, yychar+yylength()-buflength);
      Location right= new Location(yyline, yycolumn+yylength(), yychar+yylength());
      return symbolFactory.newSymbol(name, sym, left, right,val);
  }
  private void error(String message) {
    //pacioli.Location errorLocation = new pacioli.Location(file, source, yychar, yychar+yylength());
    pacioli.Location from = new pacioli.Location(file, yyline, yycolumn, yychar);
    pacioli.Location to = new pacioli.Location(file, yyline, yycolumn+yylength(), yychar+yylength());
    pacioli.Location errorLocation = from.join(to);
    throw new RuntimeException("Parse error", new PacioliException(errorLocation, message));
  }
%}

%eofval{
     return symbolFactory.newSymbol("EOF", EOF, new Location(yyline, yycolumn, yychar), new Location(yyline, yycolumn, yychar));
%eofval}

Identifier = [a-zA-Z$_] [a-zA-Z0-9$_]*
Natural = [0-9]+
Decimal = [0-9]+\.[0-9]+
Boolean = true | false
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
  "if"              { return symbol("if",IF); }
  "then"            { return symbol("then",THEN); }
  "else"            { return symbol("else",ELSE); }
  "begin"           { return symbol("begin",BEGIN); }
  "end"             { return symbol("end",END); }
  "while"           { return symbol("while",WHILE); }
  "do"              { return symbol("do",DO); }
  "let"             { return symbol("let",LET); }
  "in"              { return symbol("in",IN); }
  "return"          { return symbol("return",RETURN); }
  "per"             { return symbol("per",PER); }
  "module"          { return symbol("module",MODULE); }
  "include"         { return symbol("include",INCLUDE); }
  "import"          { return symbol("import",IMPORT); }
  "define"          { return symbol("define",DEFINE); }
  "declare"         { return symbol("declare",DECLARE); }
  "defindex"        { return symbol("defindex",DEFINDEX); }
  "deftype"         { return symbol("deftype",DEFTYPE); }
  "defunit"         { return symbol("defunit",DEFUNIT); }
  "defmatrix"       { return symbol("defmatrix",DEFMATRIX); }
  "defalias"        { return symbol("defalias",DEFALIAS); }
  "defconv"         { return symbol("defconv",DEFCONV); }
  "defproj"         { return symbol("defproj",DEFPROJ); }
  "public"          { return symbol("public", PUBLIC); }
  "for_type"        { return symbol("for_type",FORTYPE); }
  "for_index"       { return symbol("for_index",FORINDEX); }
  "for_unit"        { return symbol("for_unit",FORUNIT); }
  "lambda"          { return symbol("lambda",LAMBDA); }

  /* literals */
  {Natural}         { return symbol("Natural", NATURAL, yytext()); }
  {Decimal}         { return symbol("Decimal", DECIMAL, yytext()); }
  {Boolean}         { return symbol("Boolean", BOOLEAN, yytext()); }

  /* symbols */
  \"              { string.setLength(0); yybegin(STRINGSEQ); }
  ";"               { return symbol("semicolon",SEMICOLON); }
  "::"              { return symbol("dblcln",DBLCLN); }
  ":="              { return symbol(":=",ASSIGN); }
  ":"               { return symbol("colon",COLON); }
  ","               { return symbol("comma",COMMA); }
  "("               { return symbol("(",LPAR); }
  ")"               { return symbol(")",RPAR); }
  "{"               { return symbol("{",LBRC); }
  "}"               { return symbol("}",RBRC); }
  "["               { return symbol("{",LBRACK); }
  "]"               { return symbol("}",RBRACK); }
  "|"               { return symbol("|",PIPE); }
  "<-"              { return symbol("<-",FROM); }
  "@"               { return symbol("@", AT); }

  "^T"              { return symbol("trans", TRANS); }
  "^D"              { return symbol("diminv", DIMINV); }
  "^R"              { return symbol("reci", RECI); }

  "="               { return symbol("eql", EQL, EQL); }
  "!"               { return symbol("excl", EXCL); }
  "^"               { return symbol("hat", HAT, HAT); }
  "-"               { return symbol("neg", NEG, NEG); }
  "->"              { return symbol("to", TO, TO); }

  "+"               { return symbol("plus", PLUS); }
  "*"               { return symbol("mult", MULT); }
  "'*'"             { return symbol("mmult", MMULT); }
  "'^'"             { return symbol("mexpt", MEXPT); }
  "/"               { return symbol("div", DIV); }
  "'/'"             { return symbol("mdiv", MDIV); }  
  "\\"              { return symbol("leftdiv", LEFTDIV); }
  "'\\'"            { return symbol("mleftdiv", MLEFTDIV); }
  "'.*'"            { return symbol("lscale", LSCALE); }
  "'*.'"            { return symbol("rscale", RSCALE); }
  "'./'"            { return symbol("lscaledown", LSCALEDOWN); }
  "'/.'"            { return symbol("rscaledown",RSCALEDOWN); }
  "%"               { return symbol("mod", MOD); }
  "<="              { return symbol("leq", LEQ); }
  ">="              { return symbol("gtq", GTQ); }
  "!="              { return symbol("neq", NEQ); }
  "<"               { return symbol("le", LE); }
  ">"               { return symbol("gt", GT); }
  "<=="             { return symbol("followsfrom", FOLLOWSFROM); }
  "==>"             { return symbol("implies", IMPLIES); }
  "<=>"             { return symbol("equiv", EQUIV); }
  "and"             { return symbol("and", AND); }
  "or"              { return symbol("or", OR); }

  /* names */
  {Identifier}      { return symbol("Identifier",IDENTIFIER, yytext()); }

  {Comment}         { /* ignore */ }

  {Whitespace}      { /* ignore */ }

}

<STRINGSEQ> {
  \"              { yybegin(YYINITIAL); 
                    return symbol("String", STRING, string.toString(), string.length()); }
  [^\"\\]+    { string.append(yytext()); }
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
