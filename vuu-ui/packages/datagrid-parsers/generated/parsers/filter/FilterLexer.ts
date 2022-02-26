// Generated from ./src/grammars/Filter.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class FilterLexer extends Lexer {
	public static readonly TRUE = 1;
	public static readonly FALSE = 2;
	public static readonly AND = 3;
	public static readonly OR = 4;
	public static readonly AS = 5;
	public static readonly LT = 6;
	public static readonly GT = 7;
	public static readonly EQ = 8;
	public static readonly NEQ = 9;
	public static readonly IN = 10;
	public static readonly CONTAINS = 11;
	public static readonly STARTS = 12;
	public static readonly ENDS = 13;
	public static readonly LBRACK = 14;
	public static readonly RBRACK = 15;
	public static readonly LPAREN = 16;
	public static readonly RPAREN = 17;
	public static readonly COMMA = 18;
	public static readonly COLON = 19;
	public static readonly INT = 20;
	public static readonly FLOAT = 21;
	public static readonly INT_ABBR = 22;
	public static readonly FLOAT_ABBR = 23;
	public static readonly STRING = 24;
	public static readonly ID_STRING = 25;
	public static readonly ID_NUMERIC = 26;
	public static readonly ID = 27;
	public static readonly WS = 28;

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"TRUE", "FALSE", "AND", "OR", "AS", "LT", "GT", "EQ", "NEQ", "IN", "CONTAINS", 
		"STARTS", "ENDS", "LBRACK", "RBRACK", "LPAREN", "RPAREN", "COMMA", "COLON", 
		"INT", "FLOAT", "INT_ABBR", "FLOAT_ABBR", "STRING", "ID_STRING", "ID_NUMERIC", 
		"ID", "WS",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'true'", "'false'", "'and'", "'or'", "'as'", "'<'", "'>'", 
		"'='", "'!='", "'in'", "'contains'", "'starts'", "'ends'", "'['", "']'", 
		"'('", "')'", "','", "':'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "TRUE", "FALSE", "AND", "OR", "AS", "LT", "GT", "EQ", "NEQ", 
		"IN", "CONTAINS", "STARTS", "ENDS", "LBRACK", "RBRACK", "LPAREN", "RPAREN", 
		"COMMA", "COLON", "INT", "FLOAT", "INT_ABBR", "FLOAT_ABBR", "STRING", 
		"ID_STRING", "ID_NUMERIC", "ID", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(FilterLexer._LITERAL_NAMES, FilterLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return FilterLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(FilterLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "Filter.g4"; }

	// @Override
	public get ruleNames(): string[] { return FilterLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return FilterLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return FilterLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return FilterLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x1E\xC3\b\x01" +
		"\x04\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06" +
		"\x04\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r" +
		"\t\r\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t" +
		"\x12\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t" +
		"\x17\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t" +
		"\x1C\x04\x1D\t\x1D\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\b\x03" +
		"\b\x03\t\x03\t\x03\n\x03\n\x03\n\x03\v\x03\v\x03\v\x03\f\x03\f\x03\f\x03" +
		"\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x10\x03" +
		"\x10\x03\x11\x03\x11\x03\x12\x03\x12\x03\x13\x03\x13\x03\x14\x03\x14\x03" +
		"\x15\x06\x15\x7F\n\x15\r\x15\x0E\x15\x80\x03\x16\x06\x16\x84\n\x16\r\x16" +
		"\x0E\x16\x85\x03\x16\x03\x16\x07\x16\x8A\n\x16\f\x16\x0E\x16\x8D\v\x16" +
		"\x03\x17\x06\x17\x90\n\x17\r\x17\x0E\x17\x91\x03\x17\x03\x17\x03\x18\x06" +
		"\x18\x97\n\x18\r\x18\x0E\x18\x98\x03\x18\x03\x18\x06\x18\x9D\n\x18\r\x18" +
		"\x0E\x18\x9E\x03\x18\x03\x18\x03\x19\x03\x19\x07\x19\xA5\n\x19\f\x19\x0E" +
		"\x19\xA8\v\x19\x03\x19\x03\x19\x03\x1A\x06\x1A\xAD\n\x1A\r\x1A\x0E\x1A" +
		"\xAE\x03\x1B\x06\x1B\xB2\n\x1B\r\x1B\x0E\x1B\xB3\x03\x1C\x03\x1C\x07\x1C" +
		"\xB8\n\x1C\f\x1C\x0E\x1C\xBB\v\x1C\x03\x1D\x06\x1D\xBE\n\x1D\r\x1D\x0E" +
		"\x1D\xBF\x03\x1D\x03\x1D\x02\x02\x02\x1E\x03\x02\x03\x05\x02\x04\x07\x02" +
		"\x05\t\x02\x06\v\x02\x07\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\v\x15\x02" +
		"\f\x17\x02\r\x19\x02\x0E\x1B\x02\x0F\x1D\x02\x10\x1F\x02\x11!\x02\x12" +
		"#\x02\x13%\x02\x14\'\x02\x15)\x02\x16+\x02\x17-\x02\x18/\x02\x191\x02" +
		"\x1A3\x02\x1B5\x02\x1C7\x02\x1D9\x02\x1E\x03\x02\x07\x06\x02MMOOmmoo\x07" +
		"\x02\"\"/02;C\\c|\x05\x02C\\aac|\x07\x02/02;B\\aac|\x05\x02\v\f\x0F\x0F" +
		"\"\"\x02\xCD\x02\x03\x03\x02\x02\x02\x02\x05\x03\x02\x02\x02\x02\x07\x03" +
		"\x02\x02\x02\x02\t\x03\x02\x02\x02\x02\v\x03\x02\x02\x02\x02\r\x03\x02" +
		"\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11\x03\x02\x02\x02\x02\x13\x03\x02" +
		"\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17\x03\x02\x02\x02\x02\x19\x03\x02" +
		"\x02\x02\x02\x1B\x03\x02\x02\x02\x02\x1D\x03\x02\x02\x02\x02\x1F\x03\x02" +
		"\x02\x02\x02!\x03\x02\x02\x02\x02#\x03\x02\x02\x02\x02%\x03\x02\x02\x02" +
		"\x02\'\x03\x02\x02\x02\x02)\x03\x02\x02\x02\x02+\x03\x02\x02\x02\x02-" +
		"\x03\x02\x02\x02\x02/\x03\x02\x02\x02\x021\x03\x02\x02\x02\x023\x03\x02" +
		"\x02\x02\x025\x03\x02\x02\x02\x027\x03\x02\x02\x02\x029\x03\x02\x02\x02" +
		"\x03;\x03\x02\x02\x02\x05@\x03\x02\x02\x02\x07F\x03\x02\x02\x02\tJ\x03" +
		"\x02\x02\x02\vM\x03\x02\x02\x02\rP\x03\x02\x02\x02\x0FR\x03\x02\x02\x02" +
		"\x11T\x03\x02\x02\x02\x13V\x03\x02\x02\x02\x15Y\x03\x02\x02\x02\x17\\" +
		"\x03\x02\x02\x02\x19e\x03\x02\x02\x02\x1Bl\x03\x02\x02\x02\x1Dq\x03\x02" +
		"\x02\x02\x1Fs\x03\x02\x02\x02!u\x03\x02\x02\x02#w\x03\x02\x02\x02%y\x03" +
		"\x02\x02\x02\'{\x03\x02\x02\x02)~\x03\x02\x02\x02+\x83\x03\x02\x02\x02" +
		"-\x8F\x03\x02\x02\x02/\x96\x03\x02\x02\x021\xA2\x03\x02\x02\x023\xAC\x03" +
		"\x02\x02\x025\xB1\x03\x02\x02\x027\xB5\x03\x02\x02\x029\xBD\x03\x02\x02" +
		"\x02;<\x07v\x02\x02<=\x07t\x02\x02=>\x07w\x02\x02>?\x07g\x02\x02?\x04" +
		"\x03\x02\x02\x02@A\x07h\x02\x02AB\x07c\x02\x02BC\x07n\x02\x02CD\x07u\x02" +
		"\x02DE\x07g\x02\x02E\x06\x03\x02\x02\x02FG\x07c\x02\x02GH\x07p\x02\x02" +
		"HI\x07f\x02\x02I\b\x03\x02\x02\x02JK\x07q\x02\x02KL\x07t\x02\x02L\n\x03" +
		"\x02\x02\x02MN\x07c\x02\x02NO\x07u\x02\x02O\f\x03\x02\x02\x02PQ\x07>\x02" +
		"\x02Q\x0E\x03\x02\x02\x02RS\x07@\x02\x02S\x10\x03\x02\x02\x02TU\x07?\x02" +
		"\x02U\x12\x03\x02\x02\x02VW\x07#\x02\x02WX\x07?\x02\x02X\x14\x03\x02\x02" +
		"\x02YZ\x07k\x02\x02Z[\x07p\x02\x02[\x16\x03\x02\x02\x02\\]\x07e\x02\x02" +
		"]^\x07q\x02\x02^_\x07p\x02\x02_`\x07v\x02\x02`a\x07c\x02\x02ab\x07k\x02" +
		"\x02bc\x07p\x02\x02cd\x07u\x02\x02d\x18\x03\x02\x02\x02ef\x07u\x02\x02" +
		"fg\x07v\x02\x02gh\x07c\x02\x02hi\x07t\x02\x02ij\x07v\x02\x02jk\x07u\x02" +
		"\x02k\x1A\x03\x02\x02\x02lm\x07g\x02\x02mn\x07p\x02\x02no\x07f\x02\x02" +
		"op\x07u\x02\x02p\x1C\x03\x02\x02\x02qr\x07]\x02\x02r\x1E\x03\x02\x02\x02" +
		"st\x07_\x02\x02t \x03\x02\x02\x02uv\x07*\x02\x02v\"\x03\x02\x02\x02wx" +
		"\x07+\x02\x02x$\x03\x02\x02\x02yz\x07.\x02\x02z&\x03\x02\x02\x02{|\x07" +
		"<\x02\x02|(\x03\x02\x02\x02}\x7F\x042;\x02~}\x03\x02\x02\x02\x7F\x80\x03" +
		"\x02\x02\x02\x80~\x03\x02\x02\x02\x80\x81\x03\x02\x02\x02\x81*\x03\x02" +
		"\x02\x02\x82\x84\x042;\x02\x83\x82\x03\x02\x02\x02\x84\x85\x03\x02\x02" +
		"\x02\x85\x83\x03\x02\x02\x02\x85\x86\x03\x02\x02\x02\x86\x87\x03\x02\x02" +
		"\x02\x87\x8B\x070\x02\x02\x88\x8A\x042;\x02\x89\x88\x03\x02\x02\x02\x8A" +
		"\x8D\x03\x02\x02\x02\x8B\x89\x03\x02\x02\x02\x8B\x8C\x03\x02\x02\x02\x8C" +
		",\x03\x02\x02\x02\x8D\x8B\x03\x02\x02\x02\x8E\x90\x043;\x02\x8F\x8E\x03" +
		"\x02\x02\x02\x90\x91\x03\x02\x02\x02\x91\x8F\x03\x02\x02\x02\x91\x92\x03" +
		"\x02\x02\x02\x92\x93\x03\x02\x02\x02\x93\x94\t\x02\x02\x02\x94.\x03\x02" +
		"\x02\x02\x95\x97\x042;\x02\x96\x95\x03\x02\x02\x02\x97\x98\x03\x02\x02" +
		"\x02\x98\x96\x03\x02\x02\x02\x98\x99\x03\x02\x02\x02\x99\x9A\x03\x02\x02" +
		"\x02\x9A\x9C\x070\x02\x02\x9B\x9D\x042;\x02\x9C\x9B\x03\x02\x02\x02\x9D" +
		"\x9E\x03\x02\x02\x02\x9E\x9C\x03\x02\x02\x02\x9E\x9F\x03\x02\x02\x02\x9F" +
		"\xA0\x03\x02\x02\x02\xA0\xA1\t\x02\x02\x02\xA10\x03\x02\x02\x02\xA2\xA6" +
		"\x07$\x02\x02\xA3\xA5\t\x03\x02\x02\xA4\xA3\x03\x02\x02\x02\xA5\xA8\x03" +
		"\x02\x02\x02\xA6\xA4\x03\x02\x02\x02\xA6\xA7\x03\x02\x02\x02\xA7\xA9\x03" +
		"\x02\x02\x02\xA8\xA6\x03\x02\x02\x02\xA9\xAA\x07$\x02\x02\xAA2\x03\x02" +
		"\x02\x02\xAB\xAD\x07u\x02\x02\xAC\xAB\x03\x02\x02\x02\xAD\xAE\x03\x02" +
		"\x02\x02\xAE\xAC\x03\x02\x02\x02\xAE\xAF\x03\x02\x02\x02\xAF4\x03\x02" +
		"\x02\x02\xB0\xB2\x07p\x02\x02\xB1\xB0\x03\x02\x02\x02\xB2\xB3\x03\x02" +
		"\x02\x02\xB3\xB1\x03\x02\x02\x02\xB3\xB4\x03\x02\x02\x02\xB46\x03\x02" +
		"\x02\x02\xB5\xB9\t\x04\x02\x02\xB6\xB8\t\x05\x02\x02\xB7\xB6\x03\x02\x02" +
		"\x02\xB8\xBB\x03\x02\x02\x02\xB9\xB7\x03\x02\x02\x02\xB9\xBA\x03\x02\x02" +
		"\x02\xBA8\x03\x02\x02\x02\xBB\xB9\x03\x02\x02\x02\xBC\xBE\t\x06\x02\x02" +
		"\xBD\xBC\x03\x02\x02\x02\xBE\xBF\x03\x02\x02\x02\xBF\xBD\x03\x02\x02\x02" +
		"\xBF\xC0\x03\x02\x02\x02\xC0\xC1\x03\x02\x02\x02\xC1\xC2\b\x1D\x02\x02" +
		"\xC2:\x03\x02\x02\x02\x0E\x02\x80\x85\x8B\x91\x98\x9E\xA6\xAE\xB3\xB9" +
		"\xBF\x03\b\x02\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!FilterLexer.__ATN) {
			FilterLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(FilterLexer._serializedATN));
		}

		return FilterLexer.__ATN;
	}

}

