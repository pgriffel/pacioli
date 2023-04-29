/* Runtime Support for the Pacioli language
 *
 * Copyright (c) 2022 Paul Griffioen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { SIUnit } from './context';
import { DimNum } from './dim-num';
import { Token, tokenize } from './tokenizer';


/**
 * Hardcoded regular expressions for the tokens in dimensioned number experessions.
 */
 const dimNumTokens = [
    { tag: 'scaled', regex: "([a-zA-Z]\\w*)\s*:\s*([a-zA-Z]\\w*)" },
    { tag: 'identifier', regex: "([a-zA-Z]\\w*)" },
    { tag: 'decimal', regex: "(\\d+.\\d+)" },
    { tag: 'integer', regex: "(\\d+)" },
    { tag: 'times', regex: "\\*" },
    { tag: 'div', regex: "\\/" },
    { tag: 'power', regex: "\\^" },
    { tag: 'left', regex: "\\(" },
    { tag: 'right', regex: "\\)" }
]


/**
 * Type used by the parse functions. Value num is the result and value rest
 * the remaining tokens that still need to be parsed.
 */
 type ParseResult = {
    num: DimNum,
    rest: Token[]
}


/**
 * Parse a unit expression from a string.
 * 
 * @param expr The expression to parse
 * @param baseCallback Function that maps a base name to an SIUnit
 * @param scaledBaseCallback Function that maps a prefix and a base name to an SIUnit
 * @returns 
 */
export function parseDimNum(
    expr: string,
    baseCallback: (name: string) => SIUnit,
    scaledBaseCallback: (prefix: string, input: string) => SIUnit
): DimNum {

    const result = parseDimNumRec(tokenize(expr, dimNumTokens), baseCallback, scaledBaseCallback)
    
    if (result.rest.length === 0) {
        return result.num
    } else {
        throw new Error(`Trash after unit at position ${result.rest[0].position}`)
    }
}


/**
 * Helper for parseDimNum
 */
function parseDimNumRec(
    tokens: Token[],
    baseCallback: (name: string) => SIUnit,
    scaledBaseCallback: (prefix: string, input: string) => SIUnit
): ParseResult {

    if (tokenize.length === 0) {
        throw new Error("Expected unit")
    }

    // Parse a term
    const termResult = parseTerm(tokens, baseCallback, scaledBaseCallback)

    // The number and remaining tokens we will return
    let num = termResult.num
    let rest = termResult.rest

    // Keep parsing multiplication and division from left to right
    while (rest.length > 0 && (rest[0].tag === 'times' || rest[0].tag === 'div')) {

        const second = rest[0]

        switch (second.tag) {
            case 'times': {
                const rec = parseTerm(rest.slice(1), baseCallback, scaledBaseCallback)
                num = num.mult(rec.num)
                rest = rec.rest
                break;
            }
            case 'div': {
                const rec = parseTerm(rest.slice(1), baseCallback, scaledBaseCallback)
                num = num.div(rec.num)
                rest = rec.rest
                break;
            }
        }
    }

    // Return the result
    return { num, rest }
}


/**
 * Helper for parseDimNum
 */
function parseTerm(
    tokens: Token[],
    baseCallback: (name: string) => SIUnit,
    scaledBaseCallback: (prefix: string, input: string) => SIUnit
): ParseResult {

    if (tokenize.length === 0) {
        throw new Error("Expected unit term")
    }

    // Get the first token
    const head = tokens[0]

    // The dimensioned number and remaining tokens we are gonna return
    let num = undefined
    let rest = undefined

    // Try to match possible tokens. Exponentiation is done below
    switch (head.tag) {
        case 'left': {
            const unit = parseDimNumRec(tokens.slice(1), baseCallback, scaledBaseCallback)
            if (unit.rest.length === 0) {
                throw new Error("missing closing parenthesis opening at " + head.position)
            } else {
                if (unit.rest[0].tag === 'right') {
                    num = unit.num
                    rest = unit.rest.slice(1)
                } else {
                    throw new Error("Missing closing parenthesis opening at " + head.position)
                }
            }
            break;
        }
        case 'scaled': {

            num = DimNum.fromUnit(scaledBaseCallback(head.data[0], head.data[1]))
            rest = tokens.slice(1)
            break;
        }
        case 'identifier': {
            baseCallback(head.data[0])

            num = DimNum.fromUnit(baseCallback(head.data[0]))
            rest = tokens.slice(1)
            break;
        }
        case 'integer': {
            num = DimNum.dimless(parseInt(head.data[0]))
            rest = tokens.slice(1)
            break;
        }
        case 'decimal': {
            num = DimNum.dimless(parseFloat(head.data[0]))
            rest = tokens.slice(1)
            break;
        }
    }

    // Check that a term was read
    if (num === undefined || rest === undefined) {
        throw new Error("Expected unit term but got " + head.tag)
    }

    // Handle exponentiation
    if (rest.length > 0 && rest[0].tag === 'power') {
        // Experiment. See below.
        // const rec = parsePowers(rest.slice(1))
        // num = num.expt(rec.num)
        // rest = rec.rest
        if (rest[1].tag === 'integer') {
            num = num.expt(parseInt(rest[1].data[0]))
            rest = rest.slice(2)
        } else {
            throw new Error("expected integer power")
        }
    }

    // Return the result
    return { num, rest }
}

/**
 * Experiment that allows powers like 1 ^ 2 ^ 3. However, it does not work for e.g. 1 ^ (2 ^ 3). Would
 * require handling parenthesis in parsePowers. Not worth it!?
 */
// function parsePowers(tokens: Token[]): {num: number, rest: Token[]} {
//     if (tokens.length > 0 && tokens[0].tag === 'integer') {
//         const n = parseInt(tokens[0].data[0])
//         const rest = tokens.slice(1)
//         if (rest.length > 0) {
//             if (rest[0].tag === 'power') {
//                 const rec = parsePowers(rest.slice(1))
//                 return {num: n ** rec.num, rest: rec.rest}
//             } else {
//                 return {num: n, rest: rest}
//             }
//         } else {
//             return {num: n, rest: rest}
//         }
//     } else {
//         throw new Error ("expected power")
//     }
// }
